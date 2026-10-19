"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  CONSENT_COOKIE,
  consentCookie,
  makeConsent,
  parseConsent,
  readCookie,
  type Consent,
  type ConsentCategory,
} from "@/lib/consent";

/**
 * Consent state for the whole site (B-22, A-13). The cookie is the single source of truth; this
 * store mirrors it so the banner, the footer button, the map and the ad scripts agree.
 * `undefined` = not known yet (server render and hydration), `null` = visitor has not decided.
 */

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Consent | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Consent | null {
  const raw = readCookie(document.cookie, CONSENT_COOKIE);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cached = parseConsent(raw);
  }
  return cached;
}

function getServerSnapshot(): Consent | null | undefined {
  return undefined;
}

function writeConsent(choice: Record<ConsentCategory, boolean>) {
  document.cookie = consentCookie(
    makeConsent(choice, new Date()),
    window.location.protocol === "https:",
  );
  listeners.forEach((listener) => listener());
}

type ConsentContextValue = {
  consent: Consent | null | undefined;
  decide: (choice: Record<ConsentCategory, boolean>) => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue>({
  consent: undefined,
  decide: () => {},
  settingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {},
});

export function useConsent() {
  return use(ConsentContext);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  const decide = useCallback((choice: Record<ConsentCategory, boolean>) => {
    writeConsent(choice);
    setSettingsOpen(false);
  }, []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({ consent, decide, settingsOpen, openSettings, closeSettings }),
    [consent, decide, settingsOpen, openSettings, closeSettings],
  );

  return <ConsentContext value={value}>{children}</ConsentContext>;
}
