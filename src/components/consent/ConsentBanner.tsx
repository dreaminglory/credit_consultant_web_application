"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cookieCategories, type CookieCategory } from "@/config/cookies";
import { consentCopy } from "@/content/consent";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { ConsentCategory } from "@/lib/consent";
import { useConsent } from "./ConsentProvider";

const ALL = { marketing: true, media: true } as const;
const NONE = { marketing: false, media: false } as const;
const optional: ConsentCategory[] = ["marketing", "media"];

/**
 * Cookie banner and settings dialog (B-22, LC-2, BM-8). Opt-in: nothing optional runs until the
 * visitor chooses. "Приеми всички" and "Откажи" have the same size and weight. The banner is a
 * non-modal region (the page stays usable); the settings are a native modal dialog, so focus
 * trapping and Esc come from the browser.
 */
export function ConsentBanner() {
  const { consent, decide, settingsOpen, openSettings, closeSettings } = useConsent();
  const titleId = useId();
  const showBanner = consent === null && !settingsOpen;

  return (
    <>
      {showBanner && (
        <section
          aria-labelledby={titleId}
          className="consent-in glass fixed inset-x-2.5 bottom-[calc(max(0.625rem,env(safe-area-inset-bottom))+72px)] z-50 rounded-card p-5 shadow-bar md:inset-x-auto md:bottom-6 md:left-6 md:w-[440px] md:p-6"
        >
          <h2 id={titleId} className="text-[22px] tracking-[-0.02em]">
            {consentCopy.title}
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-muted">{consentCopy.text}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button size="compact" onClick={() => decide(ALL)}>
              {consentCopy.acceptAll}
            </Button>
            <Button size="compact" onClick={() => decide(NONE)}>
              {consentCopy.rejectAll}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[15px]">
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            >
              {consentCopy.settings}
            </button>
            <Link
              href="/biskvitki"
              className="inline-flex min-h-11 items-center text-muted underline underline-offset-4"
            >
              {consentCopy.policyLink}
            </Link>
          </div>
        </section>
      )}
      {settingsOpen && (
        <ConsentSettings initial={consent ?? NONE} onSave={decide} onClose={closeSettings} />
      )}
    </>
  );
}

type ConsentSettingsProps = {
  initial: Record<ConsentCategory, boolean>;
  onSave: (choice: Record<ConsentCategory, boolean>) => void;
  onClose: () => void;
};

function ConsentSettings({ initial, onSave, onClose }: ConsentSettingsProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [choice, setChoice] = useState({ marketing: initial.marketing, media: initial.media });

  // Mounted only while open; the dialog is shown modally on mount.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const categories: CookieCategory[] = ["necessary", ...optional];

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (event.target === event.currentTarget) ref.current?.close();
      }}
      className="consent-dialog m-auto max-h-[calc(100dvh-24px)] w-[calc(100%-20px)] max-w-[540px] overflow-y-auto rounded-card bg-white p-0 text-ink shadow-bar"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[clamp(26px,3vw,32px)]">
            {consentCopy.settingsTitle}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={consentCopy.close}
            className="grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-150 hover:bg-sand"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-[15px] text-muted">{consentCopy.settingsText}</p>

        <ul className="mt-6 grid gap-3">
          {categories.map((id) => {
            const category = cookieCategories[id];
            const inputId = `${titleId}-${id}`;
            const checked = id === "necessary" ? true : choice[id];
            return (
              <li key={id} className="rounded-tile border border-line bg-paper p-4">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor={inputId} className="font-semibold">
                    {category.title}
                  </label>
                  {category.locked ? (
                    <span className="font-mono text-xs tracking-[0.05em] text-muted uppercase">
                      {consentCopy.alwaysOn}
                    </span>
                  ) : (
                    <input
                      id={inputId}
                      type="checkbox"
                      role="switch"
                      checked={checked}
                      aria-describedby={`${inputId}-text`}
                      onChange={(event) =>
                        setChoice((prev) => ({ ...prev, [id]: event.target.checked }))
                      }
                      className="consent-switch"
                    />
                  )}
                </div>
                <p id={`${inputId}-text`} className="mt-1.5 text-[15px] leading-snug text-muted">
                  {category.text}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <Button size="compact" onClick={() => onSave(choice)} className="sm:order-last">
            {consentCopy.save}
          </Button>
          <Button size="compact" variant="line" onClick={() => onSave(ALL)}>
            {consentCopy.acceptAll}
          </Button>
          <Button size="compact" variant="line" onClick={() => onSave(NONE)}>
            {consentCopy.rejectAll}
          </Button>
        </div>
        <Link
          href="/biskvitki"
          onClick={() => ref.current?.close()}
          className="mt-4 inline-block text-[15px] text-muted underline underline-offset-4"
        >
          {consentCopy.policyLink}
        </Link>
      </div>
    </dialog>
  );
}
