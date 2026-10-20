import { TestimonialCarousel } from "@/components/blocks/TestimonialCarousel";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Label } from "@/components/ui/Label";
import { Picture } from "@/components/ui/Picture";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { site, type LoanSlug } from "@/config/site";
import { testimonials, testimonialsSection, type Testimonial } from "@/content/testimonials";

const slideShell = "grid h-full overflow-hidden bg-white/70 md:h-[460px] md:grid-cols-[5fr_7fr]";

function RealSlide({ item }: { item: Testimonial }) {
  const loan = site.loans.find((l) => l.slug === item.product);
  const who = [item.name, item.city].filter(Boolean).join(", ");
  const about = loan?.name ?? "";
  return (
    <GlassCard className={slideShell}>
      <div className="relative min-h-[280px] md:min-h-[420px]">
        <Picture {...item.photo} fill sizes="(min-width: 768px) 440px, 88vw" />
      </div>
      <figure className="flex flex-col justify-between gap-8 p-7 md:p-9">
        <blockquote className="font-head text-ink text-[clamp(16px,1.45vw,19px)] leading-snug font-bold tracking-[-0.02em]">
          <p>„{item.quote}“</p>
        </blockquote>
        {(who || about || item.year) && (
          <figcaption>
            {item.year && <Label className="mb-2 block text-muted opacity-100">{item.year}</Label>}
            {who && <strong className="block font-semibold">{who}</strong>}
            {about && <Label className="mt-2 text-muted opacity-100">{about}</Label>}
          </figcaption>
        )}
      </figure>
    </GlassCard>
  );
}

/**
 * Testimonial carousel (B-10, FR-24, FR-25) for Home `#otzivi`. Pass `product` on a loan page
 * to show only that product's reviews.
 */
export function Testimonials({ product }: { product?: LoanSlug }) {
  const items = product ? testimonials.filter((t) => t.product === product) : testimonials;
  if (items.length === 0) return null;

  return (
    <Section id={testimonialsSection.anchor} tone="sand">
      <Container>
        <SectionHeader label={testimonialsSection.label} title={testimonialsSection.title} />
      </Container>
      <div className="mt-12">
        <TestimonialCarousel
          slides={items.map((item) => (
            <RealSlide key={item.id} item={item} />
          ))}
          label={testimonialsSection.carouselLabel}
        />
      </div>
    </Section>
  );
}
