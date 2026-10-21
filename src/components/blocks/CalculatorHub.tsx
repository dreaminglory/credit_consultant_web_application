import Link from "next/link";
import { CalculatorTabs } from "@/components/blocks/calculator/CalculatorTabs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { calculatorHub, isReleasedCalculator } from "@/content/calculators";

/**
 * Calculator hub (B-23) for Home `#kalkulatori`: a selection of calculators as tabs and a link
 * to the full list on /kalkulatori.
 */
export function CalculatorHub() {
  return (
    <Section id={calculatorHub.anchor} tone="white">
      <Container>
        <SectionHeader label={calculatorHub.label} title={calculatorHub.title} />
        <CalculatorTabs
          ctaHref="/#konsultacia"
          slugs={calculatorHub.homeSlugs.filter(isReleasedCalculator)}
        />
        <p className="mt-6">
          <Link
            href="/kalkulatori"
            className="font-semibold underline underline-offset-4 hover:no-underline"
          >
            {calculatorHub.allLink}
          </Link>
        </p>
      </Container>
    </Section>
  );
}
