"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile without a wrapper package (A-12, FR-4). The script loads on the first
 * interaction with the form, not with the page, so it costs nothing for visitors who only read.
 * `appearance: "interaction-only"` keeps the widget invisible unless Cloudflare needs a click.
 */

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_WAIT_MS = 15_000;

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error()));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile_load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function useTurnstile(siteKey: string | undefined) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((value: string | null) => void)[]>([]);
  const started = useRef(false);

  const settle = useCallback((value: string | null) => {
    token.current = value;
    for (const resolve of waiters.current.splice(0)) resolve(value);
  }, []);

  /** Loads the script and renders the widget once; call on the first focus or input. */
  const activate = useCallback(() => {
    if (started.current || !siteKey) return;
    started.current = true;
    loadScript()
      .then((api) => {
        if (!container.current) return;
        widgetId.current = api.render(container.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
          language: "bg",
          callback: (value: string) => settle(value),
          "expired-callback": () => (token.current = null),
          "error-callback": () => settle(null),
        });
      })
      .catch(() => {
        started.current = false;
        settle(null);
      });
  }, [siteKey, settle]);

  /** Resolves with a token, waiting for the widget if needed; `null` when none arrives. */
  const getToken = useCallback((): Promise<string | null> => {
    if (token.current) return Promise.resolve(token.current);
    if (!siteKey) return Promise.resolve(null);
    activate();
    return new Promise((resolve) => {
      waiters.current.push(resolve);
      setTimeout(() => resolve(token.current), TOKEN_WAIT_MS);
    });
  }, [siteKey, activate]);

  /** Tokens are single-use: get a fresh one after every submit. */
  const reset = useCallback(() => {
    token.current = null;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, []);

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    },
    [],
  );

  return { container, activate, getToken, reset };
}
