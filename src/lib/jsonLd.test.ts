import { describe, expect, it } from "vitest";
import { pending } from "@/config/pending";
import { site } from "@/config/site";
import { breadcrumbJsonLd, businessJsonLd, faqPageJsonLd, serializeJsonLd } from "./jsonLd";

describe("serializeJsonLd", () => {
  it("escapes angle brackets so the script tag cannot be closed", () => {
    const out = serializeJsonLd({ text: "</script><b>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).text).toBe("</script><b>");
  });
});

describe("faqPageJsonLd", () => {
  it("builds a FAQPage with one Question per entry", () => {
    const data = faqPageJsonLd([{ question: "Въпрос?", answer: "Отговор." }]);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Въпрос?",
        acceptedAnswer: { "@type": "Answer", text: "Отговор." },
      },
    ]);
  });
});

describe("businessJsonLd", () => {
  const graph = businessJsonLd(site, "/img/portrait.webp")["@graph"];
  const business = graph[0];
  const person = graph[1];

  it("describes the Plovdiv service for all of Bulgaria, linked to the consultant", () => {
    expect(business["@type"]).toBe("FinancialService");
    expect(business).toMatchObject({ address: { addressLocality: "Пловдив" } });
    expect(business.areaServed).toEqual({ "@type": "Country", name: "Bulgaria" });
    expect(business.founder).toEqual({ "@id": person["@id"] });
    expect(person).toMatchObject({ "@type": "Person", name: site.person.name });
  });

  it("never emits draft values", () => {
    const draft = pending("O-5", "phone", "0888 000 000");
    const data = businessJsonLd(
      { ...site, contact: { ...site.contact, phoneE164: draft, email: draft } },
      "/img/portrait.webp",
    );
    const json = serializeJsonLd(data);
    expect(json).not.toContain("0888 000 000");
    expect(json).not.toContain("O-5");
  });

  it("uses absolute URLs", () => {
    expect(business.image).toBe(new URL("/img/portrait.webp", site.url).toString());
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers the trail and links every crumb but the current page", () => {
    const data = breadcrumbJsonLd("https://example.bg", [
      { label: "Начало", href: "/" },
      { label: "Кредити", href: "/krediti" },
      { label: "Ипотечни" },
    ]);
    expect(data.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, "https://example.bg/"],
      [2, "https://example.bg/krediti"],
      [3, undefined],
    ]);
  });
});
