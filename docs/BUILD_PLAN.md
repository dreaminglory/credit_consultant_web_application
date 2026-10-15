# Build Plan — ExtraConsult Website (v1)

> Status: **Draft for approval** — 2026-10-15
> Inputs: [REQUIREMENTS.md](REQUIREMENTS.md) (v4), [BUSINESS_CONTEXT.md](BUSINESS_CONTEXT.md),
> [CONTENT.md](CONTENT.md), [design/mockup-home.html](../design/mockup-home.html) (v2 — already
> home-first with the right anchors: `#krediti #proces #banki #kalkulatori #za-men #otzivi
> #vaprosi #konsultacia #kontakt`).
> One milestone = one branch = one session (sometimes two). Each ends with build, lint,
> typecheck, tests green and a browser check at 360 / 768 / 1024 / 1280 / 1440 px.

## 1. Architecture decisions

| # | Decision | Why |
|---|---|---|
| A-1 | **Next.js 16 App Router + TS strict**, every page statically generated; the only dynamic route is `POST /api/lead` | TR-1, TR-2 |
| A-2 | **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`) + Wrangler; `npm run preview` runs the Workers runtime locally | TR-3 |
| A-3 | **Tailwind CSS v4**, tokens defined CSS-first in `@theme` (colours, fonts, radii, shadows, easing, durations) — no ad-hoc hex | DR-2, CLAUDE.md |
| A-4 | Fonts via `next/font/google` with `cyrillic` + `latin` subsets (self-hosted at build, no Google request at runtime) | DR-3, privacy, speed |
| A-5 | **Content as typed TS modules** in `src/content/` (loans, process, FAQ, coverage, testimonials) + `src/config/site.ts` for contacts, registration, banks, nav, calculator defaults, tariffs. No CMS | TR-11 |
| A-6 | **Placeholders are typed**: `placeholder("O-5", "phone")` returns a visibly marked value in dev and a script `npm run check:content` lists every open item still used — launch gate | DoD, CR-5 |
| A-7 | **Motion**: CSS transitions + one small `useInView` (IntersectionObserver) for reveals; SVG `stroke-dashoffset` for the process line and coverage lines. Add the `motion` library only if a sequence truly needs it (decided in M4) | DR-4, TR-6, Lighthouse |
| A-8 | **Images**: build-time script (`sharp`, dev-only) converts `raw_contents/` photos to AVIF/WebP at 3–4 widths into `public/img/`; rendered with `<picture>`. Avoids paid Cloudflare image transforms | TR-7 |
| A-9 | **Bank logos** as optimised inline-able SVG in `public/banks/`, greyscale via CSS filter, colour on hover | BL-1…3 |
| A-10 | **Lead handler**: Zod → honeypot → Turnstile verify → rate limit (Workers rate-limit binding) → `Promise.allSettled([emailOwner, appendSheet])` then auto-reply. Success if **either** delivery succeeded; both failed → 502 + phone/Viber fallback. Logs: error type + request ID only | FR-1…11, TR-10 |
| A-11 | **Email via Resend REST API with `fetch`** (no SDK); **Sheet via Google Apps Script web app** with a shared secret (no service-account keys in the Worker) | TR-4, TR-5, fewer deps |
| A-12 | **Turnstile** via a ~40-line own component (script loaded on form interaction) — no wrapper package | FR-4, deps rule |
| A-13 | **Consent**: own lightweight banner (B-22) storing choice in a first-party cookie; Google Consent Mode v2 defaults to denied; Meta Pixel / Google Ads / live map load only after opt-in | FR-27, FR-28, LC-2, BM-8 |
| A-14 | **Calculators**: pure functions in `src/lib/calc/` (annuity, max loan by DSTI, max loan by payment, rate from payment via Newton + bisection fallback, APR/ГПР per EU formula, refinancing net saving); limits (BNB DSTI/LTV/term) in config with source + date | FR-12…17, FR-21 |
| A-15 | **Tests**: Vitest for `src/lib/**` (calculators vs a reference spreadsheet, validation, email formatting, lead handler with mocked fetch) | Acceptance §15 |
| A-16 | **SEO**: Metadata API per route, `sitemap.ts`, `robots.ts`, JSON-LD helpers (`FinancialService`, `Person`, `FAQPage`, `BreadcrumbList`); security headers in `next.config` | TR-8, TR-10, BM-10 |

**Dependency rule:** every package is pinned to the newest version that is **≥ 14 days old** at
install time (checked with `npm view <pkg> time`). Today several latest releases (Next 16.4.1,
OpenNext 1.20.12, Zod 4.6.7, Wrangler 4.151.0) are days old, so we take the previous ones.
Runtime deps target: `next`, `react`, `react-dom`, `zod`. Dev: Tailwind, OpenNext, Wrangler,
Vitest, ESLint, Prettier, `sharp`. Anything else needs your OK.

## 2. Folder layout (target)
```
src/app/(site)/page.tsx                 Home (T1)
src/app/(site)/krediti/[slug]/page.tsx  loan pages (T2), generateStaticParams
src/app/(site)/kalkulatori/[slug]/…     calculator pages (T3)
src/app/(site)/konsultacia|blagodarim|kontakti|poveritelnost|biskvitki|obshti-usloviya
src/app/api/lead/route.ts               only server code
src/components/{ui,layout,blocks,templates}
src/lib/{calc,lead,seo,motion,format}   pure helpers + tests
src/config/site.ts   src/content/*.ts
scripts/optimize-images.mjs   scripts/check-content.mjs
```

## 3. Milestones

### M1 — Foundation  `feat/foundation`  — done 2026-10-15 (Lighthouse baseline moved to M3)
1. `git init`, `.gitignore`, `.env.example` (RESEND_API_KEY, LEAD_TO_EMAIL, SHEET_WEBHOOK_URL,
   SHEET_SECRET, TURNSTILE_SITE_KEY/SECRET), first commit of docs.
2. Scaffold Next.js + TS strict + Tailwind v4 + ESLint; add Prettier, Vitest; add OpenNext +
   `wrangler.jsonc`; scripts `dev / build / lint / typecheck / test / preview / check:content`.
3. Tokens in `@theme` from the mockup (colours, `--glass`, radii 20/28/999, shadows, easings,
   durations 150–600 ms), fonts, base typography (h1–h3 clamp scales, `.label`, `.lead`),
   global focus ring, reduced-motion base.
4. UI primitives: `Button` (dark / line / gold, arrow chip), `RoundButton`, `GlassCard`
   (light/dark + solid fallback), `Label`, `Section` (light/sand/dark/mesh variants), `Mesh`
   gradient, `Reveal`, `Container`, `Placeholder` (O-n marker).
5. `src/config/site.ts` + content types; seed with known facts (name, ЕИК, BNB №, banks,
   Plovdiv) and typed placeholders for O-items; `check:content` script.
6. Asset pipeline: photos → AVIF/WebP; bank SVGs cleaned and named. Flag: DSK and ЦКБ files
   are the **white** variants — need dark versions for light backgrounds (or recolour).
7. Install skills (DT-1…4: `frontend-design`, `react-best-practices`, `web-design-guidelines`,
   `composition-patterns`) after reading their files; fill Commands in CLAUDE.md.
8. A `/dev/kit` page (noindex, excluded from build in prod) showing all primitives for review.
9. **Baseline**: record creditmall.bg Lighthouse mobile scores in REQUIREMENTS §1.1 (BM-11).
- Done when: `npm run build` and `npm run preview` serve the kit page in the Workers runtime.

### M2 — Layout shell  `feat/layout`  — NAV-1…8, FT-1…2, B-01, B-02, B-21
Sticky glass header, Кредити mega-menu, Калкулатори dropdown (hover + click, Esc/outside
close, arrow keys, `aria-expanded`), anchor links with scroll-spy and header offset, mobile
slide-in panel with accordions + call/Viber/WhatsApp, footer with disclosure line, breadcrumbs,
mobile action bar, skip link. Wordmark placeholder until a logo is chosen (O-13).

### M3 — Home, static blocks  `feat/home-static`  — B-04, B-05, B-06, B-08, B-09, B-11, B-14, B-19, B-20, B-24
Hero with Desislava's portrait, promise strip, loan cards, about me, why-me split, bank
logos (grid / marquee), coverage map (SVG Bulgaria, Plovdiv pin, animated lines), CTA band,
contact strip. Home assembled in final order with stubs for the interactive sections.

### M4 — Home, interactive blocks  `feat/home-interactive`  — B-07, B-10, B-13, PR-1…5, FR-24…25, FAQ-1…4
Process journey line (self-drawing, active step, durations, total time, Вие/Аз, product
variants), testimonial carousel (swipe, keyboard, pause, filter by product), FAQ with
category pills + one-open accordion + hash links + FAQPage JSON-LD. Lazy hydration (HP-1).

### M5 — Calculators  `feat/calculators`  — FR-12…17, FR-21…22, B-12, B-16, B-23, T3
Pure functions + Vitest against a reference spreadsheet (to the cent), embeddable
calculator component, hub with tabs on Home, `/kalkulatori` overview and 6 T3 pages,
disclaimer everywhere. FR-18…20 stay hidden until O-12.

### M6 — Consultation pipeline  `feat/lead`  — FR-1…11, B-17, T5
Shared Zod schema, compact (Home, loan pages) and full (`/konsultacia`) forms, UTM/gclid/fbclid
capture, product pre-select, Turnstile, honeypot, `/api/lead`, owner email (HTML + text),
Apps Script for the Sheet (script file committed in `scripts/`), auto-reply, `/blagodarim`.
Tested end-to-end with test keys in `npm run preview`.

### M7 — Remaining pages  `feat/pages`  — T2, T4, B-03, B-15, B-18, FR-26…27
`/krediti` + 4 loan pages (product-specific process, embedded calculator, filtered reviews
and FAQ, pre-selected form), `/kontakti` with click-to-load map, 404.

### M8 — Compliance, SEO, tracking  `feat/compliance`  — §8, LC-1…8, FR-28…29, TR-8, TR-10
Consent banner + settings link, consent-gated pixels, Cloudflare Web Analytics, legal pages
(T6) drafted from CreditMall templates and marked for lawyer review, JSON-LD, sitemap, robots,
security headers, rate limiting.

### M9 — Polish and benchmark audit  `feat/polish`
Motion tuning on real pages, all 5 breakpoints, `web-design-guidelines` review, keyboard and
screen-reader pass, Lighthouse ≥ 90 and above the creditmall.bg baseline on every template,
side-by-side BM-1…12 checklist. Logo concepts (§7.1) if not done earlier.

### M10 — Content fill and launch
Replace placeholders (`check:content` must be empty), domain + DNS on Cloudflare,
SPF/DKIM/DMARC for Resend, production env vars, test requests, go live.

## 4. What I need from you, and when

| Before | Item |
|---|---|
| M1 | Confirm this plan. GitHub repo (yes/no, private?) |
| M2 | Logo direction (O-13) — or ship with a clean wordmark first |
| M3 | Her story, years, client count (O-7); which of the 3 photos is the hero; dark DSK/ЦКБ logos (O-4) |
| M4 | Confirmed step durations (O-9); testimonials + photos with consent (O-1) |
| M5 | A reference spreadsheet or OK for me to build one; verified BNB limits |
| M6 | Resend account + domain, Google account for the Sheet, Cloudflare account (Turnstile) |
| M7 | Office address (O-11), hours (O-10), phone/Viber/WhatsApp/email (O-5) |
| M8 | CreditMall legal templates / lawyer (O-3, O-14), retention period (O-8), Meta/Google IDs |
| M10 | Domain purchase (D-2) |

Nothing blocks M1–M2; later milestones proceed with marked placeholders when inputs are late.

## 5. Risks
- **OpenNext + newest Next.js** may lag: pin a Next version the adapter lists as supported.
- **Long Home page vs Lighthouse ≥ 90**: lazy hydration, no heavy libraries, AVIF hero, fonts
  subset — measured from M3 onwards, not only at the end.
- **Backdrop-filter cost on low-end phones**: solid fallback and fewer blurred layers on mobile.
- **Content arriving late** is the main schedule risk, not code.
