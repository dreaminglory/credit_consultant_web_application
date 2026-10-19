import {
  consentModeState,
  conversionTarget,
  isMarketingCookie,
  pageLocation,
  type TrackingIds,
} from "@/lib/tracking";

/**
 * Browser-side loader for Meta Pixel and Google Ads (FR-28). Only called after marketing
 * consent; until then no request goes to Meta or Google. Events sent before the scripts are
 * initialised wait in a queue, so a conversion on /blagodarim is never lost to ordering.
 * Events carry no personal data: no form fields, no values, no query strings.
 */

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let ids: TrackingIds | null = null;
const queue: Array<() => void> = [];

function addScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initGoogle(adsId: string) {
  window.dataLayer = window.dataLayer ?? [];
  // gtag must push the `arguments` object itself, as in Google's snippet.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // Consent Mode v2: default denied, then the visitor's grant (A-13).
  window.gtag("consent", "default", consentModeState(null));
  window.gtag("consent", "update", consentModeState({ marketing: true }));
  window.gtag("js", new Date());
  window.gtag("config", adsId);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`);
}

function initMeta(pixelId: string) {
  // Meta's standard stub: queues calls until fbevents.js arrives.
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  addScript("https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", pixelId);
  fbq("track", "PageView");
}

/** Loads the configured scripts once per page load and flushes queued events. */
export function startMarketing(config: TrackingIds) {
  if (ids) return;
  ids = config;
  if (config.googleAdsId) initGoogle(config.googleAdsId);
  if (config.metaPixelId) initMeta(config.metaPixelId);
  queue.splice(0).forEach((run) => run());
}

function whenReady(run: () => void) {
  if (ids) run();
  else queue.push(run);
}

/** Page view after a client-side navigation (the first one is sent by init). */
export function trackPageView(pathname: string) {
  if (!ids) return;
  const location = pageLocation(window.location.origin, pathname);
  window.gtag?.("event", "page_view", { page_location: location });
  window.fbq?.("track", "PageView");
}

/** Consultation request conversion, fired on /blagodarim (FR-28). */
export function trackLead() {
  whenReady(() => {
    const target = ids && conversionTarget(ids);
    if (target) window.gtag?.("event", "conversion", { send_to: target });
    window.fbq?.("track", "Lead");
  });
}

/** Withdrawal: removes the first-party ad cookies on this host and its parent domain. */
export function clearMarketingCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0]?.trim();
    if (!name || !isMarketingCookie(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
