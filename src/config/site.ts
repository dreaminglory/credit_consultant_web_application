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
    { id: "bacb", name: "БАКБ", logo: "/banks/bacb.svg" },
    { id: "dcommerce", name: "Д Комерс Банк", logo: "/banks/dcommerce.svg" },
    { id: "dsk", name: "Банка ДСК", logo: "/banks/dsk.svg" },
    {
      id: "ubb",
      name: "ОББ",
      logo: "/banks/ubb.svg",
      note: "Supplied file is the KBC group mark only, not the ОББ logo",
    },
    { id: "fibank", name: "Fibank", logo: "/banks/fibank.svg" },
    {
      id: "texim",
      name: "Тексим Банк",
      logo: "/banks/texim.svg",
      note: "Supplied file is a low-resolution PNG wrapped in SVG",
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
