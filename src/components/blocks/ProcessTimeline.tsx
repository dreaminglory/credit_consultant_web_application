import { ProcessJourney } from "@/components/blocks/ProcessJourney";
import { Container } from "@/components/ui/Container";
import { Mesh } from "@/components/ui/Mesh";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSection, processVariants } from "@/content/process";

/** Process timeline with durations (B-07): the full version for Home `#proces` (PR-5). */
export function ProcessTimeline() {
  return (
    <Section id={processSection.anchor} tone="petrol">
      <Mesh tone="dark" />
      <Container>
        <SectionHeader label={processSection.label} title={processSection.title} />
        <ProcessJourney variants={processVariants} />
      </Container>
    </Section>
  );
}
