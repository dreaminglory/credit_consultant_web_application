# Requirements — ExtraConsult Website (v1)

> Status: **Draft v4 for owner review** — 2026-10-15 (owner named; creditmall.bg benchmark;
> home-first structure)
> Consultant: **Desislava Arabadzhieva (Десислава Арабаджиева)**, firm ExtraConsult
> Business background: [BUSINESS_CONTEXT.md](BUSINESS_CONTEXT.md)
> Draft Bulgarian copy (menus, process, FAQ, coverage): [CONTENT.md](CONTENT.md)
> Visual direction: [design/mockup-home.html](../design/mockup-home.html) (v2)
> References — structure: creditmall.bg, creditcenter.bg · style: habito.com/about-us (made mature)

## 1. Goal
A multi-page Bulgarian website **centred on the consultant as a person**, turning visitors from
Meta and Google ads, search and referrals into **free-consultation requests**. It should be the
best individual credit-consultant website in Bulgaria: spectacular home page, slick motion, clear
structure, real proof (photos with clients, their feedback, bank partners).

**Success looks like:**
- Within 10 seconds a visitor knows *who* will help them, that it's **free**, and that the
  consultant **handles everything**.
- Requests arrive by email and in a Google Sheet within seconds, nicely formatted.
- The owner can see which ad/campaign each request came from.
- Side by side with creditmall.bg, ours is better on every row of §1.1.

### 1.1 Benchmark: beat creditmall.bg (D-6)
Reviewed 2026-10-15. Comparison by area (full table in BUSINESS_CONTEXT §9):

| ID | Area | creditmall.bg | Our target |
|---|---|---|---|
| BM-1 | Who helps you | Anonymous team, stock photos | Desislava's portrait in the hero, about-me section, photos with clients |
| BM-2 | Tools | 1 calculator on Home | Calculator hub with 6 calculators on Home + one page each |
| BM-3 | Conversion | 2-field form | Compact form on Home (same friction) + full form page, Viber/WhatsApp, mobile action bar |
| BM-4 | Proof | 4 text reviews | ~8 photo testimonials with consent (O-1), bank logos, real numbers only |
| BM-5 | Process | Static 8 steps | Animated journey line, durations, total time, product variants |
| BM-6 | FAQ | 5 questions | 5 categories, ≥ 17 questions, linkable answers, FAQPage schema |
| BM-7 | Reach | Sofia, Varna offices | Plovdiv + all Bulgaria + abroad (coverage block) |
| BM-8 | Compliance | Implied cookie consent | Opt-in consent; pixels and map only after consent |
| BM-9 | Speed & a11y | Heavy hero image | Lighthouse mobile ≥ 90 (Perf/A11y/SEO); WCAG 2.2 AA |
| BM-10 | SEO | — | Structured data (FinancialService, Person, FAQPage, BreadcrumbList), per-page metadata |

- **BM-11** At project kickoff, record creditmall.bg's Lighthouse mobile scores as the baseline;
  before launch, ours must be higher on every category.
- **BM-12** Never name or criticise CreditMall on the site; compete through quality.

## 2. Audience
Individuals and small businesses **anywhere in Bulgaria and Bulgarians abroad** who need a
mortgage, refinancing, business or consumer loan (including car purchases). Office in **Plovdiv**. Most visitors arrive
on **phones** from ads; some on tablets and desktops. Not targeted: real estate agencies.

## 3. Information architecture

### 3.1 Sitemap (URLs in Latin transliteration)
| URL | Page | Template |
|---|---|---|
| `/` | Home | T1 |
| `/krediti` | All loans overview | T4 |
| `/krediti/ipotechni` | Mortgage loans | T2 |
| `/krediti/refinansirane` | Refinancing | T2 |
| `/krediti/biznes` | Business loans | T2 |
| `/krediti/potrebitelski` | Consumer loans | T2 |
| `/kalkulatori` | All calculators overview | T4 |
| `/kalkulatori/mesechna-vnoska` | Monthly payment | T3 |
| `/kalkulatori/refinansirane` | Refinancing savings | T3 |
| `/kalkulatori/kolko-moga-da-iztegla` | How much can I borrow (by income) | T3 |
| `/kalkulatori/spored-vnoskata` | How much can I borrow (by desired payment) | T3 |
| `/kalkulatori/tekushta-lihva` | What rate am I paying now | T3 |
| `/kalkulatori/cena-na-kredita` | Total cost of the loan | T3 |
| `/kalkulatori/taksi-pri-pokupka` | Notary + municipal fees on purchase — after O-12 | T3 |
| `/kalkulatori/notarialni-taksi-ipoteka` | Notary fees for a mortgage — after O-12 | T3 |
| `/kalkulatori/cena-na-imota` | Total cost of the property — after O-12 | T3 |
| `/konsultacia` | Free consultation form (full variant) | T5 |
| `/blagodarim` | Thank-you page (ad conversion target, `noindex`) | T5 |
| `/kontakti` | Contacts + map | T4 |
| `/poveritelnost` | Privacy policy (GDPR) | T6 |
| `/biskvitki` | Cookie policy | T6 |
| `/obshti-usloviya` | Terms of use + legal information | T6 |
| `404` | Not found, with links to loans/calculators/contact | T4 |

**Home-first (D-5):** About me, process, why a consultant, reviews and FAQ are **sections of
Home**, not separate pages. Anchors: `/#za-men`, `/#proces`, `/#otzivi`, `/#kalkulatori`,
`/#vaprosi` (per category `/#vaprosi-refinansirane`), `/#konsultacia`.

**Later (not v1):** `/blog` (SEO articles), 3D home-page element; standalone `/za-men`,
`/otzivi`, `/vaprosi` pages if SEO data later shows a need.

### 3.2 Navigation (header)
- **NAV-1** Keep the v2 header: floating frosted-glass pill, **sticky while scrolling**.
- **NAV-2** Items, in order:
  | Item | Behaviour |
  |---|---|
  | Logo | → `/` |
  | **Кредити ▾** | **Mega-menu** (NAV-3) |
  | **Калкулатори ▾** | Dropdown (NAV-4) |
  | **За мен** | → `/#za-men` |
  | **Отзиви** | → `/#otzivi` |
  | **Въпроси** | → `/#vaprosi` |
  | **Контакти** | → `/kontakti` |
  | Phone button | `tel:` link |
  | **Безплатна консултация** | → `/konsultacia` (primary button) |
- **NAV-3 Loans mega-menu:** a wide frosted panel. One tile per loan type (icon, name,
  one-sentence professional description from CONTENT.md §1, link). A side area with
  "Не знаете кой кредит ви трябва?" + consultation button + link to `/krediti`.
  Animated open/close (fade + slight lift, ≤200 ms).
- **NAV-4 Calculators dropdown:** list of all calculators (name + one-line hint, icon), the three
  fee calculators shown only once released, link "Всички калкулатори" → `/kalkulatori`.
- **NAV-5** Dropdowns open on hover **and** click, close on Esc / outside click / route change,
  fully keyboard accessible (arrow keys, focus trap off, `aria-expanded`). The active page is
  highlighted in the nav.
- **NAV-8** Anchor items smooth-scroll on Home (offset for the sticky header; instant with
  reduced motion) and navigate to `/#…` from other pages. On Home a scroll-spy highlights the
  section in view.
- **NAV-6 Phones/tablets (< 1240 px):** burger → full-height slide-in panel; "Кредити" and
  "Калкулатори" become accordions; big call / Viber / WhatsApp / consultation buttons at the
  bottom of the panel.
- **NAV-7** Breadcrumbs on all inner pages (`Начало › Кредити › Ипотечни`).

### 3.3 Footer (every page)
- **FT-1** Aesthetic dark footer (ink background, gradient accent) containing:
  - **Logo** + one-line tagline
  - **Office:** address, **Plovdiv** [O-11], link "Виж на картата"
  - **Working hours** [O-10]
  - **Phone, email, Viber, WhatsApp** [O-5]
  - Link columns: Кредити · Калкулатори · Информация (За мен, Процесът, Отзиви, Въпроси →
    Home anchors; Безплатна консултация, Контакти → pages)
  - Legal links: Поверителност · Бисквитки · Общи условия · "Настройки на бисквитките"
  - **Intermediary disclosure line** (FT-2)
  - **© {year} ExtraConsult. Всички права запазени.**
- **FT-2** Disclosure (wording to be confirmed with CreditMall/lawyer, O-3):
  "ExtraConsult · ЕИК 207809106 · кредитен посредник, вписан в регистъра на БНБ под
  № BCI000104 чрез CreditMall."

## 4. Page templates and block library
Pages are **compositions of reusable blocks**. No page is designed from scratch; no page looks
empty — every page ends with a CTA and has at least 4 blocks.

### 4.1 Templates
| ID | Template | Structure |
|---|---|---|
| **T1** | Home | Custom composition (§4.3) |
| **T2** | Loan page | Page hero (title, intro, key facts, CTA) → What it is / who it's for → Requirements → Process with durations (B-07, product-specific) → Embedded calculator (B-12) → Bank logos (B-08) → Testimonials filtered by product (B-10) → FAQ for this product (B-13) → Related loans (B-15) → CTA band (B-14) |
| **T3** | Calculator page | Page hero → Calculator (full) → "How to read the result" explainer → Related calculators (B-16) → Relevant loan link → CTA band |
| **T4** | Content page (`/krediti`, `/kalkulatori`, `/kontakti`, 404) | Page hero → page-specific content → 2–4 supporting blocks → CTA band |
| **T5** | Form page | Split hero with promises + Consultation form (B-17, full variant) → Coverage (B-09) → mini FAQ |
| **T6** | Legal page | Simple readable text, table of contents, last-updated date |

### 4.2 Block library
| ID | Block | Notes |
|---|---|---|
| B-01 | Header + mega-menu + dropdowns | §3.2 |
| B-02 | Footer | §3.3 |
| B-03 | Page hero (inner pages) | Title, intro, breadcrumbs, optional key facts, soft gradient |
| B-04 | Home hero | §4.3 |
| B-05 | Promise strip | 3–4 short promises with icons (free · I handle everything · all banks · fast) |
| B-06 | Loan cards | Frosted cards linking to loan pages |
| B-07 | **Process timeline with durations** | §4.4 |
| B-08 | **Bank logos** | §4.5 |
| B-09 | **Coverage: Plovdiv → all Bulgaria → abroad** | §4.6 |
| B-10 | Testimonial carousel | Photos + feedback, §5.6 |
| B-11 | Why a consultant / why me | Split light/dark section from mockup v2 |
| B-12 | Calculator (embeddable) | §5.4 |
| B-13 | **FAQ by category** | §4.7 |
| B-14 | CTA band | "Безплатна консултация" + phone/Viber/WhatsApp |
| B-15 | Related loans | 2–3 cards |
| B-16 | Related calculators | 2–3 cards |
| B-17 | Consultation form | §5.2 — two variants: **compact** (Home) and **full** (`/konsultacia`) |
| B-18 | Contact card + map | §5.7 |
| B-19 | About me | Full section on Home: portraits, story, values, experience (O-6, O-7); compact teaser variant for other pages linking to `/#za-men` |
| B-20 | Key numbers | Years, clients, banks — **real numbers only** (O-7) |
| B-21 | Mobile action bar | Call · Viber/WhatsApp · Consultation (phones only) |
| B-22 | Cookie consent banner | §8 |
| B-23 | Calculator hub | Tabs switching between the 6 calculators (B-12), each with a link to its own page |
| B-24 | Contact strip | Address, hours, phone/Viber/WhatsApp, link to `/kontakti` (no live map) |

### 4.3 Home page (T1) — the flagship (D-5)
Home is the best page of the site and holds most of the content. Section order:
1. **Hero (B-04):** large headline, **Desislava's portrait** in a glass frame, her name and
   role, animated soft gradient, primary CTA "Безплатна консултация" (→ `/#konsultacia`) +
   secondary "Изчислете вноската" (→ `/#kalkulatori`), promise chips. Entrance animation.
2. **Promise strip (B-05).**
3. **Loan cards (B-06)** — 4 loans → loan pages.
4. **About me (B-19) `#za-men`** — portraits, short story, how I work, real numbers (B-20, O-7).
5. **Why a consultant / why me (B-11)** — split light/dark section.
6. **Process timeline with durations (B-07) `#proces`** — full version with "Вие / Аз" (PR-5).
7. **Bank logos (B-08).**
8. **Testimonial carousel (B-10) `#otzivi`.**
9. **Coverage (B-09).**
10. **Calculator hub (B-23) `#kalkulatori`** — all 6 calculators as tabs.
11. **FAQ by category (B-13) `#vaprosi`** — all categories.
12. **Consultation form (B-17 compact) `#konsultacia`** + direct contact buttons.
13. **Contact strip (B-24)** → `/kontakti`.

Not on Home: live map (only on `/kontakti`), legal text.

- **HP-1 Performance:** above the fold is static HTML + CSS; interactive blocks below the fold
  (calculator hub, carousel, FAQ, form) hydrate lazily when near the viewport. Home must still
  meet TR-9 (Lighthouse mobile ≥ 90).
- **HP-2 Rhythm:** alternate light/dark/gradient sections so a long page never feels like a
  wall; each section has a mono label and a clear heading.

### 4.4 Process timeline with durations (B-07) — new design
- **PR-1** A new, slick component (not a copy of mockup v2 or of other sites): a **journey line**
  that draws itself as the user scrolls; each step is a node with number, title, short
  professional description, **duration chip** (e.g. "3–5 работни дни"), and an icon.
- **PR-2** A **total-time summary** at the end: "Обикновено от първия разговор до усвояването:
  [X–Y седмици]" [O-9].
- **PR-3** Steps and draft durations in CONTENT.md §2 (durations are **drafts to be confirmed**,
  O-9). Product pages may show a product-specific variant (e.g. refinancing has no purchase deed).
- **PR-4** Desktop: horizontal or curved path with alternating cards; phone: vertical line with
  cards on one side. Active step highlights while scrolling. Static fallback with reduced motion.
- **PR-5** Optional "Вие / Аз" detail per step (who does what) in the full version on Home (`#proces`).

### 4.5 Bank logos (B-08)
- **BL-1** Grid of partner-bank logos, **greyscale, colour on hover/focus**, equal optical size,
  subtle borders like a ledger; on phones a 2-column grid or slow auto-scrolling marquee
  (paused with reduced motion / on hover).
- **BL-2** v1 banks (from owner, 2026-10-14): **Allianz Bank Bulgaria, BACB (БАКБ),
  D Commerce Bank, DSK Bank, UBB (ОББ), Fibank, Texim Bank, UniCredit Bulbank, Central
  Cooperative Bank (ЦКБ), Postbank.**
- **BL-3** Logos as SVG files supplied by the owner/CreditMall, with permission to use [O-4].
  Each logo has alt text with the bank's name. List lives in site config.

### 4.6 Coverage component (B-09)
- **CV-1** Message: "Офисът ми е в Пловдив, но работя с клиенти от цяла България — и с
  българи в чужбина." (copy in CONTENT.md §3).
- **CV-2** Visual: stylised outline of Bulgaria with a glowing **Plovdiv** pin and soft lines
  reaching across the country, plus an "abroad" element (globe/arrow beyond the border). Lines
  animate in on scroll; static with reduced motion.
- **CV-3** Three short points: how remote work happens (phone/Viber/WhatsApp/video, documents
  electronically, signing coordinated with you), meeting in Plovdiv office, clients abroad.
- Used on: Home, `/konsultacia`, `/kontakti`.

### 4.7 FAQ by category (B-13)
- **FAQ-1** Compact layout: **category pills/tabs** at the top; selecting a category shows only
  its questions as an accordion; **one question open at a time**. Takes far less space.
- **FAQ-2** Categories and questions in CONTENT.md §4 (5 categories, ≥ 15 questions), including
  the **registration question** (BNB register BCI000104 via CreditMall, ЕИК 207809106).
- **FAQ-3** URL hash per category/question (`/#vaprosi-refinansirane`) so ads and pages can link
  to an answer. Loan pages embed only their category.
- **FAQ-4** `FAQPage` structured data on Home (all questions) and on loan pages (their category).

## 5. Functional requirements

### 5.1 Process (see §4.4)

### 5.2 Free consultation form (B-17, page `/konsultacia`, embedded in CTA areas)
- **FR-1** Keep the v2 form design. Fields: product* (mortgage / refinancing / business /
  consumer / other), name*, phone*, city*, approximate amount (€), preferred contact method*
  (**phone / Viber / WhatsApp** / office meeting / video call), preferred time, email (optional),
  notes (optional), privacy consent*. (* = required)
- **FR-2** Never ask for ЕГН, ID card data, income documents or similar.
- **FR-3** Client and server validation (Bulgarian phones `08X…`, `+359…`; international numbers
  allowed for clients abroad).
- **FR-4** Spam protection: honeypot + Cloudflare Turnstile (invisible).
- **FR-5** Capture source: page URL, `utm_*`, `gclid`, `fbclid`, referrer (hidden fields).
- **FR-6** Success → `/blagodarim`. Failure → clear message + phone/Viber/WhatsApp fallback.
  Never lose a request silently.
- **FR-7** Product pre-selected when the form is opened from a loan page.
- **FR-7a Two variants, one schema and one handler.** **Compact** (Home `#konsultacia`, loan
  pages): product, name, phone, preferred contact method, consent — plus a "Още подробности"
  expander revealing the other FR-1 fields. In the compact variant, required fields are limited
  to those shown by default. **Full** (`/konsultacia`): all FR-1 fields visible.

### 5.3 Request delivery
- **FR-8** HTML email to the owner within seconds. Subject:
  `Нова заявка: {продукт} — {сума} € — {име}, {град}`. Body: summary table, click-to-call,
  Viber and WhatsApp links, preferred method/time, notes, source/campaign, timestamp
  (Europe/Sofia). Plain-text fallback.
- **FR-9** Append the same request to a Google Sheet (timestamp, name, phone, email, product,
  amount, city, method, time, notes, source, campaign, status).
- **FR-10** If email **or** Sheet fails, the other still succeeds; error logged without personal data.
- **FR-11** Auto-reply email if the visitor gave an email; `/blagodarim` shows the same message.

### 5.4 Calculators (B-12, pages T3)
All amounts in EUR, live results, disclaimer ("ориентировъчно, не е оферта"), CTA to the form.
| ID | Calculator | Inputs → Outputs | v1? |
|---|---|---|---|
| FR-12 | Месечна вноска | amount, term, rate → payment, total interest, total paid | ✅ |
| FR-13 | Спестяване при рефинансиране | balance, remaining term, current rate, new rate, switching costs → monthly + net saving | ✅ |
| FR-14 | Колко мога да изтегля (по доход) | net income, other payments, term, rate → max payment, max loan (BNB debt-service limit as guide, verified) | ✅ |
| FR-15 | Колко мога да изтегля според вноската | desired payment, term, rate → max loan | ✅ |
| FR-16 | Каква лихва плащам в момента | balance, payment, remaining term → effective annual rate | ✅ |
| FR-17 | Колко ще ми струва кредитът | amount, term, rate, fees, insurance → total cost, approx. APR | ✅ |
| FR-18 | Такси при покупка на имот | price, municipality → notary, local tax, registry | after O-12 |
| FR-19 | Нотариални такси при ипотека | loan amount → notary + registry | after O-12 |
| FR-20 | Колко ще ми струва имотът | price, down payment, municipality → total cash needed | after O-12 |
- **FR-21** Math in pure, unit-tested functions; defaults/limits/tariffs in config with source + date.
- **FR-22** Calculator UI from mockup v2 (tabs on overview; one calculator per page in T3).

### 5.5 Contact shortcuts
- **FR-23** Phone (`tel:`), **Viber**, **WhatsApp** (`wa.me`) buttons in header (phone), mobile
  action bar, CTA bands, contact page and footer.

### 5.6 Testimonial carousel (B-10)
- **FR-24** ~8 slides: the consultant alone and **with clients**, each with that client's feedback
  (quote, first name/initial, product, year, city). Real content only, with written consent [O-1].
- **FR-25** Slow auto-advance; pauses on hover/focus/touch; arrows, dots, swipe, keyboard; no
  auto-advance with reduced motion. Filterable by product on loan pages.

### 5.7 Contact page and map (B-18)
- **FR-26** Office address (Plovdiv) [O-11], working hours, phone, email, Viber, WhatsApp.
- **FR-27** Google Map: static preview + "Покажи картата" loads the live map on click/consent,
  plus "Отвори в Google Maps" link.

### 5.8 Tracking
- **FR-28** Meta Pixel and Google Ads conversion tracking **only after cookie consent**;
  conversion = `/blagodarim` view.
- **FR-29** Privacy-friendly analytics (Cloudflare Web Analytics).

## 6. Content requirements
- **CR-1** All content in **Bulgarian**; currency **EUR**.
- **CR-2** **First person** as the consultant, addressing the visitor as "вие". **Professional,
  warm, precise** — no slang, no exaggeration, banking terms explained.
- **CR-3** Core messages (BUSINESS_CONTEXT §7).
- **CR-4** Loan pages: what it is, who it's for, requirements, process, calculator, FAQ, CTA.
  Draft descriptions in CONTENT.md §1.
- **CR-5** Testimonials, client photos, numbers, logos must be real and approved. Never invented.
- **CR-6** Registration facts (BNB register number, ЕИК, CreditMall relationship) appear in the
  footer, FAQ and Terms page with **identical, approved wording** (O-3).

## 7. Design requirements
- **DR-1 Style:** mockup v2 — Habito-inspired but mature: very large heavy tight headlines, soft
  blurred gradients, frosted-glass cards, pill buttons with round arrow buttons, small mono
  labels, light/dark split sections. No pastels, no cartoon illustrations; real photography.
- **DR-2 Palette:** ink `#0E1615`, petrol `#0F3B3E`, sea `#2E6B66`, sand `#E9E2D4`, paper
  `#F5F3EE`, gold `#C59A3D`.
- **DR-3 Type:** Inter Tight (800, headlines), Onest (body), IBM Plex Mono (labels). Cyrillic.
- **DR-4 Motion:** slick, purposeful motion throughout — scroll-reveal of sections, the process
  line drawing itself, coverage lines, number count-ups, mega-menu transitions, hover lifts,
  gradient drift. Durations 150–600 ms, eased; never blocks reading; everything respects
  `prefers-reduced-motion`. Motion is built into blocks, not added per page.
- **DR-5 Responsive:** phones, tablets, desktops — tested at 360, 768, 1024, 1280, 1440 px.
  Touch targets ≥ 44 px.
- **DR-6 Accessibility:** WCAG 2.2 AA (contrast incl. text on glass/gradients, focus, labels,
  keyboard, reduced motion).
- **DR-7 Logo** — §7.1.
- **DR-8 No 3D in v1** (moved to "later").

### 7.1 Logo brief (O-13)
- Name: **ExtraConsult**. Personality: trustworthy, personal, modern, calm confidence — premium
  but approachable; not a bank, not a startup toy.
- Deliverables: full logo (mark + wordmark), mark alone, light and dark versions, monochrome,
  favicon (SVG + 32/180/512 px), social/OG image. All as SVG.
- Directions to explore (3 concepts, owner chooses):
  1. **Key-E:** an "E" whose middle bar forms the bit of a key — "you get the keys".
  2. **Roof-E / path:** an "E" or "EC" monogram under a single roof line / rising path — home
     and progress.
  3. **Seal monogram:** "EC" ligature in a rounded square or circle, gold on petrol — a seal of
     trust.
- Wordmark: based on Inter Tight 800 with custom tightened spacing; gold accent on one element.
- Must read at 16 px (favicon) and in one colour. Before final adoption: quick trademark search
  (BPO and EUIPO).

## 8. Legal pages — are they needed? Yes.
| Page | Needed? | Why |
|---|---|---|
| **Privacy policy** (`/poveritelnost`) | **Mandatory** | We collect personal data (name, phone, email) → GDPR Art. 13 information duty |
| **Cookie policy + consent banner** (`/biskvitki`) | **Mandatory** once we use Meta Pixel, Google Ads or the live Google Map | ePrivacy rules: non-essential cookies need prior opt-in |
| **Terms of use + legal information** (`/obshti-usloviya`) | **Strongly recommended** | Bulgarian e-commerce law requires provider identification on the website (name, address, ЕИК, contacts, registration, supervisor); as a credit intermediary the site must also state the registration and that the service is free for the client. Putting it on one page keeps it tidy. |
- **LC-1** Privacy policy: controller, purpose, legal basis, recipients (email provider, Google
  Sheets, Cloudflare, Google Maps, Meta/Google ads), retention [O-8], rights, КЗЛД complaint.
- **LC-2** Cookie banner: opt-in, "Приеми всички" / "Откажи" equally prominent, settings link
  in the footer.
- **LC-3** Intermediary disclosures: legal entity, ЕИК 207809106, address, BNB register
  BCI000104 via CreditMall, independence/remuneration statement (paid by banks).
- **LC-4** Rates in ads/site → legally required representative example (ГПР).
- **LC-5** Written consent for client photos and testimonials.
- **LC-6** Bank logos only with permission.
- **LC-7** Meta/Google financial-services ad policies.
- **LC-8** Ask CreditMall for their existing legal texts as a base; final review by a lawyer [O-14].

## 9. Technical requirements
- **TR-1** Next.js (App Router) + TypeScript + Tailwind CSS; pages statically generated.
- **TR-2** No database. Only server code: the consultation form handler.
- **TR-3** Hosting on **Cloudflare** (Workers) via the OpenNext adapter. DNS on Cloudflare.
- **TR-4** Email via Resend (or Brevo) from the site's domain (SPF/DKIM/DMARC).
- **TR-5** Google Sheet via Apps Script endpoint (secret token) or service account.
- **TR-6** Animation: CSS + a small, well-adopted motion library (e.g. Motion) for complex
  sequences; no 3D libraries in v1. Animations must not hurt Lighthouse scores.
- **TR-7** Images: AVIF/WebP, responsive sizes, lazy loading; photos ≤ 200 KB.
- **TR-8** SEO: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`, structured data
  (`FinancialService` with Plovdiv address and `areaServed: Bulgaria`, `Person`, `FAQPage`,
  `BreadcrumbList`), `lang="bg"`.
- **TR-9** Performance: Lighthouse mobile ≥ 90 (Performance, Accessibility, SEO) on every template.
- **TR-10** Security: no secrets in repo; Zod validation; rate limiting; no personal data in
  logs; security headers.
- **TR-11** One config (`src/config/site.ts`) for contacts, address, hours, registration data,
  banks, navigation, calculator defaults.

## 10. Development tooling (Claude Code)
- **DT-1** Anthropic **`frontend-design`** skill for all visual work.
- **DT-2** From **`vercel-labs/agent-skills`**: `react-best-practices`, `web-design-guidelines`,
  `composition-patterns` (skip Vercel deploy skills).
- **DT-3** Read each skill's files before installing. **DT-4** Install into `.claude/skills/`.

## 11. Out of scope (v1)
3D elements, blog, client accounts, document upload, CRM, database, online bank applications,
live rate feeds, insurance, English version, chatbot, newsletter.

## 12. Decisions
- **D-1 Hosting: Cloudflare** — decided 2026-10-13.
- **D-2 Domain** — recommended 2026-10-15: primary **`extraconsult.bg`** (firm name: one
  spelling, matches the legal entity and email; "Арабаджиева" has several Latin spellings).
  Her name leads the logo lockup ("ExtraConsult · Десислава Арабаджиева") and the hero.
  Optionally register a name domain and 301-redirect it. Availability still to check.
- **D-3 Multi-page site with reusable templates/blocks** — decided 2026-10-14.
- **D-4 No 3D in v1** — decided 2026-10-14.
- **D-5 Home-first structure** — decided 2026-10-15: about, process, reviews, FAQ, calculator
  hub and form live on Home; separate pages only for loans, calculators, contact,
  consultation, thank-you, legal, 404.
- **D-6 Benchmark** — decided 2026-10-15: beat creditmall.bg on every row of §1.1; keep the
  v2 visual style.

## 13. Open items — owner must provide
| ID | Item | Status |
|---|---|---|
| **O-1** | **~8 photos (you + you with clients) and each client's feedback, with written consent — REQUIRED** | Open |
| **O-2** | **Reference websites — REQUIRED** | Partly done: habito.com (style), creditmall.bg & creditcenter.bg (structure). More welcome. |
| O-3 | Legal entity name, registered address; **confirm exact wording** of the CreditMall/BNB relationship; verify ЕИК 207809106 and BNB № BCI000104 in the official registers | Numbers received 2026-10-14 (not yet verified publicly) |
| O-4 | **SVG logo files** of the 10 banks + permission to use them | 10 files received 2026-10-15. Still needed: proper **ОББ** logo (file is the KBC mark only), vector **Тексим** logo (file is a PNG inside SVG), **ЦКБ** in brand colours (only white supplied; recoloured to ink for now). Permission still open. |
| O-5 | Phone, Viber, WhatsApp, request-receiving email | Open |
| O-6 | Professional portrait photos | 3 photos received (teal suit ×2, phone call). Hero choice and more shots (with clients, office) open |
| O-7 | Years of experience, clients helped, personal story | Name received 2026-10-15 (Desislava Arabadzhieva); rest open |
| O-8 | Request data retention period (suggestion: 12 months if no contract) | Open |
| O-9 | **Confirm step durations** (drafts in CONTENT.md §2) and the total time | Draft ready |
| O-10 | Working hours | Open |
| O-11 | **Plovdiv office address** | City known |
| O-12 | Verified notary tariff, registry fees, municipal tax rates | Open |
| O-13 | Choose a logo concept (§7.1) | Open |
| O-14 | Legal texts: CreditMall templates and/or lawyer review | Open |

## 14. Milestones
1. **Setup** — git, Next.js scaffold, Cloudflare adapter, skills, CLAUDE.md commands.
2. **Design system** — tokens, type, glass, buttons, motion primitives; **logo concepts** (O-13).
3. **Layout shell** — header with mega-menu/dropdowns, mobile menu, footer, breadcrumbs, mobile bar.
4. **Block library** — B-03 … B-24 with placeholder content.
5. **Templates + pages** — Home (flagship) first, then loan pages, calculator pages, contact,
   form page, legal pages.
6. **Calculators** FR-12 … FR-17 (FR-18 … FR-20 after O-12).
7. **Consultation pipeline** — form → email + Sheet + auto-reply, tested end-to-end.
8. **Compliance & tracking** — legal pages, consent banner, pixels, structured data.
9. **Motion & polish pass** — tune animations on real pages, all breakpoints.
10. **Content fill** — O-1 … O-14.
11. **Launch** — domain, Cloudflare, Lighthouse/accessibility, test requests, go live.

## 15. Acceptance criteria (v1 done when)
- [ ] All sitemap pages live in Bulgarian, first person, no placeholders left.
- [ ] Mega-menu and dropdowns work with mouse, touch and keyboard; mobile menu works.
- [ ] Every page has the footer with complete company, contact and registration info.
- [ ] Looks and works correctly at 360, 768, 1024, 1280, 1440 px.
- [ ] Test request arrives by email and in the Sheet in < 30 s with campaign data.
- [ ] Calculators match a reference spreadsheet to the cent.
- [ ] Map and pixels load only after click/consent.
- [ ] Lighthouse mobile ≥ 90 on every template.
- [ ] FAQ: 5 categories, ≥ 15 verified answers, registration question included.
- [ ] Legal pages reviewed; consents on file for client photos/quotes; logo chosen.
- [ ] Benchmark (§1.1): every BM row met; Lighthouse mobile higher than creditmall.bg's
      recorded baseline in every category.
- [ ] Home anchors (`#za-men`, `#proces`, `#otzivi`, `#kalkulatori`, `#vaprosi`,
      `#konsultacia`) work from the nav on every page.
