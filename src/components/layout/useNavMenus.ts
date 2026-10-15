"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export type MenuId = "loans" | "calculators";

const HOVER_CLOSE_DELAY = 140;

/**
 * State and behaviour of the header dropdowns (NAV-3…5), kept out of the markup. Disclosure
 * pattern: open on mouse hover and on click/Enter/Space; close on Esc, outside press, focus
 * leaving the item and route change; arrow keys move between a panel's links.
 *
 * Panel links must carry `data-menu-item="<id>"`, triggers `data-trigger="<id>"`.
 */
export function useNavMenus(pathname: string) {
  const [menu, setMenu] = useState<MenuId | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openedByHover = useRef<MenuId | null>(null);
  const focusFirst = useRef(false);

  // Route change closes the menu (NAV-5) — adjusted during render, no effect needed.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
  }

  const clearCloseTimer = () => clearTimeout(closeTimer.current);
  const query = (selector: string) => navRef.current?.querySelector<HTMLElement>(selector);

  useEffect(() => clearCloseTimer, []);

  // Outside pointer press closes the open menu.
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu]);

  // Keyboard open (ArrowDown on a trigger) moves focus into the panel once it is shown.
  useEffect(() => {
    if (!menu || !focusFirst.current) return;
    focusFirst.current = false;
    query(`[data-menu-item="${menu}"]`)?.focus();
  }, [menu]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (event.key === "Escape" && menu) {
      event.preventDefault();
      const trigger = query(`[data-trigger="${menu}"]`);
      setMenu(null);
      trigger?.focus();
      return;
    }

    const trigger = target.closest<HTMLElement>("[data-trigger]");
    if (trigger && event.key === "ArrowDown") {
      event.preventDefault();
      const id = trigger.dataset.trigger as MenuId;
      if (menu === id) query(`[data-menu-item="${id}"]`)?.focus();
      else {
        focusFirst.current = true;
        setMenu(id);
      }
      return;
    }

    const current = target.closest<HTMLElement>("[data-menu-item]");
    if (!current) return;
    const items = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>(
        `[data-menu-item="${current.dataset.menuItem}"]`,
      ) ?? [],
    );
    const index = items.indexOf(current);
    const move = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    if (event.key === "ArrowDown" || event.key === "ArrowRight") move(index + 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
  }

  /** Props for the `<li>` that wraps a trigger and its panel. */
  function itemProps(id: MenuId) {
    return {
      onPointerEnter: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        clearCloseTimer();
        if (menu !== id) openedByHover.current = id;
        setMenu(id);
      },
      onPointerLeave: (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        clearCloseTimer();
        closeTimer.current = setTimeout(
          () => setMenu((m) => (m === id ? null : m)),
          HOVER_CLOSE_DELAY,
        );
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setMenu((m) => (m === id ? null : m));
        }
      },
      // Any link inside the panel closes it, even when the page does not change.
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if ((event.target as HTMLElement).closest("a")) setMenu(null);
      },
    };
  }

  /** Click on a trigger; the first click after a hover-open pins the menu instead of closing it. */
  function toggle(id: MenuId) {
    if (menu === id && openedByHover.current === id) {
      openedByHover.current = null;
      return;
    }
    openedByHover.current = null;
    setMenu(menu === id ? null : id);
  }

  return { navRef, menu, onKeyDown, itemProps, toggle };
}

/**
 * Scroll-spy for the Home anchors (NAV-8): returns the id of the section crossing the upper
 * third of the viewport, or null. Only active on Home.
 */
export function useScrollSpy(pathname: string, ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname, key]);

  return pathname === "/" ? active : null;
}
