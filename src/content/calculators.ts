import { site, type CalculatorSlug, type LoanSlug } from "@/config/site";

/**
 * Bulgarian copy for the calculators (B-12, B-23, T3; FR-12…17). First person, feminine forms.
 * Field ranges live here with the labels; example values come from `site.calculatorDefaults`,
 * BNB limits from `site.limits.bnb` (FR-21).
 */

export type LiveCalculatorSlug = keyof typeof site.calculatorDefaults;

export type FieldUnit = "€" | "%" | "г.";

export type CalculatorField<K extends string = string> = {
  key: K;
  label: string;
  unit: FieldUnit;
  min: number;
  max: number;
  step: number;
  /** Adds a range slider under the input (amounts and terms). */
  slider?: boolean;
};

type InputKey<S extends LiveCalculatorSlug> = keyof (typeof site.calculatorDefaults)[S] & string;

export type CalculatorCopy<S extends LiveCalculatorSlug = LiveCalculatorSlug> = {
  /** Tab label in the hub, phrased as the visitor's question (mockup v2). */
  tab: string;
  /** h1 of the T3 page. */
  title: string;
  /** Hero lead of the T3 page and its meta description. */
  intro: string;
  fields: CalculatorField<InputKey<S>>[];
  headline: string;
  /** Labels of the detail rows under the big number, keyed by result field. */
  rows: Record<string, string>;
  cta: string;
  /** Always shown under the result: indicative, not an offer (CLAUDE.md). */
  disclaimer: string;
  /** "Как да разчетете резултата" on the T3 page. */
  explainer: string[];
  related: CalculatorSlug[];
  loan: LoanSlug;
};

const { dstiMax, ltvMax, maxTermYears, effective } = site.limits.bnb;
const pct = (share: number) => Math.round(share * 100);
const effectiveDate = new Intl.DateTimeFormat("bg-BG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Sofia",
}).format(new Date(`${effective}T12:00:00Z`));

const amount = (label: string, max = 1_000_000) =>
  ({ label, unit: "€", min: 0, max, step: 1000, slider: true }) as const;
const term = (label = "Срок", max: number = maxTermYears) =>
  ({ label, unit: "г.", min: 1, max, step: 1, slider: true }) as const;
const rate = (label = "Примерна годишна лихва") =>
  ({ label, unit: "%", min: 0, max: 20, step: 0.05 }) as const;

/** Remaining terms of older loans can exceed today's 30-year limit. */
const REMAINING_MAX = 35;

const plainDisclaimer =
  "Ориентировъчно изчисление при равни месечни вноски, без такси и застраховки. Не е оферта.";

export const calculatorCopy: { [S in LiveCalculatorSlug]: CalculatorCopy<S> } = {
  "mesechna-vnoska": {
    tab: "Каква ще е месечната ми вноска",
    title: "Калкулатор за месечна вноска по кредит",
    intro:
      "Въведете сумата, срока и лихвата — веднага ще видите месечната вноска, общата лихва и колко ще върнете общо.",
    fields: [
      { key: "amount", ...amount("Размер на кредита") },
      { key: "years", ...term() },
      { key: "ratePct", ...rate() },
    ],
    headline: "Месечна вноска",
    rows: { totalInterest: "Обща платена лихва", totalPaid: "Общо платено" },
    cta: "Искам реални оферти",
    disclaimer: plainDisclaimer,
    explainer: [
      "Вноската е анюитетна — еднаква всеки месец. В началото по-голямата част от нея е лихва, а към края — главница.",
      "Лихвата тук е примерна. Реалната зависи от банката, дохода ви, обезпечението и от това дали превеждате заплатата си в банката.",
      "Банките начисляват и такси и застраховки. За пълната цена използвайте калкулатора „Цена на кредита“ — а аз ще ви покажа реалните оферти.",
    ],
    related: ["kolko-moga-da-iztegla", "cena-na-kredita", "spored-vnoskata"],
    loan: "ipotechni",
  },

  refinansirane: {
    tab: "Колко ще спестя при рефинансиране",
    title: "Колко ще спестя при рефинансиране",
    intro:
      "Сравнете вноската, която плащате днес, с вноската при по-ниска лихва — и вижте дали прехвърлянето на кредита си струва след разходите.",
    fields: [
      { key: "balance", ...amount("Остатък по кредита") },
      { key: "years", ...term("Оставащ срок", REMAINING_MAX) },
      { key: "currentRatePct", ...rate("Сегашна годишна лихва") },
      { key: "newRatePct", ...rate("Примерна нова лихва") },
      {
        key: "switchingCosts",
        label: "Разходи по прехвърлянето",
        unit: "€",
        min: 0,
        max: 20_000,
        step: 50,
      },
    ],
    headline: "Спестявате на месец",
    rows: {
      currentPayment: "Сегашна вноска",
      newPayment: "Нова вноска",
      netSaving: "Нетно за целия срок",
      breakEvenMonth: "Разходите се връщат за",
      noSaving: "При тази лихва рефинансирането не носи спестяване.",
    },
    cta: "Проверете моя кредит",
    disclaimer:
      "Ориентировъчно. Точните разходи по прехвърлянето зависят от двете банки. Не е оферта.",
    explainer: [
      "Сравнявам вноската ви днес с вноската при същия остатък и оставащ срок, но с новата лихва.",
      "„Нетно за целия срок“ е спестяването за всички оставащи месеци минус разходите по прехвърлянето. Ако е отрицателно, рефинансирането не си струва.",
      "Разходите обикновено включват такса за предсрочно погасяване, оценка на имота, нотариални такси и вписване. За вашия случай ще ги пресметна точно.",
    ],
    related: ["tekushta-lihva", "mesechna-vnoska", "cena-na-kredita"],
    loan: "refinansirane",
  },

  "kolko-moga-da-iztegla": {
    tab: "Колко мога да изтегля",
    title: "Колко мога да изтегля според дохода си",
    intro:
      "Вижте до какъв жилищен кредит ви допускат правилата на БНБ при вашия доход и сегашните ви вноски.",
    fields: [
      { key: "netIncome", ...amount("Нетен месечен доход на домакинството", 50_000), step: 50 },
      {
        key: "otherPayments",
        label: "Други месечни вноски по кредити",
        unit: "€",
        min: 0,
        max: 20_000,
        step: 10,
      },
      { key: "years", ...term() },
      { key: "ratePct", ...rate() },
    ],
    headline: "Можете да изтеглите до",
    rows: { maxPayment: "Максимална месечна вноска" },
    cta: "Потвърдете с мен",
    disclaimer: `Ориентир по правилата на БНБ за жилищни кредити: всички вноски до ${pct(dstiMax)}% от нетния доход, срок до ${maxTermYears} години. Банките оценяват и други фактори. Не е оферта.`,
    explainer: [
      `От ${effectiveDate} БНБ ограничава кредитите, обезпечени с жилищни имоти: всички месечни вноски по кредити не може да надвишават ${pct(dstiMax)}% от нетния доход, а срокът — ${maxTermYears} години.`,
      "От тази граница изваждам вноските, които вече плащате, и пресмятам какъв кредит носи остатъкът.",
      `Кредитът може да е до ${pct(ltvMax)}% от стойността на имота, така че са нужни поне ${100 - pct(ltvMax)}% собствени средства плюс разходите по сделката.`,
      "Потребителските и бизнес кредитите следват собствените правила на всяка банка — там ще ви кажа реалната граница след разговор.",
    ],
    related: ["spored-vnoskata", "mesechna-vnoska", "cena-na-kredita"],
    loan: "ipotechni",
  },

  "spored-vnoskata": {
    tab: "Колко мога да изтегля според вноската",
    title: "Какъв кредит мога да изтегля според вноската",
    intro:
      "Започнете от вноската, която ви е удобно да плащате всеки месец, и вижте какъв кредит отговаря на нея.",
    fields: [
      { key: "payment", ...amount("Желана месечна вноска", 10_000), step: 10 },
      { key: "years", ...term() },
      { key: "ratePct", ...rate() },
    ],
    headline: "Размер на кредита",
    rows: {},
    cta: "Искам реални оферти",
    disclaimer: plainDisclaimer,
    explainer: [
      "Пресмятам каква сума се изплаща точно с тази вноска за избрания срок при въведената лихва.",
      "По-дълъг срок означава по-голям кредит при същата вноска, но и повече платена лихва общо.",
      "Проверете и дали вноската се вписва в лимита на БНБ — с калкулатора „Колко мога да изтегля“.",
    ],
    related: ["kolko-moga-da-iztegla", "mesechna-vnoska", "cena-na-kredita"],
    loan: "ipotechni",
  },

  "tekushta-lihva": {
    tab: "Каква лихва плащам в момента",
    title: "Каква лихва плащам в момента",
    intro:
      "Въведете остатъка, вноската и оставащия срок — ще видите каква годишна лихва реално плащате по кредита си.",
    fields: [
      { key: "balance", ...amount("Остатък по кредита") },
      { key: "payment", ...amount("Месечна вноска", 20_000), step: 1, slider: false },
      { key: "years", ...term("Оставащ срок", REMAINING_MAX) },
    ],
    headline: "Реално плащате лихва",
    rows: {
      tooLow: "Тази вноска не изплаща остатъка за този срок — проверете въведените данни.",
    },
    cta: "Може ли по-ниско?",
    disclaimer:
      "Изчислено от остатъка, вноската и срока. Ако вноската включва такси или застраховка, реалната лихва е по-ниска. Ориентировъчно.",
    explainer: [
      "Много хора не знаят каква лихва плащат днес — особено при плаваща лихва, която се е променяла с годините.",
      "Калкулаторът намира годишната лихва, при която остатъкът се изплаща точно с вашата вноска за оставащия срок.",
      "Ако резултатът е по-висок от днешните предложения на банките, рефинансирането може да ви спести пари. Пресметнете го с калкулатора „Спестяване при рефинансиране“.",
    ],
    related: ["refinansirane", "mesechna-vnoska", "cena-na-kredita"],
    loan: "refinansirane",
  },

  "cena-na-kredita": {
    tab: "Колко ще ми струва кредитът",
    title: "Колко ще ми струва кредитът — с таксите и ГПР",
    intro:
      "Добавете таксите и застраховките от офертата си и вижте пълната сума, която ще върнете, и приблизителния годишен процент на разходите (ГПР).",
    fields: [
      { key: "amount", ...amount("Размер на кредита") },
      { key: "years", ...term() },
      { key: "ratePct", ...rate("Годишна лихва") },
      {
        key: "upfrontFeePct",
        label: "Такса за отпускане",
        unit: "%",
        min: 0,
        max: 5,
        step: 0.1,
      },
      {
        key: "monthlyFee",
        label: "Месечна такса (сметка, обслужване)",
        unit: "€",
        min: 0,
        max: 100,
        step: 0.5,
      },
      {
        key: "annualInsurance",
        label: "Застраховки за година",
        unit: "€",
        min: 0,
        max: 10_000,
        step: 10,
      },
    ],
    headline: "Общо ще върнете",
    rows: {
      payment: "Месечна вноска",
      monthlyOutflow: "На месец с такси и застраховки",
      totalInterest: "Обща лихва",
      totalFees: "Такси",
      totalInsurance: "Застраховки",
      aprPct: "ГПР (приблизително)",
    },
    cta: "Искам реални оферти",
    disclaimer:
      "Ориентировъчно. ГПР е пресметнат по формулата от Закона за потребителския кредит само с въведените от вас разходи; в офертата на банката може да има и други. Не е оферта.",
    explainer: [
      "Лихвата не е цялата цена. Таксите за отпускане и обслужване и застраховките също са част от това, което плащате.",
      "ГПР (годишен процент на разходите) събира лихвата и всички разходи в един процент — така сравнявате честно оферти на различни банки.",
      "Въведете таксите от офертата, която имате. Ако още нямате оферта — ще ви донеса няколко и ще ги сравним заедно.",
    ],
    related: ["mesechna-vnoska", "refinansirane", "tekushta-lihva"],
    loan: "potrebitelski",
  },
};

export const liveCalculatorSlugs = Object.keys(calculatorCopy) as LiveCalculatorSlug[];

export function isLiveCalculator(slug: string): slug is LiveCalculatorSlug {
  return slug in calculatorCopy;
}

/** Shared labels of the calculator block and hub. */
export const calculatorUi = {
  resultLabel: "Резултат",
  ownPage: "Отворете на отделна страница",
  invalid: (min: string, max: string) => `Въведете число от ${min} до ${max}.`,
  slider: (label: string) => `${label} — плъзгач`,
  months: (n: number) => `${n} ${n === 1 ? "месец" : "месеца"}`,
  never: "не се връщат",
  unknown: "—",
};

/** Home section (B-23, CONTENT.md §0) and the `/kalkulatori` overview (T4). */
export const calculatorHub = {
  anchor: "kalkulatori",
  label: "Калкулатори",
  title: "Сметнете сами — после ще го направим заедно",
  tabsLabel: "Калкулатори",
  soonTitle: "Скоро",
  soonNote: "След проверка на тарифите",
};

export const calculatorsPage = {
  title: "Калкулатори за кредит",
  intro: `${liveCalculatorSlugs.length} калкулатора, с които сами виждате вноската, възможностите си и реалната цена на кредита. Резултатите са ориентировъчни — точните условия ще ви покажа след безплатна консултация.`,
  allTitle: "Всички калкулатори",
  open: "Отворете",
  explainerTitle: "Как да разчетете резултата",
  loanLink: "Научете повече",
};
