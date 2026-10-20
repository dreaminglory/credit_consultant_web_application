import { describe, expect, it } from "vitest";
import { pageMetadata, robotsRules } from "./seo";

describe("robotsRules", () => {
  it("blocks all crawling before launch and lists no sitemap", () => {
    expect(robotsRules(false, "https://extraconsultbg.com")).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
  });

  it("opens the public pages after launch and points to the sitemap", () => {
    const robots = robotsRules(true, "https://extraconsultbg.com");
    expect(robots.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/blagodarim", "/dev/"],
    });
    expect(robots.sitemap).toBe("https://extraconsultbg.com/sitemap.xml");
  });
});

describe("pageMetadata", () => {
  it("sets the canonical and repeats the shared Open Graph defaults", () => {
    const meta = pageMetadata({ title: "Т", description: "О", path: "/kontakti" });
    expect(meta.alternates).toEqual({ canonical: "/kontakti" });
    expect(meta.openGraph).toMatchObject({ title: "Т", url: "/kontakti", locale: "bg_BG" });
  });
});
