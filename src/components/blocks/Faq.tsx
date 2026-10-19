import { ContactActions } from "@/components/blocks/ContactActions";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { faqCategories, faqEntries, faqSection, type FaqCategory } from "@/content/faq";
import { faqPageJsonLd } from "@/lib/jsonLd";

/**
 * FAQ by category (B-13) for Home `#vaprosi`. Loan pages pass just their own category
 * (FAQ-4); a single category hides the pills. Adds the FAQPage structured data.
 */
export function Faq({ categories = faqCategories }: { categories?: FaqCategory[] }) {
  return (
    <Section id={faqSection.anchor}>
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            label={faqSection.label}
            title={faqSection.title}
            lead={faqSection.lead}
            titleClassName="text-[clamp(34px,4.4vw,60px)]"
          />
          <ContactActions variant="line" className="mt-8" />
        </div>
        <FaqAccordion categories={categories} />
      </Container>
      <JsonLd data={faqPageJsonLd(faqEntries(categories))} />
    </Section>
  );
}
