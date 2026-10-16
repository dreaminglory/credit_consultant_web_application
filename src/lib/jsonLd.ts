/** Structured-data helpers (A-16). Output is embedded in a `<script>`, so `<` is escaped. */

export type FaqEntry = { question: string; answer: string };

/** Serialises JSON-LD for a script tag; `<` becomes `<` so content can never close it. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** schema.org FAQPage for the given questions (FAQ-4). */
export function faqPageJsonLd(entries: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
