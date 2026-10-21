import Link from "next/link";
import { site } from "@/config/site";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";
import { Container } from "@/components/ui/Container";
import { Value } from "@/components/ui/Placeholder";
import { Wordmark } from "@/components/ui/Wordmark";
import { contactLinks } from "@/lib/contact";

const linkClass =
  "inline-flex min-h-11 min-w-11 items-center text-haze md:min-h-6 md:min-w-0 no-underline transition-colors duration-150 hover:text-white";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-mono text-xs leading-none font-medium tracking-[0.08em] text-white uppercase">
        {title}
      </h2>
      <ul className="grid md:gap-2.5">{children}</ul>
    </div>
  );
}

/** Site footer (B-02, FT-1, FT-2). All wording comes from config so it matches FAQ and legal. */
export function Footer() {
  const links = contactLinks(site.contact);
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink pt-16 pb-28 text-sm text-haze md:pb-10">
      {/* Gradient accent (FT-1): a soft petrol/sea glow behind the brand column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 -z-10 size-[560px] rounded-full bg-sea/35 blur-[120px]"
      />
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <Wordmark tone="light" />
            <p className="mt-4 max-w-[34ch] text-base text-mist">{site.brand.tagline}</p>
            <address className="mt-6 grid gap-1.5 not-italic">
              <p className="text-white">
                {site.office.city}, <Value value={site.office.address} />
              </p>
              <p>
                <Value value={site.office.hours} />
              </p>
              <p>
                {links.tel ? (
                  <a className={linkClass} href={links.tel}>
                    <Value value={site.contact.phone} />
                  </a>
                ) : (
                  <Value value={site.contact.phone} />
                )}
              </p>
              <p>
                {links.mailto ? (
                  <a className={linkClass} href={links.mailto}>
                    <Value value={site.contact.email} />
                  </a>
                ) : (
                  <Value value={site.contact.email} />
                )}
              </p>
              <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                {links.viber && (
                  <a className={linkClass} href={links.viber}>
                    Viber
                  </a>
                )}
                {links.whatsapp && (
                  <a
                    className={linkClass}
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                )}
                <Link className={linkClass} href="/kontakti#karta">
                  Виж на картата
                </Link>
              </p>
            </address>
          </div>

          <Column title="Кредити">
            {site.loans.map((loan) => (
              <li key={loan.slug}>
                <Link className={linkClass} href={`/krediti/${loan.slug}`}>
                  {loan.name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Калкулатори">
            {site.calculators
              .filter((c) => c.available)
              .map((calc) => (
                <li key={calc.slug}>
                  <Link className={linkClass} href={`/kalkulatori/${calc.slug}`}>
                    {calc.name}
                  </Link>
                </li>
              ))}
          </Column>

          <Column title="Информация">
            {site.footerInfo.map((link) => (
              <li key={link.label}>
                <Link className={linkClass} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>
        </div>

        <div className="mt-12 border-t border-line-dark pt-6">
          <ul className="flex flex-wrap gap-x-6 md:gap-y-2">
            {site.legalLinks.map((link) => (
              <li key={link.label}>
                {link.action === "consent" ? (
                  <ConsentSettingsButton className={linkClass}>{link.label}</ConsentSettingsButton>
                ) : (
                  <Link className={linkClass} href={link.href}>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-5">
            © {year} {site.legal.company}. Всички права запазени.
          </p>
        </div>
      </Container>
    </footer>
  );
}
