import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PlaceholderBox } from "@/components/ui/Placeholder";
import { Section, type SectionTone } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type SectionStubProps = {
  id: string;
  label: string;
  title: string;
  /** Milestone and block that will replace this stub, e.g. "M4 · B-07". */
  milestone: string;
  tone?: SectionTone;
  children?: ReactNode;
};

/**
 * Temporary stand-in for an interactive Home section built in a later milestone. It keeps the
 * anchor, order and rhythm of the page (HP-2) so nav links and scroll-spy already work.
 * Delete each use as its real block lands (M4–M6).
 */
export function SectionStub({
  id,
  label,
  title,
  milestone,
  tone = "paper",
  children,
}: SectionStubProps) {
  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeader label={label} title={title} />
        <div className="mt-10 max-w-[640px]">
          <PlaceholderBox item={`В РАЗРАБОТКА · ${milestone}`}>
            Този раздел се изгражда в следваща стъпка от проекта.
          </PlaceholderBox>
        </div>
        {children}
      </Container>
    </Section>
  );
}
