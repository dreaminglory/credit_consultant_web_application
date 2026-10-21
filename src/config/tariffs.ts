/**
 * Public fees on a property purchase and a mortgage (FR-18…21). Every value is copied from the
 * named source and was checked on the given date; nothing here is estimated. Amounts that the
 * source states in лв. stay in лв. and are converted with `eurRate` (Закон за въвеждане на
 * еврото: fixed rate, rounded to the cent) by `src/lib/calc/fees.ts`.
 *
 * Researched 2026-10-21 and confirmed by the owner the same day (O-12).
 */

export type NotaryBracket = {
  /** Lower bound of the material interest in лв.; the fee applies above it. */
  overBgn: number;
  /** Fixed part in лв. */
  baseBgn: number;
  /** Percentage on the part above `overBgn`. */
  pct: number;
};

export type Municipality = {
  id: string;
  name: string;
  /** Данък при придобиване на имущество по възмезден начин, % of the base. */
  ratePct: number;
  /** Ordinance and article the rate is taken from. */
  source: string;
  url: string;
  checked: string;
};

export const tariffs = {
  /** BGN per EUR, the fixed conversion rate (Закон за въвеждане на еврото в Република България). */
  eurRate: 1.95583,

  /** Тарифа за нотариалните такси към ЗННД, т. 8 (раздел II). */
  notary: {
    brackets: [
      { overBgn: 0, baseBgn: 30, pct: 0 },
      { overBgn: 100, baseBgn: 30, pct: 1.5 },
      { overBgn: 1_000, baseBgn: 43.5, pct: 1.3 },
      { overBgn: 10_000, baseBgn: 160.5, pct: 0.8 },
      { overBgn: 50_000, baseBgn: 480.5, pct: 0.5 },
      { overBgn: 100_000, baseBgn: 730.5, pct: 0.2 },
      { overBgn: 500_000, baseBgn: 1530.5, pct: 0.1 },
    ] satisfies NotaryBracket[],
    maxBgn: 6000,
    /**
     * ДДС on the notary fee (ЗДДС чл. 66, ал. 1). Charged when the notary is VAT-registered,
     * which is the usual case; the calculators always include it so the total is not too low.
     */
    vatRate: 0.2,
    source:
      "Тарифа за нотариалните такси към Закона за нотариусите и нотариалната дейност, т. 8 (ПМС № 186/1998, посл. изм. ДВ, бр. 39/2009); база — ЗННД чл. 96, ал. 3 и чл. 97, ал. 1, т. 7 и ал. 3",
    url: "https://www.notariusi.info/тарифа-за-нотариалните-такси-към-закона-за-нотариусите-и-нотариалната-дейност",
    lawUrl: "https://legislation.apis.bg/doc/10397/0",
    checked: "2026-10-21",
  },

  /** Тарифа за държавните такси, събирани от Агенцията по вписванията, чл. 2, ал. 1. */
  registry: {
    /** 0,1 на сто on the price of the deed, or on the secured amount of a mortgage. */
    pct: 0.1,
    /** "не по-малко от 10 лв./5,11 евро" — the euro amount as the Agency publishes it. */
    minEur: 5.11,
    source:
      "Тарифа за държавните такси, събирани от Агенцията по вписванията, чл. 2, ал. 1 (ПМС № 243/2005, посл. изм. ДВ, бр. 115/2025); извлечение в евро на АВп от 30.12.2025 г.",
    url: "https://www.registryagency.bg/bg/prestsentar/novini/drzhavni-taksi/",
    checked: "2026-10-21",
  },

  /** Данък при придобиване на имущество по възмезден начин (ЗМДТ чл. 47, ал. 2). */
  transferTax: {
    /** Range the municipal council may set; also the range of the manual input. */
    minPct: 0.1,
    maxPct: 3,
    source: "Закон за местните данъци и такси, чл. 47, ал. 2",
    /** Office city first, then by size. */
    municipalities: [
      {
        id: "plovdiv",
        name: "Пловдив",
        ratePct: 3,
        source:
          "Наредба за определянето размера на местните данъци на територията на община Пловдив, чл. 35, ал. 2 (Р. № 389/28.12.2019 г., в сила от 1.01.2020 г.)",
        url: "https://plovdiv.obshtini.bg/doc/6401042/0/",
        checked: "2026-10-21",
      },
      {
        id: "sofia",
        name: "София (Столична община)",
        ratePct: 3,
        source:
          "Наредба за определяне на размера на местните данъци на Столичен общински съвет, чл. 35, ал. 2 (Реш. № 51/30.12.2019 г., в сила от 1.01.2020 г.; текст към Реш. № 1042/18.12.2025 г.)",
        url: "https://sofia.obshtini.bg/doc/385434",
        checked: "2026-10-21",
      },
      {
        id: "varna",
        name: "Варна",
        ratePct: 3,
        source:
          "Наредба за определяне размера на местните данъци на територията на Община Варна, чл. 34, ал. 2 (Реш. № 61-2(3)/27.12.2019 г., в сила от 1.01.2020 г.)",
        url: "https://varna.obshtini.bg/doc/345772/0",
        checked: "2026-10-21",
      },
      {
        id: "burgas",
        name: "Бургас",
        ratePct: 3,
        source:
          "Наредба за определяне размера на местните данъци на територията на Община Бургас, чл. 41, ал. 2 (изм. Протокол № 21/20.12.2016 г.; текст към Протокол № 22/25.03.2025 г.)",
        url: "https://burgascouncil.org/node/2008",
        checked: "2026-10-21",
      },
      {
        id: "stara-zagora",
        name: "Стара Загора",
        ratePct: 3,
        source:
          "Наредба за определянето и администрирането на местните данъци на територията на Община Стара Загора, чл. 37, ал. 2 (Реш. № 61/21.12.2023 г.)",
        url: "https://starazagora.obshtini.bg/doc/6597227/0",
        checked: "2026-10-21",
      },
      {
        id: "ruse",
        name: "Русе",
        ratePct: 3,
        source:
          "Наредба № 20 на ОбС Русе — увеличение от 2,7 на 3 на сто, прието от общинския съвет през декември 2024 г. (по публикация в „Утро Русе“ от 18.12.2024 г.; ставката е потвърдена от собственика на 21.10.2026 г.)",
        url: "https://utroruse.com/article/1063270/",
        checked: "2026-10-21",
      },
    ] satisfies Municipality[],
  },
} as const;
