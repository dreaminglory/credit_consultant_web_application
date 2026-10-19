"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/config/site";
import {
  calculatorCopy,
  calculatorHub,
  calculatorUi,
  liveCalculatorSlugs,
  type LiveCalculatorSlug,
} from "@/content/calculators";
import { Icon } from "@/components/ui/Icon";
import { pillTabId, useRovingTabs } from "@/components/ui/useRovingTabs";
import { cn } from "@/lib/cn";
import { Calculator } from "./Calculator";

const PREFIX = "calc";
const panelId = (slug: string) => `${PREFIX}-panel-${slug}`;

/**
 * Tabs of the calculator hub (B-23): a vertical list on desktop (mockup v2), a sideways
 * scrolling row on phones and tablets. Every panel is in the server HTML (inactive ones are
 * `hidden`), so each calculator's example result is indexable.
 */
export function CalculatorTabs({ ctaHref }: { ctaHref: string }) {
  const [active, setActive] = useState<LiveCalculatorSlug>(liveCalculatorSlugs[0]!);
  const { listRef, onKeyDown } = useRovingTabs(liveCalculatorSlugs, active, setActive, PREFIX);
  const soon = site.calculators.filter((calc) => !calc.available);

  return (
    <div className="mt-11 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div>
        <div
          ref={listRef}
          role="tablist"
          aria-label={calculatorHub.tabsLabel}
          onKeyDown={onKeyDown}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {liveCalculatorSlugs.map((slug) => {
            const selected = slug === active;
            return (
              <button
                key={slug}
                id={pillTabId(PREFIX, slug)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(slug)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(slug)}
                className={cn(
                  "min-h-12 shrink-0 cursor-pointer rounded-full px-5 text-left text-[15px] font-semibold whitespace-nowrap lg:rounded-[18px] lg:px-[18px] lg:py-4 lg:whitespace-normal",
                  "transition-[background-color,color,translate] duration-150 ease-out-soft hover:-translate-y-px",
                  selected
                    ? "bg-ink text-white"
                    : "bg-white text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-sand",
                )}
              >
                {calculatorCopy[slug].tab}
              </button>
            );
          })}
        </div>
        {soon.length > 0 && (
          <div className="mt-6 hidden lg:block">
            <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">
              {calculatorHub.soonTitle}
            </p>
            <ul className="mt-2 grid gap-2">
              {soon.map((calc) => (
                <li
                  key={calc.slug}
                  className="rounded-[18px] border border-dashed border-line px-[18px] py-3.5 text-[15px] font-semibold text-muted"
                >
                  {calc.name}
                  <span className="mt-1 block font-mono text-[11px] font-medium tracking-[0.05em] uppercase">
                    {calculatorHub.soonNote}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        {liveCalculatorSlugs.map((slug) => (
          <div
            key={slug}
            id={panelId(slug)}
            role="tabpanel"
            aria-labelledby={pillTabId(PREFIX, slug)}
            hidden={slug !== active}
          >
            <Calculator slug={slug} ctaHref={ctaHref} />
            <Link
              href={`/kalkulatori/${slug}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              {calculatorUi.ownPage}
              <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
