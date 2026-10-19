import type { LeadSource } from "./schema";

/**
 * Ad attribution for the consultation form (FR-5). The landing page of the session, its
 * campaign parameters and the external referrer are kept in sessionStorage (this tab only) and
 * sent only together with a request. Nothing here identifies a person.
 */

export const ATTRIBUTION_KEY = "ec-source";

const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

const MAX = 300;

/** Campaign parameters of a query string; other parameters are ignored. */
export function campaignParams(search: string): LeadSource {
  const params = new URLSearchParams(search);
  const found: LeadSource = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key)?.trim();
    if (value) found[key] = value.slice(0, MAX);
  }
  return found;
}

/** Landing record for the first page of a session. Internal referrers are dropped. */
export function landingSource(url: URL, referrer: string): LeadSource {
  let externalReferrer: string | undefined;
  try {
    const ref = new URL(referrer);
    // Only the origin: a referrer path can carry someone else's query data.
    if (ref.host !== url.host) externalReferrer = ref.origin;
  } catch {
    // No or invalid referrer.
  }
  return {
    landing: (url.pathname + url.search).slice(0, MAX),
    ...(externalReferrer ? { referrer: externalReferrer } : {}),
    ...campaignParams(url.search),
  };
}

/**
 * Keeps the first landing of the session, unless a later page arrives with its own campaign
 * parameters (a new ad click in the same tab): then that page becomes the landing.
 */
export function nextStoredSource(stored: LeadSource | null, url: URL, referrer: string) {
  const hasCampaign = Object.keys(campaignParams(url.search)).length > 0;
  if (stored && !hasCampaign) return stored;
  return landingSource(url, referrer);
}

export function readStoredSource(raw: string | null): LeadSource | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    return Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    ) as LeadSource;
  } catch {
    return null;
  }
}
