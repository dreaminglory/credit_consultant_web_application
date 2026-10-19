"use client";

import { cookieCategories } from "@/config/cookies";
import { consentCopy } from "@/content/consent";
import { buttonClasses } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";
import { ConsentSettingsButton } from "./ConsentSettingsButton";

/** Current cookie choice + the settings button, for the cookie policy page (LC-2). */
export function ConsentStatus() {
  const { consent } = useConsent();
  const { current } = consentCopy;
  const state = (on: boolean) => (on ? current.on : current.off);

  return (
    <div className="flex flex-col items-start gap-4 rounded-tile border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px]" aria-live="polite">
        {consent === undefined
          ? " "
          : consent === null
            ? current.undecided
            : `${current.prefix}${cookieCategories.marketing.title} — ${state(consent.marketing)}, ${cookieCategories.media.title} — ${state(consent.media)}.`}
      </p>
      <ConsentSettingsButton className={buttonClasses("dark", "shrink-0", "compact")}>
        {consentCopy.settingsTitle}
      </ConsentSettingsButton>
    </div>
  );
}
