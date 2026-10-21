import Link from "next/link";
import { contactStrip } from "@/content/home";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ContactFacts } from "@/components/blocks/ContactFacts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Contact strip (B-24): address, hours and direct contacts; the live map lives on /kontakti. */
export function ContactStrip() {
  return (
    <Section id="kontakt">
      <Container>
        <SectionHeader label={contactStrip.label} title={contactStrip.title} />
        <div className="mt-12 grid gap-8 rounded-card border border-line bg-white p-7 md:p-10 lg:grid-cols-[1.4fr_1fr]">
          <ContactFacts className="sm:grid-cols-2" />
          <div className="flex flex-col justify-between gap-6">
            <ContactActions variant="dark" />
            <Link
              href={contactStrip.link.href}
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              {contactStrip.link.label} →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
