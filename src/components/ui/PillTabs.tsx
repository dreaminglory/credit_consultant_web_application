"use client";

import { cn } from "@/lib/cn";
import { pillTabId, useRovingTabs } from "./useRovingTabs";

export { pillTabId };

export type PillTab<T extends string> = { id: T; label: string };

type PillTabsProps<T extends string> = {
  tabs: readonly PillTab<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name of the tab list. */
  label: string;
  /** Prefix for the tab ids (`<prefix>-tab-<id>`), so panels can point back with aria-labelledby. */
  idPrefix: string;
  /** Id of the panel a tab controls. Defaults to `<prefix>-panel-<id>`. */
  controls?: (id: T) => string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Pill-shaped tab list (FAQ categories, process variants, calculator hub). Automatic activation
 * with roving tabindex: arrow keys, Home and End move and select. The row scrolls sideways on
 * narrow screens instead of wrapping.
 */
export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  idPrefix,
  controls,
  tone = "light",
  className,
}: PillTabsProps<T>) {
  const { listRef, onKeyDown } = useRovingTabs(
    tabs.map((tab) => tab.id),
    value,
    onChange,
    idPrefix,
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            id={pillTabId(idPrefix, tab.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controls ? controls(tab.id) : `${idPrefix}-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "min-h-11 shrink-0 cursor-pointer rounded-full px-5 text-[15px] font-semibold whitespace-nowrap",
              "transition-[background-color,color,transform] duration-150 ease-out-soft hover:-translate-y-px",
              tone === "light"
                ? selected
                  ? "bg-ink text-white"
                  : "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-sand"
                : selected
                  ? "bg-white text-ink"
                  : "bg-white/10 text-white shadow-[inset_0_0_0_1px_var(--color-line-dark)] hover:bg-white/20",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
