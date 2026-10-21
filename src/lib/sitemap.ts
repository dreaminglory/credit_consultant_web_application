import type { Calculator, Loan } from "@/config/site";

/** Legal pages (T6) — also listed in the footer via `site.legalLinks`. */
const legalPaths = ["/poveritelnost", "/biskvitki", "/obshti-usloviya"];

/**
 * Every indexable path (TR-8). Thank-you, 404, the dev kit and calculators that are still hidden
 * (O-12) are left out on purpose.
 */
export function sitemapPaths(site: {
  loans: readonly Pick<Loan, "slug">[];
  calculators: readonly Calculator[];
}): string[] {
  return [
    "/",
    "/krediti",
    ...site.loans.map((loan) => `/krediti/${loan.slug}`),
    "/kalkulatori",
    ...site.calculators.filter((c) => c.available).map((c) => `/kalkulatori/${c.slug}`),
    "/konsultacia",
    "/kontakti",
    ...legalPaths,
  ];
}
