import type { Consent } from "./consent";

/**
 * Pure parts of the consent-gated ad tracking (FR-28). Nothing here touches the DOM; the
 * loader is `components/consent/tracker.ts`.
 */

export type TrackingIds = {
  metaPixelId?: string;
  googleAdsId?: string;
  googleAdsConversionLabel?: string;
};

type ConsentValue = "granted" | "denied";

/** Google Consent Mode v2 state for a consent choice; everything denied by default. */
export function consentModeState(consent: Pick<Consent, "marketing"> | null) {
  const value: ConsentValue = consent?.marketing ? "granted" : "denied";
  return {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  } as const;
}

/** Google Ads `send_to` for the request conversion, or null until both IDs are configured. */
export function conversionTarget(ids: TrackingIds): string | null {
  if (!ids.googleAdsId || !ids.googleAdsConversionLabel) return null;
  return `${ids.googleAdsId}/${ids.googleAdsConversionLabel}`;
}

/** True when there is anything to load at all. */
export function hasMarketingIds(ids: TrackingIds): boolean {
  return Boolean(ids.metaPixelId || ids.googleAdsId);
}

/** First-party cookies set by Meta Pixel and Google Ads; cleared when consent is withdrawn. */
export const marketingCookiePrefixes = ["_fbp", "_fbc", "_gcl_", "_ga", "_gid"] as const;

export function isMarketingCookie(name: string): boolean {
  return marketingCookiePrefixes.some((prefix) => name.startsWith(prefix));
}

/**
 * Page URL for client-side page views: origin + path only. Query strings may hold campaign or
 * other parameters and never go into analytics events (CLAUDE.md privacy rules).
 */
export function pageLocation(origin: string, pathname: string): string {
  return `${origin}${pathname}`;
}
