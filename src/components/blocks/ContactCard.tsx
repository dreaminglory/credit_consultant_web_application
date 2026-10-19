import { isPending } from "@/config/pending";
import { site } from "@/config/site";
import { contactPage, mapCopy } from "@/content/contact";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ContactFacts } from "@/components/blocks/ContactFacts";
import { MapEmbed } from "@/components/blocks/MapEmbed";
import { Container } from "@/components/ui/Container";
import { PlaceholderBox } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mapLinks } from "@/lib/map";

/**
 * Contact card + map (B-18, FR-26, FR-27) for `/kontakti#karta`: every contact from config next
 * to the click-to-load map and an "open in Google Maps" link.
 */
export function ContactCard() {
  const links = mapLinks(site.office.city, site.office.address);
  return (
    <Section id={mapCopy.anchor} tone="white" className="pt-10 md:pt-14">
      <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="rounded-card border border-line bg-paper p-7 md:p-9">
          <SectionHeader
            label={contactPage.cardLabel}
            title={contactPage.cardTitle}
            titleClassName="text-[clamp(28px,3vw,40px)]"
          />
          <ContactFacts className="mt-8 sm:grid-cols-2 lg:grid-cols-1" />
          <ContactActions variant="dark" className="mt-8" />
          {links && (
            <a
              href={links.open}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-semibold underline underline-offset-4"
            >
              {mapCopy.open} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (отваря се в нов прозорец)</span>
            </a>
          )}
        </div>
        {links ? (
          <MapEmbed
            links={links}
            pinLabel={isPending(site.office.address) ? site.office.city : site.office.address}
            className="lg:aspect-auto lg:h-full lg:min-h-[420px]"
          />
        ) : (
          <PlaceholderBox item="ПРЕДСТОИ · O-11">Адрес на офиса за картата</PlaceholderBox>
        )}
      </Container>
    </Section>
  );
}
