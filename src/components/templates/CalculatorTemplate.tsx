import Link from "next/link";
import { site } from "@/config/site";
import { Calculator } from "@/components/blocks/calculator/Calculator";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { RelatedCalculators } from "@/components/blocks/RelatedCalculators";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Section } from "@/components/ui/Section";
import {
  calculatorCopy,
  calculatorsPage,
  calculatorUi,
  type LiveCalculatorSlug,
} from "@/content/calculators";

/**
 * Calculator page (T3): hero → full calculator → how to read the result → related calculators
 * → the relevant loan → CTA band.
 */
export function CalculatorTemplate({
  slug,
  preview = false,
}: {
  slug: LiveCalculatorSlug;
  /** Dev-only review of an unreleased calculator (O-12): shows a notice above the hero. */
  preview?: boolean;
}) {
  const copy = calculatorCopy[slug];
  const loan = site.loans.find((l) => l.slug === copy.loan)!;

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Калкулатори", href: "/kalkulatori" }, { label: copy.tab }]}
        label="Калкулатор"
        title={copy.title}
        intro={copy.intro}
      />

      <Section tone="white" className="pt-10 md:pt-14">
        <Container>
          {preview && (
            <p
              role="note"
              className="mb-6 rounded-tile bg-gold px-5 py-3 text-[15px] font-semibold text-ink"
            >
              {calculatorUi.unreleased}
            </p>
          )}
          <Calculator slug={slug} ctaHref={`${site.consultation.href}?produkt=${loan.slug}`} />
        </Container>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Label>{calculatorsPage.explainerTitle}</Label>
            <h2 className="mt-3.5 text-[clamp(32px,4vw,52px)]">{copy.headline}</h2>
          </div>
          <div>
            <ol className="grid gap-4">
              {copy.explainer.map((text, index) => (
                <li key={text} className="flex gap-4 border-t border-line pt-4">
                  <span className="font-mono text-sm text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg">{text}</p>
                </li>
              ))}
            </ol>
            <Link
              href={`/krediti/${loan.slug}`}
              className="group mt-8 flex items-center justify-between gap-4 rounded-tile bg-sand p-5 no-underline transition-colors duration-150 hover:bg-sand/70"
            >
              <span>
                <span className="block font-semibold">{loan.name}</span>
                <span className="block text-[15px] text-muted">{loan.summary}</span>
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform duration-150 ease-out-soft group-hover:translate-x-0.5">
                <Icon name="arrow" className="size-5" />
                <span className="sr-only">{calculatorsPage.loanLink}</span>
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <RelatedCalculators slugs={copy.related} label="Още калкулатори" title="Пресметнете и това" />
      <CtaBand />
    </>
  );
}
