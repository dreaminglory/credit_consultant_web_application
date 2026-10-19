"use client";

import { useEffect } from "react";
import { ATTRIBUTION_KEY, nextStoredSource, readStoredSource } from "@/lib/lead/attribution";

/**
 * Remembers the session's landing page, campaign parameters and external referrer (FR-5) in
 * sessionStorage, so a request sent from another page still shows which ad brought the visitor.
 * Renders nothing; the data leaves the browser only inside a consultation request.
 */
export function Attribution() {
  useEffect(() => {
    try {
      const stored = readStoredSource(sessionStorage.getItem(ATTRIBUTION_KEY));
      const next = nextStoredSource(stored, new URL(window.location.href), document.referrer);
      if (next !== stored) sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    } catch {
      // Storage blocked (private mode, settings): attribution is optional.
    }
  }, []);
  return null;
}
