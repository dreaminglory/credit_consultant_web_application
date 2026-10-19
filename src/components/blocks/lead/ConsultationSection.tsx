import { leadSection } from "@/content/lead";
import { ContactActions } from "@/components/blocks/ContactActions";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Section } from "@/components/ui/Section";
import type { LeadProduct } from "@/lib/lead/schema";
import { LeadCard } from "./LeadCard";

/**
 * Consultation form section (B-17, compact variant) for Home `#konsultacia` and the loan
 * pages: promise copy and direct contacts on the left, the form card on the right (mockup v2).
 */
export function ConsultationSection({ product }: { product?: LeadProduct }) {
  return (
    <Section id={leadSection.anchor} tone="ink">
      <Mesh tone="dark" />
      <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="lg:sticky lg:top-28">
          <Label className="text-haze">{leadSection.label}</Label>
          <h2 className="mt-3.5 text-[clamp(40px,6vw,80px)]">{leadSection.title}</h2>
          <p className="mt-6 max-w-[48ch] text-lg text-mist">{leadSection.lead}</p>
          <p className="mt-7 inline-block rounded-full bg-gold px-[18px] py-3 font-bold text-ink">
            {leadSection.badge}
          </p>
          <p className="mt-10 text-[15px] text-haze">{leadSection.contactsLabel}</p>
          <ContactActions variant="line-light" className="mt-3" />
        </div>
        <LeadCard variant="compact" product={product} />
      </Container>
    </Section>
  );
}
