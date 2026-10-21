import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { CtaBand } from "@/components/blocks/CtaBand";
import { FinancingPurposes } from "@/components/blocks/FinancingPurposes";
import { LoanCards } from "@/components/blocks/LoanCards";
import { PageHero } from "@/components/blocks/PageHero";
import { ProcessTimeline } from "@/components/blocks/ProcessTimeline";
import { RelatedCalculators } from "@/components/blocks/RelatedCalculators";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { loansPage } from "@/content/loans";

export const metadata: Metadata = pageMetadata({
  title: loansPage.title,
  description: loansPage.intro,
  path: "/krediti",
});

/** Loans overview (T4): hero → loan cards (B-06) → process for every product (B-07) → calculators (B-16) → CTA. */
export default function LoansPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: loansPage.label }]}
        label={loansPage.label}
        title={loansPage.title}
        intro={loansPage.intro}
      >
        <div className="enter mt-8 max-w-[60ch] border-l-2 border-gold pl-4">
          <strong className="block font-semibold">{site.loansMenuAside.title}</strong>
          <span className="block text-muted">{site.loansMenuAside.text}</span>
          <ButtonLink href={site.consultation.href} className="mt-4">
            {site.consultation.label} <ButtonArrow />
          </ButtonLink>
        </div>
      </PageHero>
      <LoanCards label={loansPage.label} title={loansPage.cardsTitle} tone="white" />
      <FinancingPurposes />
      <ProcessTimeline />
      <RelatedCalculators
        slugs={loansPage.calculators}
        label="Калкулатори"
        title={loansPage.calculatorsTitle}
      />
      <CtaBand />
    </>
  );
}
