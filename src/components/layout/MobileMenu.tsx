"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RoundButton } from "@/components/ui/RoundButton";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import type { ContactLinks } from "@/lib/contact";
import { isActivePath } from "@/lib/nav";
import { usePathname } from "next/navigation";
import { ContactButton } from "./ContactButton";
import { loanIcons } from "./menuIcons";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: ContactLinks;
};

type SectionId = "loans" | "calculators";

const rowClass =
  "flex min-h-12 w-full items-center justify-between gap-3 rounded-tile px-4 text-left text-lg font-semibold no-underline hover:bg-ink/5";

function Accordion({
  id,
  title,
  current,
  openId,
  onToggle,
  children,
}: {
  id: SectionId;
  title: string;
  current: boolean;
  openId: SectionId | null;
  onToggle: (id: SectionId) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`mobile-${id}`}
        onClick={() => onToggle(id)}
        className={cn(rowClass, "cursor-pointer", current && "text-petrol")}
      >
        {title}
        <Icon
          name="chevron"
          className={cn("transition-transform duration-150", open && "rotate-180")}
        />
      </button>
      <div
        id={`mobile-${id}`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-[250ms] ease-out-soft",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </li>
  );
}

/**
 * Phone/tablet navigation (NAV-6): a slide-in panel built on a native modal <dialog>, which
 * gives focus trapping, Esc to close and an inert page behind it without extra code.
 */
export function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [section, setSection] = useState<SectionId | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // The panel only exists below the desktop breakpoint; close it if the window grows past it.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1240px)");
    const onChange = () => query.matches && onClose();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [onClose]);

  const toggle = (id: SectionId) => setSection((current) => (current === id ? null : id));
  const subLink =
    "flex min-h-11 items-center gap-3 rounded-tile px-4 text-base no-underline hover:bg-ink/5";

  return (
    <dialog
      ref={dialogRef}
      id="mobile-menu"
      aria-label="Меню"
      onCancel={(event) => {
        // Esc: let state drive the close so the burger's aria-expanded never goes stale.
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        // A press on the backdrop (the dialog element itself) dismisses the panel.
        if (event.target === event.currentTarget) onClose();
      }}
      className="drawer fixed inset-y-0 right-0 m-0 h-dvh max-h-none w-[min(420px,100vw)] max-w-none bg-paper p-0 text-ink shadow-bar"
    >
      <div
        className="flex h-full flex-col"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) onClose();
        }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Wordmark href="/" />
          <RoundButton label="Затвори менюто" onClick={onClose} size="sm">
            <Icon name="close" className="size-6" />
          </RoundButton>
        </div>

        <ul className="flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
          <Accordion
            id="loans"
            title="Кредити"
            current={isActivePath(pathname, "/krediti")}
            openId={section}
            onToggle={toggle}
          >
            <ul className="pb-2">
              {site.loans.map((loan) => (
                <li key={loan.slug}>
                  <Link href={`/krediti/${loan.slug}`} className={subLink}>
                    <Icon name={loanIcons[loan.slug]} className="size-5 text-sea" />
                    {loan.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/krediti" className={cn(subLink, "font-semibold")}>
                  Всички кредити
                </Link>
              </li>
            </ul>
          </Accordion>
          <Accordion
            id="calculators"
            title="Калкулатори"
            current={isActivePath(pathname, "/kalkulatori")}
            openId={section}
            onToggle={toggle}
          >
            <ul className="pb-2">
              {site.calculators
                .filter((calc) => calc.available)
                .map((calc) => (
                  <li key={calc.slug}>
                    <Link href={`/kalkulatori/${calc.slug}`} className={subLink}>
                      <Icon name="calculator" className="size-5 text-sea" />
                      {calc.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/kalkulatori" className={cn(subLink, "font-semibold")}>
                  Всички калкулатори
                </Link>
              </li>
            </ul>
          </Accordion>
          {site.nav.map((item) =>
            item.kind === "link" ? (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(rowClass, isActivePath(pathname, item.href) && "text-petrol")}
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ) : null,
          )}
        </ul>

        <div className="grid gap-2.5 border-t border-line p-5">
          <div className="grid grid-cols-3 gap-2.5">
            <ContactButton href={links.tel} size="bar">
              Обаждане
            </ContactButton>
            <ContactButton href={links.viber} size="bar">
              Viber
            </ContactButton>
            <ContactButton href={links.whatsapp} size="bar">
              WhatsApp
            </ContactButton>
          </div>
          <Link href={site.consultation.href} className={buttonClasses("dark")}>
            {site.consultation.label}
          </Link>
        </div>
      </div>
    </dialog>
  );
}
