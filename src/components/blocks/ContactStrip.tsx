import Link from "next/link";
import { site } from "@/config/site";
import { contactStrip } from "@/content/home";
import { ContactActions } from "@/components/blocks/ContactActions";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Value } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contactLinks } from "@/lib/contact";

const linkClass = "no-underline hover:underline underline-offset-4";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt>
        <Label className="text-muted opacity-100">{label}</Label>
      </dt>
      <dd className="mt-2 font-head text-lg leading-snug font-bold tracking-[-0.01em]">
        {children}
      </dd>
    </div>
  );
}

/** Contact strip (B-24): address, hours and direct contacts; the live map lives on /kontakti. */
export function ContactStrip() {
  const links = contactLinks(site.contact);
  return (
    <Section id="kontakt">
      <Container>
        <SectionHeader label={contactStrip.label} title={contactStrip.title} />
        <div className="mt-12 grid gap-8 rounded-card border border-line bg-white p-7 md:p-10 lg:grid-cols-[1.4fr_1fr]">
          <dl className="grid gap-6 sm:grid-cols-2">
            <Fact label="Офис">
              {site.office.city}, <Value value={site.office.address} />
            </Fact>
            <Fact label="Работно време">
              <Value value={site.office.hours} />
            </Fact>
            <Fact label="Телефон">
              {links.tel ? (
                <a className={linkClass} href={links.tel}>
                  <Value value={site.contact.phone} />
                </a>
              ) : (
                <Value value={site.contact.phone} />
              )}
            </Fact>
            <Fact label="Имейл">
              {links.mailto ? (
                <a className={`${linkClass} break-all`} href={links.mailto}>
                  <Value value={site.contact.email} />
                </a>
              ) : (
                <Value value={site.contact.email} />
              )}
            </Fact>
          </dl>
          <div className="flex flex-col justify-between gap-6">
            <ContactActions variant="dark" />
            <Link
              href={contactStrip.link.href}
              className="font-semibold underline underline-offset-4"
            >
              {contactStrip.link.label} →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
