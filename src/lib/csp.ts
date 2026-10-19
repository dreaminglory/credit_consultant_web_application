/**
 * Content Security Policy and other security headers (TR-10). Pages are static, so a per-request
 * nonce is impossible; scripts are limited to our origin plus the few third parties the site
 * uses (Turnstile, Cloudflare analytics, and — after consent — Google Ads and Meta Pixel).
 * Inline scripts stay allowed because Next.js inlines its own bootstrap data.
 * When a new third party is added, list its hosts here and in `config/cookies.ts`.
 */

const turnstile = "https://challenges.cloudflare.com";
const cfAnalytics = {
  script: "https://static.cloudflareinsights.com",
  beacon: "https://cloudflareinsights.com",
};
const google = {
  tag: "https://www.googletagmanager.com",
  ads: "https://www.googleadservices.com",
  doubleclick: "https://googleads.g.doubleclick.net",
  anyDoubleclick: "https://*.doubleclick.net",
  www: "https://www.google.com",
  analytics: "https://*.google-analytics.com",
  maps: "https://maps.google.com",
  /**
   * Google Ads also reports conversions to the visitor's country domain (www.google.bg for
   * Bulgaria). CSP cannot wildcard a TLD, so list Bulgaria and the countries with the most
   * Bulgarians abroad (the site serves them, BM-7); elsewhere only that extra ping is blocked.
   */
  countries: [
    "bg",
    "de",
    "co.uk",
    "es",
    "it",
    "gr",
    "fr",
    "nl",
    "at",
    "be",
    "ch",
    "ie",
    "se",
    "cy",
  ].map((tld) => `https://www.google.${tld}`),
};
const meta = { script: "https://connect.facebook.net", www: "https://www.facebook.com" };

export type CspOptions = {
  /** `next dev` needs eval (React debugging) and a websocket for hot reload. */
  dev: boolean;
  /** Only on an HTTPS origin; on plain-HTTP localhost it would break `next start`. */
  upgradeInsecure: boolean;
};

export function contentSecurityPolicy({ dev, upgradeInsecure }: CspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(dev ? ["'unsafe-eval'"] : []),
      turnstile,
      cfAnalytics.script,
      google.tag,
      google.ads,
      google.doubleclick,
      meta.script,
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      google.www,
      ...google.countries,
      google.tag,
      google.anyDoubleclick,
      meta.www,
    ],
    "font-src": ["'self'"],
    "connect-src": [
      "'self'",
      ...(dev ? ["ws:"] : []),
      turnstile,
      cfAnalytics.beacon,
      google.www,
      ...google.countries,
      google.tag,
      google.ads,
      google.analytics,
      google.anyDoubleclick,
      meta.www,
      meta.script,
    ],
    "frame-src": [turnstile, google.www, google.maps, google.tag, google.anyDoubleclick],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (upgradeInsecure) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function securityHeaders(options: CspOptions & { hsts: boolean }) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    ...(options.hsts
      ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
      : []),
  ];
}
