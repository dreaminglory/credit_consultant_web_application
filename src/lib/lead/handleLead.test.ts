import { describe, expect, it, vi } from "vitest";
import { handleLead, type LeadDeps, type LeadEnv } from "./handleLead";

const PII = ["Мария", "888123456", "maria@example.com", "Пловдив", "Тайна бележка"];

const body = {
  variant: "full",
  product: "refinansirane",
  name: "Мария",
  phone: "0888 123 456",
  city: "Пловдив",
  amount: "90000",
  method: "telefon",
  time: "",
  email: "maria@example.com",
  notes: "Тайна бележка",
  consent: true,
  website: "",
  turnstileToken: "token",
  source: { page: "/konsultacia" },
};

const env: LeadEnv = {
  RESEND_API_KEY: "re_test",
  LEAD_FROM_EMAIL: "site@extraconsult.bg",
  LEAD_TO_EMAIL: "owner@extraconsult.bg",
  SHEET_WEBHOOK_URL: "https://script.google.com/macros/s/test/exec",
  SHEET_SECRET: "secret",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
};

type Outcome = "ok" | "fail" | "throw";

/** Fake upstreams: Turnstile, Resend and the Apps Script, each scripted per test. */
function fakeFetch(outcomes: { turnstile?: Outcome; email?: Outcome; sheet?: Outcome } = {}) {
  const calls: string[] = [];
  const respond = (outcome: Outcome = "ok", okBody: unknown) => {
    if (outcome === "throw") throw new TypeError("network");
    return outcome === "ok"
      ? Response.json(okBody)
      : new Response(JSON.stringify({ error: "Мария leaked?" }), { status: 500 });
  };
  const fetchFn = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    calls.push(url);
    if (url.includes("turnstile"))
      return respond(outcomes.turnstile, { success: outcomes.turnstile !== "fail" });
    if (url.includes("resend")) return respond(outcomes.email, { id: "e1" });
    return respond(outcomes.sheet, { ok: true });
  });
  return { fetchFn: fetchFn as unknown as typeof fetch, calls };
}

function deps(overrides: Partial<LeadDeps> = {}) {
  const logs: string[] = [];
  const tasks: (() => Promise<void>)[] = [];
  const result: LeadDeps = {
    env,
    fetch: fakeFetch().fetchFn,
    requestId: "req-1",
    now: new Date(Date.UTC(2026, 9, 16, 9, 0)),
    ip: "203.0.113.5",
    host: "extraconsult.bg",
    schedule: (task) => tasks.push(task),
    log: (entry) => logs.push(JSON.stringify(entry)),
    ...overrides,
  };
  return { deps: result, logs, tasks };
}

const expectNoPii = (logs: string[]) => {
  for (const line of logs) for (const value of PII) expect(line).not.toContain(value);
};

describe("handleLead (A-10, FR-10)", () => {
  it("delivers to email and Sheet and schedules the auto-reply", async () => {
    const { fetchFn, calls } = fakeFetch();
    const { deps: d, tasks } = deps({ fetch: fetchFn });
    const result = await handleLead(body, d);
    expect(result).toEqual({ status: 200, body: { ok: true, requestId: "req-1" } });
    expect(calls.filter((u) => u.includes("resend"))).toHaveLength(1);
    expect(calls.filter((u) => u.includes("script.google"))).toHaveLength(1);
    expect(tasks).toHaveLength(1);
    await tasks[0]!();
    expect(calls.filter((u) => u.includes("resend"))).toHaveLength(2);
  });

  it("succeeds when only the Sheet works", async () => {
    const { deps: d, logs } = deps({ fetch: fakeFetch({ email: "fail" }).fetchFn });
    expect((await handleLead(body, d)).status).toBe(200);
    expect(logs.join()).toContain("email_http_500");
    expectNoPii(logs);
  });

  it("succeeds when only the email works", async () => {
    const { deps: d, logs } = deps({ fetch: fakeFetch({ sheet: "throw" }).fetchFn });
    expect((await handleLead(body, d)).status).toBe(200);
    expect(logs.join()).toContain("sheet_network");
  });

  it("returns 502 when both deliveries fail, without personal data in logs", async () => {
    const {
      deps: d,
      logs,
      tasks,
    } = deps({
      fetch: fakeFetch({ email: "fail", sheet: "fail" }).fetchFn,
    });
    const result = await handleLead(body, d);
    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ ok: false, error: "delivery" });
    expect(tasks).toHaveLength(0);
    expectNoPii(logs);
  });

  it("treats missing configuration as a failed delivery", async () => {
    const { deps: d } = deps({ env: { TURNSTILE_SECRET_KEY: "x" } });
    expect((await handleLead(body, d)).status).toBe(502);
  });

  it("returns field errors for invalid input", async () => {
    const { deps: d, logs } = deps();
    const result = await handleLead({ ...body, phone: "12", city: "" }, d);
    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({ error: "validation" });
    if (!result.body.ok)
      expect(Object.keys(result.body.fieldErrors ?? {})).toEqual(["phone", "city"]);
    expectNoPii(logs);
  });

  it("answers a filled honeypot like a success and sends nothing", async () => {
    const { fetchFn, calls } = fakeFetch();
    const { deps: d } = deps({ fetch: fetchFn });
    const result = await handleLead({ ...body, website: "http://spam" }, d);
    expect(result.status).toBe(200);
    expect(calls).toHaveLength(0);
  });

  it("rejects a failed Turnstile check", async () => {
    const { fetchFn, calls } = fakeFetch({ turnstile: "fail" });
    const { deps: d } = deps({ fetch: fetchFn });
    expect((await handleLead(body, d)).status).toBe(403);
    expect(calls).toHaveLength(1);
  });

  it("logs why Turnstile rejected the request, without personal data", async () => {
    const fetchFn = vi.fn(async () =>
      Response.json({ success: false, "error-codes": ["invalid-input-secret", "<script>"] }),
    ) as unknown as typeof fetch;
    const { deps: d, logs } = deps({ fetch: fetchFn });
    expect((await handleLead(body, d)).body).toMatchObject({ error: "verification" });
    expect(logs).toContain(
      JSON.stringify({ requestId: "req-1", type: "turnstile_failed:invalid-input-secret" }),
    );
    expectNoPii(logs);
  });

  it("logs a missing token and an unreachable siteverify", async () => {
    const noToken = deps();
    await handleLead({ ...body, turnstileToken: undefined }, noToken.deps);
    expect(noToken.logs.join()).toContain("turnstile_failed:no_token");

    const { fetchFn } = fakeFetch({ turnstile: "throw" });
    const down = deps({ fetch: fetchFn });
    await handleLead(body, down.deps);
    expect(down.logs.join()).toContain("turnstile_failed:unreachable");
  });

  it("refuses without a Turnstile secret", async () => {
    const { deps: d } = deps({ env: { ...env, TURNSTILE_SECRET_KEY: undefined } });
    expect((await handleLead(body, d)).body).toMatchObject({ error: "config" });
  });

  it("rate limits per IP", async () => {
    const limit = vi.fn(async () => ({ success: false }));
    const { deps: d } = deps({ limiter: { limit } });
    expect((await handleLead(body, d)).status).toBe(429);
    expect(limit).toHaveBeenCalledWith({ key: "203.0.113.5" });
  });

  it("rejects non-object bodies", async () => {
    expect((await handleLead(null, deps().deps)).status).toBe(400);
  });

  it("skips deliveries in dry-run mode on localhost only", async () => {
    const local = fakeFetch();
    const dry = { ...env, LEAD_DRY_RUN: "1" };
    await handleLead(body, deps({ env: dry, host: "localhost", fetch: local.fetchFn }).deps);
    expect(local.calls.filter((u) => !u.includes("turnstile"))).toHaveLength(0);

    const live = fakeFetch();
    await handleLead(body, deps({ env: dry, host: "extraconsult.bg", fetch: live.fetchFn }).deps);
    expect(live.calls.filter((u) => u.includes("resend"))).toHaveLength(1);
  });
});
