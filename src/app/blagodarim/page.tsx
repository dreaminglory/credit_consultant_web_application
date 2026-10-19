import type { Metadata } from "next";
import { site } from "@/config/site";
import { autoReply, thanksPage } from "@/content/lead";
import { processVariants } from "@/content/process";
import { ContactActions } from "@/components/blocks/ContactActions";
import { Conversion } from "@/components/consent/Conversion";
import { PageHero } from "@/components/blocks/PageHero";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Value } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: thanksPage.title,
  robots: { index: false, follow: false },
  alternates: { canonical: site.lead.thanksHref },
};

/** The opening steps are the same for every product, so they fit any request. */
const firstSteps = processVariants[0]!.steps.slice(0, 3);

/**
 * Thank-you page (T5, FR-6, FR-11): the ad conversion target. Shows the auto-reply message and
 * what happens next — never anything the visitor typed.
 */
export default function ThanksPage() {
  return (
    <>
      <Conversion />
      <PageHero
        breadcrumbs={[{ label: thanksPage.label }]}
        label={thanksPage.label}
        title={autoReply.title}
        intro={autoReply.text}
      >
        <p className="enter mt-4 max-w-[60ch] text-muted">{autoReply.noPersonalDocs}</p>
      </PageHero>

      <Section tone="white">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            label={thanksPage.nextLabel}
            title={thanksPage.nextTitle}
            titleClassName="text-[clamp(32px,4vw,52px)]"
          />
          <ol className="grid gap-4">
            {firstSteps.map((step, index) => (
              <li key={step.id} className="flex gap-4 border-t border-line pt-4">
                <span className="font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[22px]">{step.title}</h3>
                  <p className="mt-2 text-muted">{step.text}</p>
                  <p className="mt-2 font-mono text-xs tracking-[0.06em] text-muted uppercase">
                    <Value value={step.duration} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeader
            label={thanksPage.meanwhile}
            title={thanksPage.meanwhileTitle}
            titleClassName="text-[clamp(32px,4vw,52px)]"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/kalkulatori" variant="dark">
              {thanksPage.calculatorsLink} <ButtonArrow />
            </ButtonLink>
            <ButtonLink href="/" variant="line">
              {thanksPage.homeLink}
            </ButtonLink>
          </div>
          <ContactActions variant="line" className="mt-3" />
        </Container>
      </Section>
    </>
  );
}
