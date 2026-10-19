import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { CalculatorTabs } from "@/components/blocks/calculator/CalculatorTabs";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { RelatedCalculators } from "@/components/blocks/RelatedCalculators";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { calculatorsPage } from "@/content/calculators";

export const metadata: Metadata = pageMetadata({
  title: calculatorsPage.title,
  description: calculatorsPage.intro,
  path: "/kalkulatori",
});

/** Calculators overview (T4): hero → the hub (B-23) → every calculator as a card (B-16) → CTA. */
export default function CalculatorsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Калкулатори" }]}
        label="Калкулатори"
        title={calculatorsPage.title}
        intro={calculatorsPage.intro}
      />
      <Section tone="white" className="pt-6 md:pt-8">
        <Container>
          <CalculatorTabs ctaHref={site.consultation.href} />
        </Container>
      </Section>
      <RelatedCalculators
        slugs={site.calculators.map((calc) => calc.slug)}
        label="Калкулатори"
        title={calculatorsPage.allTitle}
      />
      <CtaBand />
    </>
  );
}
