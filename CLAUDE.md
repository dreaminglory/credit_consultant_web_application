# ExtraConsult Website

Bulgarian-language website for **Desislava Arabadzhieva (Десислава Арабаджиева)**, an
independent **credit consultant** in Bulgaria (her firm: ExtraConsult; she works through
CreditMall as the registered intermediary). The site is centred on her as a person, not on a
company or team. Products: mortgages, refinancing, business and consumer loans (including car
purchases). Goal: turn ad, search and referral visitors into **free-consultation requests**.

**Benchmark:** the site must beat https://www.creditmall.bg/ in every way — content depth, real
proof, tools, speed, accessibility, compliance, polish (REQUIREMENTS §1.1). Check every block
against its CreditMall equivalent. Never disparage CreditMall on the site.

**Home-first:** Home is the flagship and holds most content (about, process, reviews, FAQ,
calculators, form). Separate pages only for loans, calculators, contact, consultation form,
thank-you, legal and 404 (REQUIREMENTS §3.1).

Read before non-trivial work:
- `docs/BUSINESS_CONTEXT.md` — what the business is and why the site exists
- `docs/REQUIREMENTS.md` — sitemap, navigation, templates (T1–T6), blocks (B-01–B-24),
  requirement IDs (FR-, NAV-, PR-, DR-, TR-…), open items
- `docs/BUILD_PLAN.md` — architecture decisions (A-1…), milestones M1–M10, owner inputs
- `docs/CONTENT.md` — draft Bulgarian copy (menus, process durations, coverage, FAQ)
- `design/mockup-home.html` — approved visual direction (v2)

## Stack
- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- Hosted on **Cloudflare** (Workers) via the OpenNext Cloudflare adapter
- Static pages; the **only** server code is the consultation form handler
- **No database.** Leads go to email (Resend) + Google Sheet
- Spam: honeypot + Cloudflare Turnstile. Validation: Zod (client and server)

## Commands
- `npm run dev` — local dev server on http://localhost:3000 (`/dev/kit` shows the design system)
- `npm run build` — production build (must pass before a task is done)
- `npm run lint` / `npm run typecheck` (typecheck runs `next typegen` first)
- `npm test` — Vitest unit tests (`src/**/*.test.ts`)
- `npm run preview` — OpenNext build + local Workers runtime on http://localhost:8787 (check before deploying)
- `npm run images` — regenerate `public/img` and `public/banks` from `raw_contents/`
- `npm run check:content` — list open owner items (`pending("O-…")`) still used; must be empty at launch
- Next.js 16 differs from older versions: read `node_modules/next/dist/docs/` before using an API (see AGENTS.md).
- Dependencies are pinned exactly; new ones must be ≥ 14 days old (`npm view <pkg> time`).
  npm 11 blocks install scripts — approve only known ones with `npm approve-scripts <pkg>`.

## Structure (target)
```
src/app/            routes (one folder per page, see sitemap), api/lead route handler
src/components/ui/        primitives: Button, GlassCard, Label, Field, Accordion…
src/components/layout/    Header, MegaMenu, MobileMenu, Footer, Breadcrumbs, MobileBar
src/components/blocks/    reusable page blocks B-03 … B-24 (ProcessTimeline, BankLogos…)
src/components/templates/ page templates T1–T6
src/lib/            calculators, validation schemas, email + sheet clients
src/config/site.ts  phone, Viber, email, banks, calculator defaults, company data
src/config/pending.ts  typed placeholders for open owner items (A-6)
src/content/        Bulgarian page copy that is not inline
scripts/            image pipeline, content check
docs/               business context and requirements
design/             mockups
```

## Conventions
- All user-facing text in **Bulgarian**, written in the **first person** as the consultant
  ("аз", "ще ви се обадя"), addressing the visitor as "вие". The consultant is a woman: use
  **feminine forms** ("готова съм", "регистрирана съм", "помогнала съм"). Code, comments,
  commits in English.
- Money in **EUR**; format with `Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'EUR' })`.
- Dates/times shown in Europe/Sofia.
- Contact data, bank list and calculator defaults come only from `src/config/site.ts` — never
  hard-code a phone number in a component.
- Calculator math lives in `src/lib/` as pure functions with unit tests.
- Server Components by default; `"use client"` only where interactivity needs it.
- Pages are **compositions of blocks** inside a template. Before building something new on a
  page, check whether a block exists or should become one. No page designed from scratch.
- Navigation items, banks, registration data (ЕИК, BNB number) and contacts come from config —
  the footer, FAQ and legal pages must show identical wording.

## Design rules
- Use the **`frontend-design`** skill for any visual work. Follow the v2 mockup (REQUIREMENTS
  DR-1 … DR-3): Habito-inspired but mature — heavy tight headlines, soft blurred gradients,
  frosted-glass cards, pill buttons, mono labels; **no pastels, no cartoon illustrations**.
- Tokens: ink `#0E1615`, petrol `#0F3B3E`, sea `#2E6B66`, sand `#E9E2D4`, paper `#F5F3EE`,
  gold `#C59A3D`. Fonts: Inter Tight (headlines), Onest (body), IBM Plex Mono (labels).
  Define them as Tailwind theme tokens, never ad-hoc hex values.
- Motion is part of the brand (DR-4): scroll reveals, self-drawing process line, mega-menu
  transitions, hover lifts — built into blocks, 150–600 ms, always with a
  `prefers-reduced-motion` fallback. **No 3D in v1.**
- Must work on phones, tablets and desktops: check every page at 360, 768, 1024, 1280, 1440 px.
- Glass/blur effects need a solid fallback and must keep text contrast AA.
- WCAG 2.2 AA: labels on inputs, visible focus, contrast, keyboard navigation, reduced motion.
- Run the **`web-design-guidelines`** review on finished pages; follow
  **`react-best-practices`** and **`composition-patterns`** for React code.

## Hard rules — privacy, security, compliance
- **Never** collect ЕГН, ID card numbers, income documents or similar on the site.
- **Never** log personal data (name, phone, email, message). Log only error type and request ID.
- **Never** put personal data in URLs, query strings or analytics events.
- Secrets only in environment variables (`.env.local`, never committed). Keep `.env.example` current.
- Tracking pixels (Meta, Google Ads) load **only after cookie consent**.
- Calculators always show the "indicative, not an offer" disclaimer.
- Testimonials, client photos, bank logos and numbers must be real and supplied by the owner.
  Never invent reviews, client counts, statistics, rates, fees or bank partnerships. Use a
  clearly marked placeholder instead.
- Fee/tariff/limit values (notary, municipal tax, BNB limits) live in config with source and
  date; never hard-code them in components.
- The Google Map loads only on click or after consent.
- If email delivery or the Sheet write fails, the other must still succeed — never lose a lead.
- Do not install packages younger than 14 days or with low adoption without asking.

## Workflow
- Plan mode for any new page or feature; build after the plan is approved.
- Keep changes small and reviewable. One feature per branch.
- Build the minimal working version first, then a separate cleanup pass (remove duplication,
  extract shared helpers) — don't mix the two.
- Search existing code before adding a new helper or component.
- When unsure about a library API, check its source/docs; don't guess.
- Reference requirement IDs (e.g. FR-7) in plans and commit messages.

## Definition of done
- `build`, `lint`, `typecheck` and tests pass.
- Checked in the browser at mobile and desktop widths.
- No placeholder text left unless it is a tracked open item (O-1 … O-14 in REQUIREMENTS.md).
- Summary states what changed, what was tested, and what still needs the owner.
