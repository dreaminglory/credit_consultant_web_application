import { pending, type MaybePending } from "./pending";

/**
 * Single source of truth for contacts, registration data, banks, navigation and loans (TR-11).
 * Footer, FAQ and legal pages must read registration wording from here (CR-6).
 * Never hard-code any of these values in components.
 */

export type LoanSlug = "ipotechni" | "refinansirane" | "biznes" | "potrebitelski";

export type Loan = {
  slug: LoanSlug;
  name: string;
  /** One-sentence description for the mega-menu and loan cards (CONTENT.md §1). */
  summary: string;
};

export type CalculatorSlug =
  | "mesechna-vnoska"
  | "refinansirane"
  | "kolko-moga-da-iztegla"
  | "spored-vnoskata"
  | "tekushta-lihva"
  | "cena-na-kredita"
  | "taksi-pri-pokupka"
  | "notarialni-taksi-ipoteka"
  | "cena-na-imota";

export type Calculator = {
  slug: CalculatorSlug;
  name: string;
  /** One-line hint for the dropdown (NAV-4). */
  hint: string;
  /** Fee calculators stay hidden from menus until verified tariffs exist (O-12). */
  available: boolean;
};

export type FooterLink = { label: string; href: string };

export type Bank = {
  id: string;
  name: string;
  /** Path under /public. */
  logo: string;
  /** Logo quality notes for the owner (O-4); empty when the file is final. */
  note?: string;
  /** Stacked (icon above wordmark) logos are drawn taller so they match the wide ones. */
  tall?: boolean;
};

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string; menu: "loans" | "calculators"; href: string };

export const site = {
  /** Canonical origin. Domain decided later (D-2); localhost until then. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  person: {
    name: "Десислава Арабаджиева",
    nameLatin: "Desislava Arabadzhieva",
    firstName: "Десислава",
    role: "Кредитен консултант",
    city: "Пловдив",
  },

  brand: {
    name: "ExtraConsult",
    tagline: "Десислава Арабаджиева · кредитен консултант",
    description:
      "Безплатна консултация за ипотечни, потребителски и бизнес кредити и рефинансиране. Сравнявам офертите на банките и водя целия процес вместо вас — в Пловдив, в цяла България и за българи в чужбина.",
  },

  legal: {
    company: "ExtraConsult",
    /** Verify in the Commercial Register before launch (O-3). */
    eik: "207809106",
    intermediary: "CreditMall",
    bnbRegisterNo: "BCI000104",
    /** Exact wording must be approved by CreditMall / lawyer (O-3, FT-2). */
    disclosure: pending(
      "O-3",
      "Approve the exact intermediary disclosure wording",
      "ExtraConsult · ЕИК 207809106 · кредитен посредник, вписан в регистъра на БНБ под № BCI000104 чрез CreditMall.",
    ) as MaybePending,
    registeredAddress: pending("O-3", "Registered address of the legal entity") as MaybePending,
  },

  contact: {
    phone: "0898 354 495" as MaybePending,
    /** E.164 without spaces, used for tel:, Viber and WhatsApp links. */
    phoneE164: "+359898354495" as MaybePending,
    email: "desi.arabadzhieva@gmail.com" as MaybePending,
    viber: true,
    whatsapp: true,
  },

  office: {
    city: "Пловдив",
    address: "бул. „Христо Ботев“ 92, Център, 4000" as MaybePending,
    /** Confirmed by the owner 2026-10-17 (O-10). */
    hours: "Пон – Пет, 09:00 – 19:00 ч." as MaybePending,
  },

  loans: [
    {
      slug: "ipotechni",
      name: "Ипотечни кредити",
      summary:
        "Финансиране за покупка, строителство или ремонт на жилище — с подбор на най-подходящата банка за вашия профил.",
    },
    {
      slug: "refinansirane",
      name: "Рефинансиране",
      summary:
        "Прехвърляне на съществуващ кредит при по-изгодни условия — след прецизна сметка дали промяната наистина ви носи спестяване.",
    },
    {
      slug: "biznes",
      name: "Бизнес кредити",
      summary:
        "Оборотни и инвестиционни кредити за фирми и самоосигуряващи се лица, съобразени с паричния поток на бизнеса.",
    },
    {
      slug: "potrebitelski",
      name: "Потребителски кредити",
      summary:
        "Средства за лични цели, включително покупка на автомобил — самостоятелно или като допълнение към ипотечен кредит.",
    },
  ] satisfies Loan[],

  /** Partner banks, v1 list from the owner (BL-2, 2026-10-14). Permission to use logos: O-4. */
  banks: [
    { id: "allianz", name: "Алианц Банк България", logo: "/banks/allianz.svg" },
    { id: "investbank", name: "Инвестбанк", logo: "/banks/investbank.svg", tall: true },
    { id: "bbr", name: "Българска банка за развитие", logo: "/banks/bbr.svg" },
    { id: "dsk", name: "Банка ДСК", logo: "/banks/dsk.svg", tall: true },
    {
      id: "ubb",
      name: "ОББ",
      logo: "/banks/ubb.svg",
      tall: true,
      note: "Supplied file is the KBC group mark only, not the ОББ logo",
    },
    { id: "fibank", name: "Fibank", logo: "/banks/fibank.svg" },
    {
      id: "procredit",
      name: "Прокредит Банк",
      logo: "/banks/procredit.svg",
      note: "Taken from the bank's own website; confirm permission",
    },
    { id: "unicredit", name: "УниКредит Булбанк", logo: "/banks/unicredit.svg" },
    {
      id: "ccb",
      name: "Централна кооперативна банка",
      logo: "/banks/ccb.svg",
      note: "Only a white file was supplied; recoloured to ink — brand-colour file needed",
    },
    { id: "postbank", name: "Пощенска банка", logo: "/banks/postbank.svg" },
  ] satisfies Bank[],

  /** Calculators in menu order (FR-12…20). Draft hints — owner to review wording. */
  calculators: [
    {
      slug: "mesechna-vnoska",
      name: "Месечна вноска",
      hint: "Каква ще е вноската при вашата сума и срок",
      available: true,
    },
    {
      slug: "refinansirane",
      name: "Спестяване при рефинансиране",
      hint: "Колко печелите, ако смените кредита си",
      available: true,
    },
    {
      slug: "kolko-moga-da-iztegla",
      name: "Колко мога да изтегля",
      hint: "Максимален кредит според дохода ви",
      available: true,
    },
    {
      slug: "spored-vnoskata",
      name: "Кредит според вноската",
      hint: "Какъв кредит носи вноската, която искате да плащате",
      available: true,
    },
    {
      slug: "tekushta-lihva",
      name: "Каква лихва плащам",
      hint: "Реалната лихва по вашия текущ кредит",
      available: true,
    },
    {
      slug: "cena-na-kredita",
      name: "Цена на кредита",
      hint: "Общата сума, която ще върнете, и ГПР",
      available: true,
    },
    {
      slug: "taksi-pri-pokupka",
      name: "Такси при покупка на имот",
      hint: "Нотариални такси и местен данък",
      available: false,
    },
    {
      slug: "notarialni-taksi-ipoteka",
      name: "Нотариални такси при ипотека",
      hint: "Нотариус и вписване при кредит",
      available: false,
    },
    {
      slug: "cena-na-imota",
      name: "Колко ще ми струва имотът",
      hint: "Парите, от които се нуждаете в началото",
      available: false,
    },
  ] satisfies Calculator[],

  /**
   * BNB borrower-based limits for loans to households secured on Bulgarian residential property
   * (FR-14, FR-21). Never write these numbers in components; re-check before launch.
   */
  limits: {
    bnb: {
      /** DSTI-O: all debt payments ≤ this share of net monthly income. */
      dstiMax: 0.5,
      /** LTV-O: loan ≤ this share of the collateral value. */
      ltvMax: 0.85,
      /** Maximum contract term in years. */
      maxTermYears: 30,
      effective: "2024-10-01",
      source:
        "БНБ, прессъобщение от 11.09.2024 г. за изискванията към кредитите, обезпечени с жилищни имоти (bnb.bg)",
      checked: "2026-10-16",
    },
  },

  /**
   * Example starting values of the calculators (FR-12…17). Rates are neutral examples shown as
   * „примерна“, not offers; fees default to 0 so nothing is invented. Owner confirms: O-15.
   */
  calculatorDefaultsStatus: pending(
    "O-15",
    "Confirm the calculators' example starting values (amounts, terms, example rates)",
  ),
  calculatorDefaults: {
    "mesechna-vnoska": { amount: 120000, years: 30, ratePct: 2.9 },
    refinansirane: {
      balance: 90000,
      years: 22,
      currentRatePct: 4.2,
      newRatePct: 2.9,
      switchingCosts: 600,
    },
    "kolko-moga-da-iztegla": { netIncome: 2600, otherPayments: 200, years: 30, ratePct: 2.9 },
    "spored-vnoskata": { payment: 700, years: 30, ratePct: 2.9 },
    "tekushta-lihva": { balance: 90000, payment: 523, years: 22 },
    "cena-na-kredita": {
      amount: 120000,
      years: 30,
      ratePct: 2.9,
      upfrontFeePct: 0,
      monthlyFee: 0,
      annualInsurance: 0,
    },
  },

  /** Consultation form options (FR-1). Values are stable ids sent to the API and the Sheet. */
  lead: {
    /** Loan products plus „Друго“; loan pages pre-select their own slug (FR-7). */
    products: [
      { value: "ipotechni", label: "Ипотечен" },
      { value: "refinansirane", label: "Рефинансиране" },
      { value: "biznes", label: "Бизнес" },
      { value: "potrebitelski", label: "Потребителски" },
      { value: "drugo", label: "Друго" },
    ],
    methods: [
      { value: "telefon", label: "Телефон" },
      { value: "viber", label: "Viber" },
      { value: "whatsapp", label: "WhatsApp" },
      { value: "ofis", label: "Среща в офиса" },
      { value: "video", label: "Видео разговор" },
    ],
    /** Follow the working hours (office.hours, confirmed 2026-10-17): change both together. */
    timeSlots: [
      { value: "vsyako", label: "Всяко време" },
      { value: "9-12", label: "9–12 ч." },
      { value: "12-14", label: "12–14 ч." },
      { value: "14-19", label: "14–19 ч." },
    ],
    maxAmount: 10_000_000,
    privacyHref: "/poveritelnost",
    thanksHref: "/blagodarim",
  },

  /** Primary call to action, used by header, mobile bar, footer (NAV-2). */
  consultation: {
    label: "Безплатна консултация",
    href: "/konsultacia",
  },

  /** Mega-menu side panel (NAV-3, CONTENT.md §1). */
  loansMenuAside: {
    title: "Не знаете кой кредит ви трябва?",
    text: "Разкажете ми целта си и ще ви предложа най-подходящото решение.",
  },

  /** Footer link columns (FT-1). Home anchors work from every page (NAV-8). */
  footerInfo: [
    { label: "За мен", href: "/#za-men" },
    { label: "Процесът", href: "/#proces" },
    { label: "Отзиви", href: "/#otzivi" },
    { label: "Въпроси", href: "/#vaprosi" },
    { label: "Безплатна консултация", href: "/konsultacia" },
    { label: "Контакти", href: "/kontakti" },
  ] satisfies FooterLink[],

  legalLinks: [
    { label: "Поверителност", href: "/poveritelnost" },
    { label: "Бисквитки", href: "/biskvitki" },
    { label: "Общи условия", href: "/obshti-usloviya" },
    // Becomes a banner trigger in M8; the policy page until then.
    { label: "Настройки на бисквитките", href: "/biskvitki" },
  ] satisfies FooterLink[],

  /** Home sections the header scroll-spy follows (NAV-8). */
  spySections: ["za-men", "otzivi", "vaprosi"],

  /** Header navigation, in order (NAV-2). */
  nav: [
    { kind: "menu", label: "Кредити", menu: "loans", href: "/krediti" },
    { kind: "menu", label: "Калкулатори", menu: "calculators", href: "/kalkulatori" },
    { kind: "link", label: "За мен", href: "/#za-men" },
    { kind: "link", label: "Отзиви", href: "/#otzivi" },
    { kind: "link", label: "Въпроси", href: "/#vaprosi" },
    { kind: "link", label: "Контакти", href: "/kontakti" },
  ] satisfies NavItem[],
} as const;

export type Site = typeof site;
