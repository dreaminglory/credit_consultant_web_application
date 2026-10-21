import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { sitemapPaths } from "./sitemap";

describe("sitemapPaths", () => {
  const paths = sitemapPaths(site);

  it("lists home, every loan, the legal pages and only released calculators", () => {
    expect(paths).toContain("/");
    expect(paths).toContain("/krediti/ipotechni");
    expect(paths).toContain("/poveritelnost");
    expect(paths).toContain("/kalkulatori/mesechna-vnoska");
    expect(paths).toContain("/kalkulatori/taksi-pri-pokupka");
  });

  it("leaves out calculators that are not released", () => {
    const calculators = site.calculators.map((c) =>
      c.slug === "cena-na-imota" ? { ...c, available: false } : c,
    );
    expect(sitemapPaths({ ...site, calculators })).not.toContain("/kalkulatori/cena-na-imota");
  });

  it("leaves out pages that must not be indexed", () => {
    expect(paths).not.toContain("/blagodarim");
    expect(paths.some((p) => p.startsWith("/dev"))).toBe(false);
  });

  it("has no duplicates", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
});
