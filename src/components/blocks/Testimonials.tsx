import type { ReactNode } from "react";
import { TestimonialCarousel } from "@/components/blocks/TestimonialCarousel";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Label } from "@/components/ui/Label";
import { Picture } from "@/components/ui/Picture";
import { PlaceholderBox } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site, type LoanSlug } from "@/config/site";
import {
  placeholderSlides,
  testimonials,
  testimonialsMissing,
  testimonialsSection,
  type Testimonial,
} from "@/content/testimonials";

const slideShell = "grid overflow-hidden bg-white/70 md:grid-cols-2";

function RealSlide({ item }: { item: Testimonial }) {
  const loan = site.loans.find((l) => l.slug === item.product);
  return (
    <GlassCard className={slideShell}>
      <Picture
        {...item.photo}
        sizes="(min-width: 768px) 440px, 88vw"
        className="h-full min-h-[260px] md:min-h-[380px]"
      />
      <figure className="flex flex-col justify-between gap-8 p-7 md:p-9">
        <blockquote className="font-head text-[clamp(22px,2.4vw,30px)] leading-tight font-bold tracking-[-0.02em]">
          <p>„{item.quote}“</p>
        </blockquote>
        <figcaption>
          <strong className="block font-semibold">
            {item.name}, {item.city}
          </strong>
          <Label className="mt-2 text-muted opacity-100">
            {loan?.name} · {item.year}
          </Label>
        </figcaption>
      </figure>
    </GlassCard>
  );
}

/** Marked stand-in while the real testimonials are missing (O-1); never ships (check:content). */
function PlaceholderSlide() {
  return (
    <GlassCard className={slideShell}>
      <div className="min-h-[260px] p-4 md:min-h-[380px] [&>div]:h-full">
        <PlaceholderBox item={`ПРЕДСТОИ · ${testimonialsMissing.pending}`}>
          Снимка на Десислава с клиент
        </PlaceholderBox>
      </div>
      <div className="flex flex-col justify-between gap-8 p-7 md:p-9">
        <p className="font-head text-[clamp(22px,2.4vw,30px)] leading-tight font-bold tracking-[-0.02em] text-muted">
          Тук ще бъде отзивът на клиента — дума по дума, с негово писмено съгласие.
        </p>
        <Label className="text-muted opacity-100">Име, град · вид кредит · година</Label>
      </div>
    </GlassCard>
  );
}

/**
 * Testimonial carousel (B-10, FR-24, FR-25) for Home `#otzivi`. Pass `product` on a loan page
 * to show only that product's reviews.
 */
export function Testimonials({ product }: { product?: LoanSlug }) {
  const items = product ? testimonials.filter((t) => t.product === product) : testimonials;
  const slides: ReactNode[] =
    items.length > 0
      ? items.map((item) => <RealSlide key={item.id} item={item} />)
      : Array.from({ length: placeholderSlides }, (_, i) => <PlaceholderSlide key={i} />);

  return (
    <Section id={testimonialsSection.anchor} tone="sand">
      <Container>
        <SectionHeader label={testimonialsSection.label} title={testimonialsSection.title} />
      </Container>
      <div className="mt-12">
        <TestimonialCarousel slides={slides} label={testimonialsSection.carouselLabel} />
      </div>
    </Section>
  );
}
