"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { RoundButton } from "@/components/ui/RoundButton";
import { Wordmark } from "@/components/ui/Wordmark";
import { site, type NavItem } from "@/config/site";
import { cn } from "@/lib/cn";
import { contactLinks } from "@/lib/contact";
import { isActivePath, splitHref } from "@/lib/nav";
import { ContactButton } from "./ContactButton";
import { MobileMenu } from "./MobileMenu";
import { useNavMenus, useScrollSpy, type MenuId } from "./useNavMenus";

const itemClass =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-2.5 text-[15px] font-medium whitespace-nowrap no-underline transition-colors duration-150 hover:bg-ink/5";

type HeaderProps = {
  /** Server-rendered panel content, passed in so it stays out of the client bundle. */
  panels: Record<MenuId, ReactNode>;
};

/** Sticky floating glass header (B-01, NAV-1…8). Menu behaviour lives in `useNavMenus`. */
export function Header({ panels }: HeaderProps) {
  const pathname = usePathname();
  const links = contactLinks(site.contact);
  const { navRef, menu, onKeyDown, itemProps, toggle } = useNavMenus(pathname);
  const activeHash = useScrollSpy(pathname, site.spySections);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
  }
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  function renderItem(item: NavItem) {
    const current = isActivePath(pathname, item.href);

    if (item.kind === "link") {
      const hash = splitHref(item.href).hash;
      const inView = hash !== null && hash === activeHash;
      return (
        <li key={item.label}>
          <Link
            href={item.href}
            className={cn(itemClass, (current || inView) && "bg-ink/8 text-petrol")}
            aria-current={current ? "page" : inView ? "location" : undefined}
          >
            {item.label}
          </Link>
        </li>
      );
    }

    const id = item.menu;
    const open = menu === id;
    return (
      <li key={item.label} className={cn(id === "calculators" && "relative")} {...itemProps(id)}>
        <button
          type="button"
          data-trigger={id}
          aria-expanded={open}
          aria-controls={`menu-${id}`}
          aria-current={current ? "page" : undefined}
          className={cn(itemClass, "cursor-pointer", (current || open) && "bg-ink/8 text-petrol")}
          onClick={() => toggle(id)}
        >
          {item.label}
          <Icon
            name="chevron"
            className={cn("size-4 transition-transform duration-150", open && "rotate-180")}
          />
        </button>
        <div
          id={`menu-${id}`}
          data-open={open}
          className={cn(
            "menu-panel absolute top-full pt-3",
            id === "loans" ? "inset-x-0" : "left-0 w-[400px]",
          )}
        >
          <div className="rounded-card border border-line bg-white shadow-bar">{panels[id]}</div>
        </div>
      </li>
    );
  }

  return (
    <header className="sticky top-0 z-30 py-3.5">
      <div className="mx-auto w-full max-w-site px-5">
        <nav
          ref={navRef}
          aria-label="Основна навигация"
          onKeyDown={onKeyDown}
          className="glass relative flex items-center justify-between gap-3.5 rounded-full py-2.5 pr-3 pl-5 shadow-float md:pl-[22px]"
        >
          <Wordmark href="/" />
          <ul className="hidden items-center gap-0.5 nav:flex">{site.nav.map(renderItem)}</ul>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <ContactButton href={links.tel} size="compact">
                <Icon name="phone" className="size-[18px]" />
                Обадете се
              </ContactButton>
              <Link
                href={site.consultation.href}
                className={buttonClasses("dark", undefined, "compact")}
              >
                {site.consultation.label}
              </Link>
            </div>
            <div className="nav:hidden">
              <RoundButton
                label="Меню"
                size="sm"
                aria-expanded={drawerOpen}
                aria-controls="mobile-menu"
                onClick={() => setDrawerOpen(true)}
              >
                <Icon name="menu" className="size-6" />
              </RoundButton>
            </div>
          </div>
        </nav>
      </div>
      <MobileMenu open={drawerOpen} onClose={closeDrawer} links={links} />
    </header>
  );
}
