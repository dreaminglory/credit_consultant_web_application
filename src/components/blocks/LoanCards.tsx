import Link from "next/link";
import { site } from "@/config/site";
import { loanSection, loanTags } from "@/content/home";
import { loanIcons } from "@/components/layout/menuIcons";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Loan cards (B-06): one frosted card per product, linking to its loan page (M7). */
export function LoanCards() {
  return (
    <Section id="krediti">
      <Container>
        <SectionHeader label={loanSection.label} title={loanSection.title} />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {site.loans.map((loan, index) => (
            <li key={loan.slug}>
              <Reveal delay={(index % 2) * 100} className="h-full">
                <GlassCard className="group relative flex h-full min-h-[250px] flex-col gap-3.5 bg-white/85 p-7 transition-[translate,box-shadow] duration-250 ease-out-soft focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-float md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <Label className="text-muted opacity-100">{loanTags[loan.slug]}</Label>
                    <span className="grid size-11 place-items-center rounded-full bg-petrol text-white">
                      <Icon name={loanIcons[loan.slug]} />
                    </span>
                  </div>
                  <h3>{loan.name}</h3>
                  <p className="max-w-[46ch] text-muted">{loan.summary}</p>
                  <Link
                    href={`/krediti/${loan.slug}`}
                    className="mt-auto flex items-center justify-between gap-4 pt-3 font-semibold no-underline after:absolute after:inset-0 after:rounded-card after:content-['']"
                  >
                    Научете повече
                    <span
                      aria-hidden="true"
                      className="grid size-11 place-items-center rounded-full bg-ink text-lg text-white transition-transform duration-150 ease-out-soft group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
