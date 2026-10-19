import type { ConsentCategory } from "@/lib/consent";
import { ATTRIBUTION_KEY } from "@/lib/lead/attribution";
import { CONSENT_COOKIE } from "@/lib/consent";

/**
 * Every cookie and browser storage entry the site can set (LC-2). The cookie policy table and the
 * banner categories are both built from this list, so they can never disagree. When a script is
 * added, add its entries here first.
 */

export type CookieCategory = "necessary" | ConsentCategory;

export type CookieEntry = {
  name: string;
  provider: string;
  category: CookieCategory;
  /** Bulgarian, plain words. */
  purpose: string;
  duration: string;
  /** "cookie" or browser storage that never leaves the device unless stated. */
  kind: "cookie" | "storage";
};

export const cookieCategories: Record<
  CookieCategory,
  { title: string; text: string; locked?: boolean }
> = {
  necessary: {
    title: "Необходими",
    text: "Запомнят избора ви за бисквитките и защитават формата от спам. Без тях сайтът не работи правилно, затова винаги са включени.",
    locked: true,
  },
  marketing: {
    title: "Маркетинг",
    text: "Meta Pixel и Google Ads — показват ми кои реклами водят до запитване, за да не харча бюджет за ненужни реклами.",
  },
  media: {
    title: "Външно съдържание",
    text: "Картата на Google на страницата „Контакти“ се зарежда сама. Без съгласие я отваряте с бутон.",
  },
};

export const cookies: readonly CookieEntry[] = [
  {
    name: CONSENT_COOKIE,
    provider: "Този сайт",
    category: "necessary",
    purpose: "Запомня какво сте избрали в банера за бисквитките.",
    duration: "6 месеца",
    kind: "cookie",
  },
  {
    name: ATTRIBUTION_KEY,
    provider: "Този сайт",
    category: "necessary",
    purpose:
      "Запомня през коя страница или реклама сте влезли. Изпраща се само заедно със запитването, ако го изпратите.",
    duration: "До затваряне на браузъра",
    kind: "storage",
  },
  {
    name: "Cloudflare Turnstile",
    provider: "Cloudflare",
    category: "necessary",
    purpose: "Проверява, че формата се изпраща от човек, а не от бот. Не служи за реклама.",
    duration: "Сесия",
    kind: "cookie",
  },
  {
    name: "_fbp, _fbc",
    provider: "Meta Platforms Ireland",
    category: "marketing",
    purpose:
      "Meta Pixel — отчита посещения и изпратени запитвания от реклами във Facebook и Instagram.",
    duration: "90 дни",
    kind: "cookie",
  },
  {
    name: "_gcl_au, _gcl_aw",
    provider: "Google Ireland",
    category: "marketing",
    purpose: "Google Ads — отчита дали посещението от реклама в Google е завършило със запитване.",
    duration: "90 дни",
    kind: "cookie",
  },
  {
    name: "NID и други на google.com",
    provider: "Google Ireland",
    category: "media",
    purpose: "Вградената карта на Google Maps. Google ги поставя само когато картата се зареди.",
    duration: "До 6 месеца",
    kind: "cookie",
  },
];
