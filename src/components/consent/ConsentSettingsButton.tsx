"use client";

import type { ReactNode } from "react";
import { useConsent } from "./ConsentProvider";

/** Reopens the cookie settings (LC-2): footer link "Настройки на бисквитките", /biskvitki. */
export function ConsentSettingsButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openSettings } = useConsent();
  return (
    <button type="button" onClick={openSettings} className={className}>
      {children}
    </button>
  );
}
