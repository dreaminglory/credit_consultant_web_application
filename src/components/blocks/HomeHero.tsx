import { site } from "@/config/site";
import { hero } from "@/content/home";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Picture } from "@/components/ui/Picture";
import { RoundLink } from "@/components/ui/RoundButton";
import { Section } from "@/components/ui/Section";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as React.CSSProperties;

/**
 * Home hero (B-04): static HTML + CSS only, so it paints before any script runs (HP-1).
 * The sticky header floats over the gradient, hence the negative top margin.
 */
export function HomeHero() {
  return (
    <Section className="-mt-[88px] pt-[148px] pb-24 md:pb-28">
      <Mesh />
      <Container className="grid items-end gap-12 md:grid-cols-[1.25fr_0.75fr]">
        <div>
          <Label className="enter" style={delay(0)}>
            {hero.label}
          </Label>
          <h1 className="enter mt-[18px]" style={delay(80)}>
            {hero.title}
          </h1>
          <p className="enter mt-7 max-w-[58ch] text-xl opacity-85" style={delay(180)}>
            {hero.lead}
          </p>
          <div className="enter mt-8 flex flex-wrap gap-3" style={delay(260)}>
            <ButtonLink href={hero.primaryCta.href} variant="dark">
              {hero.primaryCta.label} <ButtonArrow />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="line">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
          <ul className="enter mt-7 flex flex-wrap gap-2" style={delay(340)}>
            {hero.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-white/70 bg-white/55 px-3.5 py-2.5 font-mono text-xs leading-none font-medium tracking-[0.05em] uppercase"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <GlassCard
          className="enter w-full max-w-[420px] p-3.5 md:justify-self-end"
          style={delay(200)}
        >
          <Picture
            name="desislava-teal-suit"
            alt={`${site.person.name}, ${site.person.role.toLowerCase()}`}
            width={799}
            height={1201}
            sizes="(min-width: 768px) 420px, 100vw"
            priority
            className="aspect-[4/5] rounded-tile object-top"
          />
          <div className="flex items-center justify-between gap-3 px-2 pt-4 pb-1.5">
            <div>
              <p className="font-head text-xl leading-tight font-extrabold tracking-[-0.02em]">
                {site.person.name}
              </p>
              <Label className="mt-1.5 text-muted opacity-100">{site.person.role}</Label>
            </div>
            <RoundLink href="/#za-men" tone="dark" size="xs" label="Научете повече за мен">
              →
            </RoundLink>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}
