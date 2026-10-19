/**
 * Outbound calls of the lead handler (A-11): Resend REST API for email, a Google Apps Script
 * web app for the Sheet, Cloudflare siteverify for Turnstile. Plain `fetch`, no SDKs. Errors
 * carry only a short type (never response bodies, which may echo personal data).
 */

export type Fetch = typeof fetch;

const TIMEOUT_MS = 8000;

export class DeliveryError extends Error {
  constructor(readonly type: string) {
    super(type);
    this.name = "DeliveryError";
  }
}

export type Email = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendEmail(fetchFn: Fetch, apiKey: string | undefined, email: Email) {
  if (!apiKey || !email.from || !email.to) throw new DeliveryError("email_not_configured");
  let response: Response;
  try {
    response = await fetchFn("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new DeliveryError("email_network");
  }
  if (!response.ok) throw new DeliveryError(`email_http_${response.status}`);
}

export async function appendSheetRow(
  fetchFn: Fetch,
  url: string | undefined,
  secret: string | undefined,
  row: readonly (string | number)[],
) {
  if (!url || !secret) throw new DeliveryError("sheet_not_configured");
  let response: Response;
  try {
    // Apps Script answers with a redirect to the script output; fetch follows it.
    response = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, row }),
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new DeliveryError("sheet_network");
  }
  if (!response.ok) throw new DeliveryError(`sheet_http_${response.status}`);
  const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
  if (!result?.ok) throw new DeliveryError("sheet_rejected");
}

/** Cloudflare Turnstile server-side check (FR-4). */
export async function verifyTurnstile(
  fetchFn: Fetch,
  secret: string,
  token: string | undefined,
  ip: string | null,
  idempotencyKey: string,
): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  body.append("idempotency_key", idempotencyKey);
  if (ip) body.append("remoteip", ip);
  try {
    const response = await fetchFn("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
