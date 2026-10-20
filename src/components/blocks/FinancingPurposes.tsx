import Link from "next/link";
import { site } from "@/config/site";
import { financingPurposes, type FinancingPurpose } from "@/content/financing";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Reveal } from "@/components/ui/Reveal";
import { Section, type SectionTone } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

type FinancingPurposesProps = {
  /** Where the call-to-action leads; the on-page form where there is one. */
  ctaHref?: string;
  tone?: SectionTone;
  id?: string;
};

function FeaturedCard({ item, ctaHref }: { item: FinancingPurpose; ctaHref: string }) {
  return (
    <GlassCard
      tone="dark"
      className="relative isolate flex h-full flex-col overflow-hidden bg-petrol p-7 text-white md:p-9"
    >
      <Mesh tone="dark" />
      <div className="flex items-center justify-between gap-4">
        <Label className="text-gold opacity-100">{item.tag}</Label>
        <span className="grid size-12 place-items-center rounded-full bg-gold text-ink">
          <Icon name={item.icon} className="size-6" />
        </span>
      </div>
      <h3 className="mt-6 max-w-[20ch] text-[clamp(26px,2.6vw,34px)]">{item.title}</h3>
      <p className="mt-3 max-w-[48ch] text-white/80">{item.text}</p>
      <ul className="mt-6 grid gap-3 border-t border-white/15 pt-6">
        {item.includes?.map((point) => (
          <li key={point} className="flex gap-3 leading-snug">
            <Icon name="badge" className="mt-0.5 size-5 shrink-0 text-gold" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href={ctaHref} variant="gold" className="mt-8 self-start">
        {financingPurposes.cta} <ButtonArrow />
      </ButtonLink>
    </GlassCard>
  );
}

function CompactCard({ item }: { item: FinancingPurpose }) {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-petrol text-white">
        <Icon name={item.icon} className="size-6" />
      </span>
      <div>
        <Label className="text-muted opacity-100">{item.tag}</Label>
        <h3 className="mt-2 text-[22px]">{item.title}</h3>
        <p className="mt-1.5 text-muted">{item.text}</p>
      </div>
    </>
  );
  return (
    <div
      className={
        "relative h-full rounded-card border border-line bg-paper p-6 md:p-7" +
        (item.href
          ? " transition-[translate,box-shadow] duration-250 ease-out-soft focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-float"
          : "")
      }
    >
      {item.href ? (
        <Link
          href={item.href}
          className="flex items-start gap-5 no-underline after:absolute after:inset-0 after:rounded-card after:content-['']"
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-start gap-5">{content}</div>
      )}
    </div>
  );
}

/**
 * What a mortgage loan can finance (B-25): renovation / finishing work and house building as
 * two featured cards, purchase and refinancing as compact ones. Copy in `src/content/financing.ts`.
 */
export function FinancingPurposes({
  ctaHref = site.consultation.href,
  tone = "paper",
  id,
}: FinancingPurposesProps) {
  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeader
          label={financingPurposes.label}
          title={financingPurposes.title}
          lead={financingPurposes.lead}
          titleClassName="text-[clamp(32px,4vw,52px)]"
        />
        <ul className="mt-12 grid gap-4 lg:grid-cols-2">
          {financingPurposes.featured.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={index * 100} className="h-full">
                <FeaturedCard item={item} ctaHref={ctaHref} />
              </Reveal>
            </li>
          ))}
          {financingPurposes.compact.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={index * 100} className="h-full">
                <CompactCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[70ch] text-sm text-muted">{financingPurposes.note}</p>
      </Container>
    </Section>
  );
}
