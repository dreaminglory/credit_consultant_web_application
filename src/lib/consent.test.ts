import { describe, expect, it } from "vitest";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_S,
  consentCookie,
  makeConsent,
  parseConsent,
  readCookie,
} from "./consent";
import {
  consentModeState,
  conversionTarget,
  hasMarketingIds,
  isMarketingCookie,
  pageLocation,
} from "./tracking";

const now = new Date("2026-10-19T08:00:00.000Z");

describe("consent cookie", () => {
  it("round-trips through the cookie value", () => {
    const consent = makeConsent({ marketing: true, media: false }, now);
    const cookie = consentCookie(consent, true);
    const raw = readCookie(cookie.split(";")[0]!, CONSENT_COOKIE);
    expect(parseConsent(raw)).toEqual(consent);
  });

  it("sets path, max-age, SameSite and Secure", () => {
    const cookie = consentCookie(makeConsent({ marketing: false, media: false }, now), true);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain(`Max-Age=${CONSENT_MAX_AGE_S}`);
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Secure");
    expect(
      consentCookie(makeConsent({ marketing: false, media: false }, now), false),
    ).not.toContain("Secure");
  });

  it("treats missing, broken or other-version values as not decided", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("")).toBeNull();
    expect(parseConsent("%7Bbroken")).toBeNull();
    expect(
      parseConsent(
        encodeURIComponent(
          JSON.stringify({ v: 2, marketing: true, media: true, at: now.toISOString() }),
        ),
      ),
    ).toBeNull();
    expect(
      parseConsent(
        encodeURIComponent(
          JSON.stringify({ v: 1, marketing: "yes", media: true, at: now.toISOString() }),
        ),
      ),
    ).toBeNull();
    expect(
      parseConsent(
        encodeURIComponent(JSON.stringify({ v: 1, marketing: true, media: true, at: "never" })),
      ),
    ).toBeNull();
  });

  it("finds a cookie among others", () => {
    expect(readCookie("a=1; ec_consent=x%3D; b=2", CONSENT_COOKIE)).toBe("x%3D");
    expect(readCookie("a=1", CONSENT_COOKIE)).toBeNull();
  });
});

describe("tracking helpers", () => {
  it("denies everything without marketing consent", () => {
    expect(consentModeState(null)).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    expect(consentModeState({ marketing: false }).ad_storage).toBe("denied");
    expect(consentModeState({ marketing: true }).ad_user_data).toBe("granted");
  });

  it("builds the conversion target only with both ids", () => {
    expect(conversionTarget({ googleAdsId: "AW-1" })).toBeNull();
    expect(conversionTarget({ googleAdsId: "AW-1", googleAdsConversionLabel: "abc" })).toBe(
      "AW-1/abc",
    );
  });

  it("knows when nothing is configured", () => {
    expect(hasMarketingIds({})).toBe(false);
    expect(hasMarketingIds({ metaPixelId: "1" })).toBe(true);
  });

  it("recognises marketing cookies but not the consent cookie", () => {
    expect(isMarketingCookie("_fbp")).toBe(true);
    expect(isMarketingCookie("_gcl_au")).toBe(true);
    expect(isMarketingCookie(CONSENT_COOKIE)).toBe(false);
  });

  it("drops the query string from page locations", () => {
    expect(pageLocation("https://extraconsult.bg", "/krediti")).toBe(
      "https://extraconsult.bg/krediti",
    );
  });
});
