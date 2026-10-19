import Link from "next/link";
import { site } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { contactLinks } from "@/lib/contact";
import { ContactButton } from "./ContactButton";

/** Fixed call / Viber / consultation bar for phones (B-21, FR-23). Hidden from 768 px up. */
export function MobileBar() {
  const links = contactLinks(site.contact);
  return (
    <nav
      aria-label="Бързи действия"
      className="glass fixed inset-x-2.5 bottom-[max(0.625rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-[1fr_1fr_1.4fr] gap-2 rounded-full p-2 shadow-bar md:hidden"
    >
      <ContactButton href={links.tel} size="bar">
        Обаждане
      </ContactButton>
      <ContactButton href={links.viber} size="bar">
        Viber
      </ContactButton>
      <Link href={site.consultation.href} className={buttonClasses("dark", undefined, "bar")}>
        Консултация
      </Link>
    </nav>
  );
}
