import { appendSheetRow, DeliveryError, sendEmail, verifyTurnstile, type Fetch } from "./delivery";
import {
  autoReply,
  autoReplyHtml,
  autoReplyText,
  leadEmailHtml,
  leadEmailText,
  leadSubject,
  sheetRow,
} from "./format";
import { fieldErrors, leadRequestSchema, toLead, type LeadField } from "./schema";

/**
 * The consultation request pipeline behind `POST /api/lead` (A-10, FR-3…11):
 * rate limit → honeypot → validation → Turnstile → owner email + Sheet in parallel → auto-reply.
 * A request succeeds when **either** delivery succeeds, so one outage never loses a lead
 * (FR-10). Logs carry only the request ID and an error type — never personal data.
 */

export type LeadEnv = {
  RESEND_API_KEY?: string;
  LEAD_FROM_EMAIL?: string;
  LEAD_TO_EMAIL?: string;
  SHEET_WEBHOOK_URL?: string;
  SHEET_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string;
  /** "1" skips the deliveries; honoured only for requests to localhost. */
  LEAD_DRY_RUN?: string;
};

export type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type LeadErrorCode =
  "bad_request" | "rate_limit" | "validation" | "verification" | "config" | "delivery";

export type LeadResponse =
  | { ok: true; requestId: string }
  | {
      ok: false;
      error: LeadErrorCode;
      requestId: string;
      fieldErrors?: Partial<Record<LeadField, string>>;
    };

export type LeadDeps = {
  env: LeadEnv;
  fetch: Fetch;
  requestId: string;
  now: Date;
  ip: string | null;
  /** Hostname the request was sent to; the dry run works only on localhost. */
  host: string;
  limiter?: RateLimiter;
  /** Runs work after the response is sent (Next `after`). */
  schedule: (task: () => Promise<void>) => void;
  log: (entry: { requestId: string; type: string }) => void;
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export async function handleLead(
  body: unknown,
  deps: LeadDeps,
): Promise<{ status: number; body: LeadResponse }> {
  const { env, requestId, log } = deps;
  const fail = (status: number, error: LeadErrorCode, extra?: Partial<LeadResponse>) => ({
    status,
    body: { ok: false, error, requestId, ...extra } as LeadResponse,
  });

  if (deps.limiter && deps.ip) {
    const { success } = await deps.limiter.limit({ key: deps.ip });
    if (!success) {
      log({ requestId, type: "rate_limited" });
      return fail(429, "rate_limit");
    }
  }

  if (typeof body !== "object" || body === null) return fail(400, "bad_request");

  // Bots fill the hidden field: answer like a success and send nothing (FR-4).
  const honeypot = (body as { website?: unknown }).website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    log({ requestId, type: "honeypot" });
    return { status: 200, body: { ok: true, requestId } };
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    log({ requestId, type: "validation" });
    return fail(400, "validation", { fieldErrors: fieldErrors(parsed.error) });
  }

  if (!env.TURNSTILE_SECRET_KEY) {
    log({ requestId, type: "turnstile_not_configured" });
    return fail(500, "config");
  }
  const human = await verifyTurnstile(
    deps.fetch,
    env.TURNSTILE_SECRET_KEY,
    parsed.data.turnstileToken,
    deps.ip,
    requestId,
  );
  if (!human.ok) {
    log({ requestId, type: `turnstile_failed:${human.reason}` });
    return fail(403, "verification");
  }

  const lead = toLead(parsed.data);

  if (env.LEAD_DRY_RUN === "1" && LOCAL_HOSTS.has(deps.host)) {
    log({ requestId, type: "dry_run" });
    return { status: 200, body: { ok: true, requestId } };
  }

  const [email, sheet] = await Promise.allSettled([
    sendEmail(deps.fetch, env.RESEND_API_KEY, {
      from: env.LEAD_FROM_EMAIL ?? "",
      to: env.LEAD_TO_EMAIL ?? "",
      subject: leadSubject(lead),
      html: leadEmailHtml(lead, requestId, deps.now),
      text: leadEmailText(lead, requestId, deps.now),
      replyTo: lead.email ?? undefined,
    }),
    appendSheetRow(
      deps.fetch,
      env.SHEET_WEBHOOK_URL,
      env.SHEET_SECRET,
      sheetRow(lead, requestId, deps.now),
    ),
  ]);

  for (const result of [email, sheet]) {
    if (result.status === "rejected") log({ requestId, type: errorType(result.reason) });
  }

  if (email.status === "rejected" && sheet.status === "rejected") {
    return fail(502, "delivery");
  }

  if (lead.email) {
    const visitorEmail = lead.email;
    deps.schedule(() =>
      sendEmail(deps.fetch, env.RESEND_API_KEY, {
        from: env.LEAD_FROM_EMAIL ?? "",
        to: visitorEmail,
        subject: autoReply.subject,
        html: autoReplyHtml(lead),
        text: autoReplyText(lead),
        replyTo: env.LEAD_TO_EMAIL,
      }).catch((error: unknown) => log({ requestId, type: `auto_reply_${errorType(error)}` })),
    );
  }

  return { status: 200, body: { ok: true, requestId } };
}

function errorType(error: unknown) {
  return error instanceof DeliveryError ? error.type : "unexpected";
}
