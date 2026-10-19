/**
 * Cookie consent state (B-22, LC-2, A-13). Pure helpers: the browser side lives in
 * `components/consent`. The choice is stored in a first-party cookie so it is the same on every
 * page; a missing, broken or older-version cookie counts as "not decided", so the banner shows.
 */

export const CONSENT_COOKIE = "ec_consent";
export const CONSENT_VERSION = 1;
/** Ask again after 6 months. */
export const CONSENT_MAX_AGE_S = 60 * 60 * 24 * 182;

/** Optional categories; strictly necessary storage needs no consent and is always on. */
export type ConsentCategory = "marketing" | "media";

export type Consent = {
  v: typeof CONSENT_VERSION;
  /** Meta Pixel, Google Ads (FR-28). */
  marketing: boolean;
  /** External content: the live Google Map (FR-27). */
  media: boolean;
  /** ISO time of the decision, kept as proof of consent. */
  at: string;
};

export function makeConsent(choice: Record<ConsentCategory, boolean>, now: Date): Consent {
  return {
    v: CONSENT_VERSION,
    marketing: choice.marketing,
    media: choice.media,
    at: now.toISOString(),
  };
}

/** Reads the consent from a raw cookie value; `null` when the visitor has not decided. */
export function parseConsent(raw: string | null | undefined): Consent | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const { v, marketing, media, at } = data as Record<string, unknown>;
  if (v !== CONSENT_VERSION) return null;
  if (typeof marketing !== "boolean" || typeof media !== "boolean") return null;
  if (typeof at !== "string" || Number.isNaN(Date.parse(at))) return null;
  return { v, marketing, media, at };
}

/** Finds one cookie's raw value in a `document.cookie` string. */
export function readCookie(cookieHeader: string, name: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

/** Full `Set-Cookie`-style string for `document.cookie`. */
export function consentCookie(consent: Consent, secure: boolean): string {
  const value = encodeURIComponent(JSON.stringify(consent));
  return [
    `${CONSENT_COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${CONSENT_MAX_AGE_S}`,
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}
