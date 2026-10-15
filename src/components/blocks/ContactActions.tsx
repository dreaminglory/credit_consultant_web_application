import { site } from "@/config/site";
import { ContactButton } from "@/components/layout/ContactButton";
import type { ButtonVariant } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { contactLinks } from "@/lib/contact";

type ContactActionsProps = {
  variant?: ButtonVariant;
  className?: string;
};

/**
 * Call / Viber / WhatsApp buttons (FR-23). Each is a marked stand-in until the owner supplies
 * the number (O-5), so nothing links to a made-up contact. Compose the primary consultation
 * button next to it as a sibling.
 */
export function ContactActions({ variant = "line", className }: ContactActionsProps) {
  const links = contactLinks(site.contact);
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <ContactButton href={links.tel} variant={variant}>
        <Icon name="phone" className="size-[18px]" />
        Обадете се
      </ContactButton>
      <ContactButton href={links.viber} variant={variant}>
        Viber
      </ContactButton>
      <ContactButton href={links.whatsapp} variant={variant}>
        WhatsApp
      </ContactButton>
    </div>
  );
}
