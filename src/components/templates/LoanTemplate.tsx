import Link from "next/link";
import { site, type LoanSlug } from "@/config/site";
import { BankLogos } from "@/components/blocks/BankLogos";
import { Calculator } from "@/components/blocks/calculator/Calculator";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Faq } from "@/components/blocks/Faq";
import { FinancingPurposes } from "@/components/blocks/FinancingPurposes";
import { ConsultationSection } from "@/components/blocks/lead/ConsultationSection";
import { LoanCards } from "@/components/blocks/LoanCards";
import { LoanDetails } from "@/components/blocks/LoanDetails";
import { PageHero } from "@/components/blocks/PageHero";
import { ProcessTimeline } from "@/components/blocks/ProcessTimeline";
import { Testimonials } from "@/components/blocks/Testimonials";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { faqCategories } from "@/content/faq";
import { leadSection } from "@/content/lead";
import { loanCopy, loanPage } from "@/content/loans";

/** Every on-page CTA goes to the compact form below, already set to this product (FR-7). */
const formHref = `#${leadSection.anchor}`;

/**
 * Loan page (T2, REQUIREMENTS §4.1): hero → what / who / requirements → product process (B-07)
 * → calculator (B-12) → banks (B-08) → reviews for this product (B-10) → its FAQ (B-13) →
 * consultation form (B-17) → related loans (B-15) → CTA band (B-14).
 */
export function LoanTemplate({ slug }: { slug: LoanSlug }) {
  const loan = site.loans.find((l) => l.slug === slug)!;
  const copy = loanCopy[slug];
  const faq = faqCategories.filter((c) => c.loan === slug);

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: loanPage.breadcrumb, href: "/krediti" }, { label: loan.name }]}
        label={loan.name}
        title={copy.title}
        intro={copy.intro}
        facts={copy.keyFacts}
      >
        <ButtonLink href={formHref} variant="dark" className="enter mt-8">
          {loanPage.heroCta} <ButtonArrow />
        </ButtonLink>
      </PageHero>

      <LoanDetails name={loan.name} copy={copy} />
      {slug === "ipotechni" && <FinancingPurposes ctaHref={formHref} tone="white" />}
      <ProcessTimeline variant={slug} />

      <Section tone="white">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              label={loanPage.calculatorLabel}
              title={loanPage.calculatorTitle}
              titleClassName="text-[clamp(32px,4vw,52px)]"
            />
            <Link href="/kalkulatori" className="font-semibold underline underline-offset-4">
              {loanPage.calculatorAll} →
            </Link>
          </div>
          <Calculator slug={copy.calculator} ctaHref={formHref} className="mt-10" />
        </Container>
      </Section>

      <BankLogos />
      <Testimonials product={slug} />
      {faq.length > 0 && <Faq categories={faq} />}
      <ConsultationSection product={slug} />
      <LoanCards
        slugs={copy.related}
        label={loanPage.relatedLabel}
        title={loanPage.relatedTitle}
        tone="sand"
      />
      <CtaBand />
    </>
  );
}
