import { getCloudflareContext } from "@opennextjs/cloudflare";
import { after } from "next/server";
import { handleLead, type RateLimiter } from "@/lib/lead/handleLead";

/**
 * `POST /api/lead` — the site's only server code (TR-2, A-10). Thin adapter: reads the
 * request, env and the Workers rate-limit binding, and hands over to `handleLead`.
 */

const MAX_BODY_BYTES = 16_000;

/** Rate-limit binding from wrangler.jsonc; absent under plain `next dev` without bindings. */
function rateLimiter(): RateLimiter | undefined {
  try {
    const env = getCloudflareContext().env as { LEAD_LIMITER?: RateLimiter };
    return env.LEAD_LIMITER;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const log = (entry: { requestId: string; type: string }) =>
    console.error(JSON.stringify({ scope: "lead", ...entry }));

  const text = await request.text();
  let body: unknown = null;
  if (text.length <= MAX_BODY_BYTES) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;

  const result = await handleLead(body, {
    env: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      LEAD_FROM_EMAIL: process.env.LEAD_FROM_EMAIL,
      LEAD_TO_EMAIL: process.env.LEAD_TO_EMAIL,
      SHEET_WEBHOOK_URL: process.env.SHEET_WEBHOOK_URL,
      SHEET_SECRET: process.env.SHEET_SECRET,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
      LEAD_DRY_RUN: process.env.LEAD_DRY_RUN,
    },
    fetch,
    requestId,
    now: new Date(),
    ip,
    host: new URL(request.url).hostname,
    limiter: rateLimiter(),
    schedule: (task) => after(task),
    log,
  });

  return Response.json(result.body, {
    status: result.status,
    headers: { "Cache-Control": "no-store" },
  });
}
