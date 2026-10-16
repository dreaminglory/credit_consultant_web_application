import { describe, expect, it } from "vitest";
import { campaignParams, landingSource, nextStoredSource, readStoredSource } from "./attribution";

describe("campaignParams (FR-5)", () => {
  it("keeps only utm_*, gclid and fbclid", () => {
    expect(campaignParams("?utm_source=google&utm_medium=cpc&gclid=abc&name=Ivan&phone=1")).toEqual(
      {
        utm_source: "google",
        utm_medium: "cpc",
        gclid: "abc",
      },
    );
  });
});

describe("landingSource", () => {
  const url = new URL("https://extraconsult.bg/krediti/ipotechni?utm_source=fb&fbclid=x1");

  it("records the landing path, campaign and external referrer origin only", () => {
    expect(landingSource(url, "https://www.facebook.com/some/path?q=private")).toEqual({
      landing: "/krediti/ipotechni?utm_source=fb&fbclid=x1",
      referrer: "https://www.facebook.com",
      utm_source: "fb",
      fbclid: "x1",
    });
  });

  it("drops internal and missing referrers", () => {
    expect(landingSource(url, "https://extraconsult.bg/").referrer).toBeUndefined();
    expect(landingSource(url, "").referrer).toBeUndefined();
  });
});

describe("nextStoredSource", () => {
  const stored = { landing: "/?utm_source=google", utm_source: "google" };

  it("keeps the first landing while browsing", () => {
    expect(nextStoredSource(stored, new URL("https://x.bg/konsultacia"), "")).toBe(stored);
  });

  it("replaces it when a new campaign click arrives", () => {
    const next = nextStoredSource(stored, new URL("https://x.bg/?utm_source=fb"), "");
    expect(next.utm_source).toBe("fb");
  });

  it("starts a record on the first page", () => {
    expect(nextStoredSource(null, new URL("https://x.bg/kalkulatori"), "")).toEqual({
      landing: "/kalkulatori",
    });
  });
});

describe("readStoredSource", () => {
  it("survives junk", () => {
    expect(readStoredSource(null)).toBeNull();
    expect(readStoredSource("{oops")).toBeNull();
    expect(readStoredSource('{"landing":"/","x":1}')).toEqual({ landing: "/" });
  });
});
