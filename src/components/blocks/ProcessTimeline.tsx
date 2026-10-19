import { ProcessJourney } from "@/components/blocks/ProcessJourney";
import { Container } from "@/components/ui/Container";
import { Mesh } from "@/components/ui/Mesh";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { LoanSlug } from "@/config/site";
import { processSection, processVariants } from "@/content/process";

/**
 * Process timeline with durations (B-07). Home `#proces` and `/krediti` show every product as
 * tabs (PR-5); a loan page passes `variant` to show only its own steps (PR-3).
 */
export function ProcessTimeline({ variant }: { variant?: LoanSlug }) {
  const variants = variant ? processVariants.filter((v) => v.id === variant) : processVariants;
  return (
    <Section id={processSection.anchor} tone="petrol">
      <Mesh tone="dark" />
      <Container>
        <SectionHeader label={processSection.label} title={processSection.title} />
        <ProcessJourney variants={variants} />
      </Container>
    </Section>
  );
}
