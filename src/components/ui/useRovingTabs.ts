"use client";

import { useRef, type KeyboardEvent } from "react";

export const pillTabId = (prefix: string, id: string) => `${prefix}-tab-${id}`;

/**
 * Keyboard model of a tab list with automatic activation and roving tabindex: arrow keys,
 * Home and End move and select, then focus the new tab. Shared by PillTabs and the
 * calculator hub so every tab list behaves the same.
 */
export function useRovingTabs<T extends string>(
  ids: readonly T[],
  value: T,
  onChange: (id: T) => void,
  idPrefix: string,
) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = ids.indexOf(value);
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = ids.length - 1;
    else return;
    event.preventDefault();
    const target = ids[(next + ids.length) % ids.length];
    if (target === undefined) return;
    onChange(target);
    listRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(pillTabId(idPrefix, target))}`)
      ?.focus();
  }

  return { listRef, onKeyDown };
}
