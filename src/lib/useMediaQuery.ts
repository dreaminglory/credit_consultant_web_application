"use client";

import { useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result. `serverValue` is what the server render (and hydration) assumes;
 * pick the conservative one, e.g. `false` for "prefers no reduced motion".
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
