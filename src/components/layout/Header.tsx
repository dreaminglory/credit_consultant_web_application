"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
import { CalculatorsPanel, LoansPanel } from "./MenuPanels";

type MenuId = "loans" | "calculators";

const HOVER_CLOSE_DELAY = 140;

const itemClass =
  "inline-flex min-h-11 items-center gap-1 rounded-full px-3.5 text-[15px] font-medium whitespace-nowrap no-underline transition-colors duration-150 hover:bg-ink/5";

/**
 * Sticky floating glass header (B-01, NAV-1…8). Dropdowns follow the disclosure pattern: they
 * open on mouse hover and on click/Enter/Space, close on Esc, outside click, focus leaving and
 * route change, and arrow keys move between their links.
 */
export function Header() {
  const pathname = usePathname();
  const links = contactLinks(site.contact);

  const [menu, setMenu] = useState<MenuId | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [spy, setSpy] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close menus when the route changes (NAV-5) — state adjusted during render, no effect needed.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
    setDrawerOpen(false);
  }

  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openedByHover = useRef<MenuId | null>(null);
  const focusFirst = useRef(false);

  const clearCloseTimer = () => clearTimeout(closeTimer.current);

  // Outside pointer press closes the open menu.
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);

  // Keyboard open (ArrowDown on a trigger) moves focus into the panel once it is shown.
  useEffect(() => {
    if (!menu || !focusFirst.current) return;
    focusFirst.current = false;
    navRef.current?.querySelector<HTMLElement>(`[data-menu-item="${menu}"]`)?.focus();
  }, [menu]);

  useEffect(() => clearCloseTimer, []);

  // Scroll-spy for the Home anchors (NAV-8): highlights the section crossing the upper third.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = site.spySections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setSpy(id);
          else setSpy((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const activeHash = pathname === "/" ? spy : null;

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (event.key === "Escape" && menu) {
      event.preventDefault();
      const trigger = navRef.current?.querySelector<HTMLElement>(`[data-trigger="${menu}"]`);
      setMenu(null);
      trigger?.focus();
      return;
    }
    const trigger = target.closest<HTMLElement>("[data-trigger]");
    if (trigger && event.key === "ArrowDown") {
      event.preventDefault();
      focusFirst.current = true;
      const id = trigger.dataset.trigger as MenuId;
      if (menu === id) {
        focusFirst.current = false;
        navRef.current?.querySelector<HTMLElement>(`[data-menu-item="${id}"]`)?.focus();
      } else setMenu(id);
      return;
    }
    const id = target.closest<HTMLElement>("[data-menu-item]")?.dataset.menuItem;
    if (!id) return;
    const items = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>(`[data-menu-item="${id}"]`) ?? [],
    );
    const index = items.indexOf(target.closest<HTMLElement>("[data-menu-item]")!);
    const move = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    if (event.key === "ArrowDown" || event.key === "ArrowRight") move(index + 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
  }

  function renderItem(item: NavItem) {
    if (item.kind === "link") {
      const hash = splitHref(item.href).hash;
      const current = isActivePath(pathname, item.href);
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
    const current = isActivePath(pathname, item.href);
    return (
      <li
        key={item.label}
        className={cn(id === "calculators" && "relative")}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          clearCloseTimer();
          if (menu !== id) openedByHover.current = id;
          setMenu(id);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          clearCloseTimer();
          closeTimer.current = setTimeout(
            () => setMenu((m) => (m === id ? null : m)),
            HOVER_CLOSE_DELAY,
          );
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setMenu((m) => (m === id ? null : m));
          }
        }}
        onClick={(event) => {
          // Any link inside the panel closes it, even when the page does not change.
          if ((event.target as HTMLElement).closest("a")) setMenu(null);
        }}
      >
        <button
          type="button"
          data-trigger={id}
          aria-expanded={open}
          aria-controls={`menu-${id}`}
          className={cn(itemClass, "cursor-pointer", (current || open) && "bg-ink/8 text-petrol")}
          aria-current={current ? "page" : undefined}
          onClick={() => {
            if (open && openedByHover.current === id) {
              // First click after hover-open pins the menu instead of closing it.
              openedByHover.current = null;
              return;
            }
            openedByHover.current = null;
            setMenu(open ? null : id);
          }}
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
          <div className="rounded-card border border-line bg-white shadow-bar">
            {id === "loans" ? <LoansPanel /> : <CalculatorsPanel />}
          </div>
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
      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} links={links} />
    </header>
  );
}
