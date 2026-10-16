import { pending, type MaybePending } from "@/config/pending";
import { site } from "@/config/site";

/**
 * Bulgarian copy for the Home page blocks (CONTENT.md §0, §3). First person, feminine forms.
 * Facts about the consultant that the owner has not supplied are typed placeholders (A-6).
 */

export const hero = {
  label: `${site.person.role} · ${site.office.city}`,
  title: "Аз намирам кредита. Вие получавате ключовете.",
  lead: "Ипотечни кредити, рефинансиране, бизнес и потребителски кредити. Сравнявам банките, подготвям документите и съм до вас на всяка стъпка — безплатно за вас.",
  primaryCta: { label: site.consultation.label, href: "/#konsultacia" },
  secondaryCta: { label: "Изчислете вноската", href: "/#kalkulatori" },
  chips: ["0 € за вас", "Един човек от начало до край", "Пловдив и цяла България"],
};

export type PromiseItem = { title: string; text: string };

/** Promise strip (B-05). The bank count comes from config, never typed by hand. */
export const promises: PromiseItem[] = [
  {
    title: "Безплатно за вас",
    text: "Възнаграждението ми се плаща от банката, не от вас.",
  },
  {
    title: "Аз водя целия процес",
    text: "От документите до подписа — вие почти нищо не правите.",
  },
  {
    title: `Оферти от ${site.banks.length} банки`,
    text: "Сравнявам условията вместо вас и избирате с ясна картина.",
  },
  {
    title: "Лично и навреме",
    text: "Отговарям ви сама, в работно време — не се губите в кол център.",
  },
];

export const loanSection = {
  label: "Кредити",
  title: "Какъв кредит ви трябва?",
};

/** Small tag above each loan card title. */
export const loanTags: Record<string, string> = {
  ipotechni: "Основно",
  refinansirane: "Основно",
  biznes: "За фирми",
  potrebitelski: "При нужда",
};

export type Principle = { title: string; text: string };

export const about = {
  anchor: "za-men",
  label: "За мен",
  title: "Аз съм Десислава — и ще ви водя от първия разговор до ключовете.",
  /** Her story, O-7. The draft line is a belief statement from the approved mockup. */
  story: pending(
    "O-7",
    "Personal story: how I started, why I do this, what sets me apart",
    "Кредитен консултант съм, защото вярвам, че купуването на дом трябва да е радост, а не стрес.",
  ) as MaybePending,
  principlesTitle: "Как работя",
  principles: [
    {
      title: "Първо слушам",
      text: "Обсъждаме целите, доходите и задълженията ви, преди да говорим за банки.",
    },
    {
      title: "Сметка преди решение",
      text: "Показвам ви реалната цена на кредита — с таксите, а не само с лихвата.",
    },
    {
      title: "До вас и след подписа",
      text: "Оставам на разположение и следя за по-добри условия в бъдеще.",
    },
  ] satisfies Principle[],
  cta: { label: "Вижте как протича процесът", href: "/#proces" },
};

export type KeyNumber = {
  label: string;
  /** A number, or a placeholder until the owner supplies it (O-7). */
  value: MaybePending<number>;
};

/** Key numbers (B-20). Real numbers only: years and clients wait for the owner. */
export const keyNumbers: KeyNumber[] = [
  { label: "години опит", value: pending("O-7", "Years of experience as a credit consultant") },
  { label: "доволни клиенти", value: pending("O-7", "Number of clients helped (real figure)") },
  { label: "банки партньори", value: site.banks.length },
];

export type Reason = { title: string; text: string };

export const why = {
  consultant: {
    label: "Защо кредитен консултант",
    title: "Една среща вместо десет банки.",
    reasons: [
      {
        title: "Оферти от много банки наведнъж",
        text: "Не обикаляте клонове — сравнявам условията вместо вас.",
      },
      {
        title: "По-добри условия",
        text: "Знам какво търси всяка банка и преговарям за лихвата и таксите.",
      },
      {
        title: "По-малко откази",
        text: "Подавам искането там, където профилът ви има най-добър шанс.",
      },
      {
        title: "Документите са моя грижа",
        text: "Казвам ви точно какво е нужно и проверявам всичко преди банката.",
      },
      { title: "Безплатно за вас", text: "Плаща банката, не вие." },
    ] satisfies Reason[],
  },
  me: {
    label: "Защо аз",
    title: "Работите с мен. Не с кол център.",
    reasons: [
      {
        title: "Един човек от началото до ключовете",
        text: "Знам случая ви наизуст и винаги вдигам телефона.",
      },
      {
        title: "Скорост",
        text: "Движа всяка стъпка напред, вместо да чакам банката.",
      },
      {
        title: "Честност",
        text: "Казвам ви истината за възможностите ви, дори когато не е удобна.",
      },
      {
        title: "Вие почти нищо не правите",
        text: "Аз водя процеса — вие подписвате.",
      },
      {
        title: "Искам да сте доволни",
        text: "Работата ми расте чрез препоръките на клиентите ми.",
      },
    ] satisfies Reason[],
  },
};

export const banksSection = {
  anchor: "banki",
  label: "Партньори",
  title: "Банките, с които работя.",
};

export const coverage = {
  anchor: "pokritie",
  label: "Къде работя",
  title: "Офисът ми е в Пловдив. Клиентите ми са в цяла България — и извън нея.",
  intro:
    "Не е нужно да сте в Пловдив, за да работим заедно. Повечето стъпки се случват по телефон, Viber, WhatsApp или видеовръзка, а документите се изпращат електронно. Когато е нужно лично присъствие, организирам всичко така, че да ви отнеме минимално време.",
  points: [
    { title: "В Пловдив", text: "Заповядайте в офиса ми за лична среща." },
    { title: "В цяла България", text: "Работя с банкови клонове и нотариуси във всеки град." },
    {
      title: "В чужбина",
      // CONTENT.md marks the power-of-attorney wording [провери]; keep the claim general.
      text: "Помагам и на българи, които живеят и работят извън страната — от консултацията до подписването.",
    },
  ],
  pinLabel: site.office.city,
  abroadLabel: "Българи в чужбина",
};

export const cta = {
  title: "Готови ли сте да започнем?",
  text: "Разкажете ми какво ви трябва — ще ви се обадя. Консултацията е безплатна и без ангажимент.",
};

export const contactStrip = {
  label: "Контакти",
  title: "Елате на кафе. Или просто звъннете.",
  link: { label: "Всички контакти и карта", href: "/kontakti" },
};
