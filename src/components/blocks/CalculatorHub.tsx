import Link from "next/link";
import { CalculatorTabs } from "@/components/blocks/calculator/CalculatorTabs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { calculatorHub, calculatorsPage } from "@/content/calculators";

/** Calculator hub (B-23) for Home `#kalkulatori`: all live calculators as tabs. */
export function CalculatorHub() {
  return (
    <Section id={calculatorHub.anchor} tone="white">
      <Container>
        <SectionHeader label={calculatorHub.label} title={calculatorHub.title} />
        <CalculatorTabs ctaHref="/#konsultacia" />
        <p className="mt-6">
          <Link
            href="/kalkulatori"
            className="font-semibold underline underline-offset-4 hover:no-underline"
          >
            {calculatorsPage.allTitle}
          </Link>
        </p>
      </Container>
    </Section>
  );
}
