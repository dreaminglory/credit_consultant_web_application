import Link from "next/link";
import { site, type CalculatorSlug } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section, type SectionTone } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { calculatorHub } from "@/content/calculators";

type RelatedCalculatorsProps = {
  /** Calculators to show, in order; ones not yet released (O-12) are shown as coming. */
  slugs: readonly CalculatorSlug[];
  label: string;
  title: string;
  tone?: SectionTone;
};

/**
 * Calculator cards (B-16): related calculators on a T3 page, or every calculator on the
 * `/kalkulatori` overview. Names and hints come from config, like the header dropdown.
 */
export function RelatedCalculators({
  slugs,
  label,
  title,
  tone = "sand",
}: RelatedCalculatorsProps) {
  const calculators = slugs
    .map((slug) => site.calculators.find((calc) => calc.slug === slug))
    .filter((calc) => calc !== undefined);

  return (
    <Section tone={tone}>
      <Container>
        <SectionHeader label={label} title={title} titleClassName="text-[clamp(32px,4vw,52px)]" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc, index) => (
            <li key={calc.slug}>
              <Reveal delay={(index % 3) * 80} className="h-full">
                {calc.available ? (
                  <GlassCard className="group relative flex h-full flex-col gap-3 bg-white/85 p-6 transition-[translate,box-shadow] duration-250 ease-out-soft focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-float">
                    <span className="grid size-11 place-items-center rounded-full bg-petrol text-white">
                      <Icon name="calculator" />
                    </span>
                    <h3 className="text-[22px]">{calc.name}</h3>
                    <p className="text-muted">{calc.hint}</p>
                    <Link
                      href={`/kalkulatori/${calc.slug}`}
                      className="mt-auto flex items-center justify-between gap-4 pt-2 font-semibold no-underline after:absolute after:inset-0 after:rounded-card after:content-['']"
                    >
                      Изчислете
                      <span
                        aria-hidden="true"
                        className="grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-150 ease-out-soft group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </GlassCard>
                ) : (
                  <div className="flex h-full flex-col gap-3 rounded-card border border-dashed border-muted/40 p-6 text-muted">
                    <span className="grid size-11 place-items-center rounded-full bg-ink/5">
                      <Icon name="calculator" />
                    </span>
                    <h3 className="text-[22px]">{calc.name}</h3>
                    <p>{calc.hint}</p>
                    <Label className="mt-auto pt-2 opacity-100">{calculatorHub.soonNote}</Label>
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
