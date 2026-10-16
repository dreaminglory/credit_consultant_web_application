"use client";

import { useEffect, useRef, useState } from "react";
import { PillTabs, pillTabId } from "@/components/ui/PillTabs";
import { Value } from "@/components/ui/Placeholder";
import { faqSection, type FaqCategory, type FaqCategoryId } from "@/content/faq";
import { categoryHash, questionHash, resolveFaqHash } from "@/lib/faqHash";

const PREFIX = "faq";

/**
 * Category pills + one-open-at-a-time accordion (FAQ-1, FAQ-3). Every category is in the server
 * HTML (inactive ones are `hidden`), so the answers are indexable; script only switches panels.
 * Hashes `#vaprosi-<category>` and `#vaprosi-<category>-<question>` select and open from a link.
 */
export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [categoryId, setCategoryId] = useState<FaqCategoryId>(categories[0]!.id);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hashTick, setHashTick] = useState(0);
  const scrollTarget = useRef<string | null>(null);

  // Follow the URL hash on load and when it changes (links from ads, other pages, the footer).
  useEffect(() => {
    const apply = () => {
      const target = resolveFaqHash(window.location.hash, categories);
      if (!target) return;
      setCategoryId(target.categoryId as FaqCategoryId);
      setOpenId(target.questionId ? questionHash(target.categoryId, target.questionId) : null);
      scrollTarget.current = target.questionId
        ? questionHash(target.categoryId, target.questionId)
        : categoryHash(target.categoryId);
      setHashTick((tick) => tick + 1);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [categories]);

  // Scroll once the targeted panel is visible; the header offset comes from scroll-padding.
  useEffect(() => {
    const id = scrollTarget.current;
    if (!id) return;
    scrollTarget.current = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [hashTick]);

  const select = (id: FaqCategoryId) => {
    setCategoryId(id);
    setOpenId(null);
    window.history.replaceState(null, "", `#${categoryHash(id)}`);
  };

  return (
    // min-w-0: the pill row scrolls sideways, so it must not widen the grid column on phones.
    <div className="min-w-0">
      {categories.length > 1 && (
        <PillTabs
          tabs={categories.map(({ id, label }) => ({ id, label }))}
          value={categoryId}
          onChange={select}
          label={faqSection.categoriesLabel}
          idPrefix={PREFIX}
          controls={categoryHash}
        />
      )}

      {categories.map((category) => (
        <div
          key={category.id}
          id={categoryHash(category.id)}
          role={categories.length > 1 ? "tabpanel" : undefined}
          aria-labelledby={categories.length > 1 ? pillTabId(PREFIX, category.id) : undefined}
          hidden={category.id !== categoryId}
          className={categories.length > 1 ? "mt-6 border-t border-line" : "border-t border-line"}
        >
          {category.items.map((item) => {
            const id = questionHash(category.id, item.id);
            return (
              <details
                key={item.id}
                id={id}
                open={openId === id}
                onToggle={(event) => {
                  const open = event.currentTarget.open;
                  setOpenId((current) => (open ? id : current === id ? null : current));
                }}
                className="faq-item group border-b border-line"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-head text-[clamp(18px,1.6vw,20px)] leading-tight font-bold tracking-[-0.015em] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-xl shadow-[inset_0_0_0_1px_var(--color-line)] transition-[rotate,background-color,color] duration-250 ease-out-soft group-open:rotate-45 group-open:bg-ink group-open:text-white"
                  >
                    +
                  </span>
                </summary>
                <p className="pr-12 pb-6 text-muted">
                  <Value value={item.answer} />
                </p>
              </details>
            );
          })}
        </div>
      ))}
    </div>
  );
}
