"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/config/site";
import { hasMarketingIds } from "@/lib/tracking";
import { useConsent } from "./ConsentProvider";
import { clearMarketingCookies, startMarketing, trackPageView } from "./tracker";

/**
 * Starts Meta Pixel / Google Ads only after marketing consent (FR-28, BM-8) and only when IDs
 * are configured. Withdrawing consent clears their cookies and reloads the page, so scripts that
 * already ran are gone too. Renders nothing.
 */
export function MarketingScripts() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const started = useRef<string | null>(null);
  const marketing = consent?.marketing === true;

  useEffect(() => {
    if (consent === undefined) return;
    if (marketing) {
      if (started.current === null && hasMarketingIds(site.tracking)) {
        started.current = pathname;
        startMarketing(site.tracking);
      }
    } else {
      clearMarketingCookies();
      if (started.current !== null) window.location.reload();
    }
    // Only the consent decides; page views are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consent, marketing]);

  useEffect(() => {
    // The first page view goes out with init; later client navigations are tracked here.
    if (started.current === null || started.current === pathname) return;
    started.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
