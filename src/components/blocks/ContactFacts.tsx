import { site } from "@/config/site";
import { Fact } from "@/components/ui/Fact";
import { Value } from "@/components/ui/Placeholder";
import { cn } from "@/lib/cn";
import { contactLinks } from "@/lib/contact";

const linkClass = "no-underline hover:underline underline-offset-4";

/**
 * Office, hours, phone and email from config (TR-11), as a definition list. Shared by the
 * contact strip (B-24) and the contact card (B-18) so both show identical wording.
 */
export function ContactFacts({ className }: { className?: string }) {
  const links = contactLinks(site.contact);
  return (
    <dl className={cn("grid gap-6", className)}>
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
  );
}
