import { describe, expect, it } from "vitest";
import { faqPageJsonLd, serializeJsonLd } from "./jsonLd";

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
