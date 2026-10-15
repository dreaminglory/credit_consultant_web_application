import type { ReactNode } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";

type ContactButtonProps = {
  /** Link from `contactLinks()`; `null` while the owner has not supplied the number (O-5). */
  href: string | null;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
  children: ReactNode;
};

/**
 * Pill button for tel:, Viber and WhatsApp. While the contact is a pending item it renders a
 * visibly marked, non-interactive stand-in instead of a dead or invented link.
 */
export function ContactButton({
  href,
  variant = "line",
  size,
  className,
  external,
  children,
}: ContactButtonProps) {
  if (!href) {
    return (
      <span
        title="O-5: contact details not supplied yet"
        className={buttonClasses("pending", className, size)}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={buttonClasses(variant, className, size)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
