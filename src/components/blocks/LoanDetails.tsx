import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { loanPage, type LoanPageCopy } from "@/content/loans";

type LoanDetailsProps = {
  /** Mono label of the first section: the loan's name. */
  name: string;
  copy: LoanPageCopy;
};

/**
 * Loan page body (T2, CR-4): "what it is" next to "who it is for", then the requirements on
 * sand. Copy from `src/content/loans.ts`; no figures besides the BNB limits from config.
 */
export function LoanDetails({ name, copy }: LoanDetailsProps) {
  return (
    <>
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <SectionHeader
              label={name}
              title={copy.what.title}
              titleClassName="text-[clamp(32px,4vw,52px)]"
            />
            <div className="mt-6 grid max-w-[62ch] gap-4 text-lg text-muted">
              {copy.what.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
          <Reveal className="lg:self-start">
            <GlassCard className="bg-white/85 p-7 md:p-9">
              <h3 className="text-[26px]">{loanPage.forWhomTitle}</h3>
              <ul className="mt-6 grid gap-4">
                {copy.forWhom.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-2.5 shrink-0 rounded-full bg-gold"
                    />
                    <span className="text-lg leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              label={loanPage.requirementsLabel}
              title={loanPage.requirementsTitle}
              titleClassName="text-[clamp(32px,4vw,52px)]"
            />
            <p className="mt-6 max-w-[48ch] text-lg text-muted">{loanPage.requirementsNote}</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line">
            {copy.requirements.map((item) => (
              <li key={item} className="flex gap-4 bg-paper p-6 md:p-7">
                <span aria-hidden="true" className="w-0.5 shrink-0 self-stretch bg-gold" />
                <span className="text-lg leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
