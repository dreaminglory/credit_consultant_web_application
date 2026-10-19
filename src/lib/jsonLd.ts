/** Structured-data helpers (A-16). Output is embedded in a `<script>`, so `<` is escaped. */

import { isPending, type MaybePending } from "@/config/pending";
import type { Site } from "@/config/site";

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

/** Drafts never go into structured data: a pending value becomes `undefined` (dropped by JSON). */
function known(value: MaybePending): string | undefined {
  return isPending(value) ? undefined : value;
}

const absolute = (origin: string, path: string) => new URL(path, origin).toString();

type SeoSite = Pick<Site, "url" | "person" | "brand" | "legal" | "contact" | "office">;

const ids = (origin: string) => ({
  business: absolute(origin, "/#business"),
  person: absolute(origin, "/#person"),
  website: absolute(origin, "/#website"),
});

/**
 * The consultant (Person) and her service (FinancialService with the Plovdiv address and
 * `areaServed: Bulgaria`, TR-8, BM-10) as one graph for Home.
 */
export function businessJsonLd(site: SeoSite, image: string) {
  const id = ids(site.url);
  const telephone = known(site.contact.phoneE164);
  const email = known(site.contact.email);
  const street = known(site.office.address);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "@id": id.business,
        name: site.brand.name,
        description: site.brand.description,
        url: absolute(site.url, "/"),
        image: absolute(site.url, image),
        telephone,
        email,
        address: {
          "@type": "PostalAddress",
          streetAddress: street,
          addressLocality: site.office.city,
          addressCountry: "BG",
        },
        areaServed: { "@type": "Country", name: "Bulgaria" },
        openingHoursSpecification: isPending(site.office.hours)
          ? undefined
          : {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: site.office.openingHours.days,
              opens: site.office.openingHours.opens,
              closes: site.office.openingHours.closes,
            },
        priceRange: "Безплатна консултация",
        founder: { "@id": id.person },
        employee: { "@id": id.person },
        identifier: { "@type": "PropertyValue", propertyID: "ЕИК", value: site.legal.eik },
      },
      {
        "@type": "Person",
        "@id": id.person,
        name: site.person.name,
        alternateName: site.person.nameLatin,
        jobTitle: site.person.role,
        image: absolute(site.url, image),
        worksFor: { "@id": id.business },
        url: absolute(site.url, "/#za-men"),
      },
      {
        "@type": "WebSite",
        "@id": id.website,
        name: site.brand.name,
        url: absolute(site.url, "/"),
        inLanguage: "bg",
        publisher: { "@id": id.business },
      },
    ],
  };
}

/**
 * BreadcrumbList for an inner page. The last crumb is the current page and may have no `item`
 * (allowed by Google's breadcrumb guidelines).
 */
export function breadcrumbJsonLd(
  origin: string,
  trail: readonly { label: string; href?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? absolute(origin, crumb.href) : undefined,
    })),
  };
}
