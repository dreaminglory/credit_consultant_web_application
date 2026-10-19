"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ButtonLink, ButtonArrow } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { PillTabs, pillTabId } from "@/components/ui/PillTabs";
import { Value } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { site, type LoanSlug } from "@/config/site";
import { processSection, type ProcessVariant } from "@/content/process";
import { cn } from "@/lib/cn";
import { litCount, scrollProgress } from "@/lib/journey";

const PREFIX = "process";
const PANEL_ID = "process-panel";
/** Viewport line that "draws" the journey, as a share of the viewport height. */
const ANCHOR = 0.6;

/**
 * Self-drawing journey (B-07, PR-1…5). The list is fully drawn in the server HTML, without
 * scripting and with reduced motion. Once hydrated (and motion is allowed) scrolling writes a
 * progress value to CSS and marks the reached steps; the line itself is drawn by CSS.
 */
export function ProcessJourney({ variants }: { variants: ProcessVariant[] }) {
  const [variantId, setVariantId] = useState<LoanSlug>(variants[0]!.id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0]!;
  const listRef = useRef<HTMLOListElement>(null);
  const count = variant.steps.length;
  // A loan page shows only its own variant: no tabs, so no tab panel either (PR-3).
  const tabbed = variants.length > 1;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1280px)");
    const steps = Array.from(list.children) as HTMLElement[];
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches) {
        delete list.dataset.live;
        steps.forEach((step) => {
          step.dataset.lit = "true";
          step.dataset.active = "false";
        });
        return;
      }
      const rect = list.getBoundingClientRect();
      const progress = scrollProgress(rect.top, rect.height, window.innerHeight * ANCHOR);
      const lit = litCount(progress, count, wide.matches ? 0.5 : 0);
      list.dataset.live = "true";
      list.style.setProperty("--p", progress.toFixed(4));
      steps.forEach((step, index) => {
        step.dataset.lit = String(index < lit);
        step.dataset.active = String(index === lit - 1);
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    wide.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      wide.removeEventListener("change", schedule);
    };
  }, [variantId, count]);

  return (
    <div>
      {tabbed && (
        <PillTabs
          tone="dark"
          tabs={variants.map(({ id, label }) => ({ id, label }))}
          value={variantId}
          onChange={setVariantId}
          label={processSection.variantsLabel}
          idPrefix={PREFIX}
          controls={() => PANEL_ID}
          className="mt-10"
        />
      )}

      <div
        id={tabbed ? PANEL_ID : undefined}
        role={tabbed ? "tabpanel" : undefined}
        aria-labelledby={tabbed ? pillTabId(PREFIX, variantId) : undefined}
        className={tabbed ? "mt-12 xl:mt-16" : "mt-10 xl:mt-14"}
      >
        <ol
          key={variantId}
          ref={listRef}
          className="journey relative grid gap-5 xl:grid-cols-8 xl:grid-rows-[auto_72px_auto] xl:gap-x-0 xl:gap-y-4"
          style={{ "--n": count } as CSSProperties}
        >
          {variant.steps.map((step, index) => {
            const top = index % 2 === 0;
            return (
              <li
                key={step.id}
                data-lit="true"
                data-active="false"
                className="group relative pl-14 xl:grid xl:grid-cols-subgrid xl:grid-rows-subgrid xl:pl-0 xl:[grid-column:var(--col)] xl:[grid-row:1/-1]"
                style={{ "--i": index, "--col": index + 1 } as CSSProperties}
              >
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-full w-10 xl:relative xl:grid xl:h-auto xl:w-auto xl:place-items-center xl:[grid-row:2]"
                >
                  <span className="journey-rail">
                    <span className="journey-fill" />
                  </span>
                  <span className="journey-node relative z-10 grid size-10 place-items-center rounded-full border border-line-dark bg-petrol text-mist transition-[background-color,color,scale,border-color] duration-250 ease-out-soft group-data-[lit=true]:border-gold group-data-[lit=true]:bg-gold group-data-[lit=true]:text-ink group-data-[active=true]:scale-110 xl:size-11">
                    <Icon name={step.icon} className="size-5" />
                  </span>
                </div>

                <div
                  className={cn(
                    "glass-dark relative rounded-card p-6 transition-[background-color,box-shadow] duration-250 ease-out-soft",
                    "group-data-[active=true]:bg-white/10 group-data-[active=true]:shadow-[inset_0_0_0_1px_var(--color-gold)]",
                    "xl:w-[calc(200%-1rem)]",
                    // Pairs of cards (1+2, 3+4 …) share the same left edge and every card in a row
                    // has the same height, so the zigzag stays tidy for any copy length.
                    top ? "xl:[grid-row:1]" : "xl:-ml-[100%] xl:[grid-row:3]",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <span className="font-mono text-sm font-medium tracking-[0.08em] text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-line-dark px-3 py-1 font-mono text-xs font-medium tracking-[0.04em] text-mist">
                      <Value value={step.duration} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-[clamp(20px,1.7vw,24px)]">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-mist">{step.text}</p>
                  <dl className="mt-5 grid gap-2.5 border-t border-line-dark pt-4 text-sm">
                    <div className="grid grid-cols-[44px_1fr] gap-2">
                      <dt className="pt-0.5 font-mono text-[11px] font-medium tracking-[0.08em] text-gold uppercase">
                        {processSection.you}
                      </dt>
                      <dd className="text-mist">{step.you}</dd>
                    </div>
                    <div className="grid grid-cols-[44px_1fr] gap-2">
                      <dt className="pt-0.5 font-mono text-[11px] font-medium tracking-[0.08em] text-gold uppercase">
                        {processSection.me}
                      </dt>
                      <dd className="text-mist">{step.me}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal className="glass-dark mt-14 grid items-center gap-6 rounded-card p-7 md:grid-cols-[1fr_auto] md:p-9 xl:mt-20">
        <div>
          <Label>{processSection.totalLabel}</Label>
          <p className="mt-3 font-head text-[clamp(36px,5vw,60px)] leading-none font-extrabold tracking-[-0.035em]">
            <Value value={variant.total} />
          </p>
          <p className="mt-3 max-w-[56ch] text-sm text-haze">{processSection.totalNote}</p>
        </div>
        <ButtonLink href={site.consultation.href} variant="gold" className="justify-self-start">
          {site.consultation.label} <ButtonArrow />
        </ButtonLink>
      </Reveal>
    </div>
  );
}
