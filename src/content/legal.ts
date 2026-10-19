import { cookieCategories, cookies } from "@/config/cookies";
import type { MaybePending } from "@/config/pending";
import { site } from "@/config/site";

/**
 * Legal pages (T6, REQUIREMENTS §8, LC-1, LC-3). Original drafts written 2026-10-19 for lawyer
 * review (O-14, `site.legal.review`) — not CreditMall's texts. First person: "аз" is the data
 * controller / provider named in the first section. Every company fact, contact and authority
 * comes from config, so footer, FAQ and these pages read the same (CR-6).
 */

export type LinkSegment = { href: string; label: string };
export type Segment = MaybePending | LinkSegment;
export type Inline = readonly Segment[];

export type LegalBlock =
  | { kind: "p"; text: Inline }
  | { kind: "list"; items: readonly Inline[] }
  | { kind: "facts"; rows: readonly { term: string; value: Inline }[] }
  | {
      kind: "table";
      caption: string;
      head: readonly string[];
      rows: readonly (readonly Inline[])[];
    }
  /** The visitor's current cookie choice and the button that reopens the settings. */
  | { kind: "consent" };

export type LegalSection = { id: string; title: string; blocks: readonly LegalBlock[] };

export type LegalDoc = {
  slug: "poveritelnost" | "biskvitki" | "obshti-usloviya";
  label: string;
  title: string;
  description: string;
  /** ISO date of the last content change. */
  updated: string;
  sections: readonly LegalSection[];
};

export function isLink(segment: Segment): segment is LinkSegment {
  return typeof segment === "object" && "href" in segment;
}

/** Tagged template: keeps config values (and pending markers) as separate segments. */
function t(strings: TemplateStringsArray, ...values: Segment[]): Inline {
  const out: Segment[] = [];
  strings.forEach((text, index) => {
    if (text) out.push(text);
    if (index < values.length) out.push(values[index]!);
  });
  return out;
}

const link = (label: string, href: string): LinkSegment => ({ href, label });
const p = (text: Inline): LegalBlock => ({ kind: "p", text });
const list = (...items: Inline[]): LegalBlock => ({ kind: "list", items });

const { legal, contact, person } = site;
const { kzld, kzp, bnb } = legal.authorities;
const authority = (a: { name: string; address: string; web: string }) =>
  t`${a.name}, ${a.address}, ${link(a.web.replace(/^https:\/\/(www\.)?/, ""), a.web)}`;

const controllerFacts: LegalBlock = {
  kind: "facts",
  rows: [
    { term: "Наименование", value: t`${legal.company}` },
    { term: "ЕИК", value: t`${legal.eik}` },
    { term: "Седалище и адрес", value: t`${legal.registeredAddress}` },
    { term: "Представлява се от", value: t`${person.name}` },
    { term: "Имейл", value: t`${contact.email}` },
    { term: "Телефон", value: t`${contact.phone}` },
  ],
};

export const privacyPolicy: LegalDoc = {
  slug: "poveritelnost",
  label: "Поверителност",
  title: "Политика за поверителност",
  description:
    "Какви лични данни събирам чрез сайта, защо, на кого ги предавам, колко дълго ги пазя и какви права имате.",
  updated: "2026-10-19",
  sections: [
    {
      id: "administrator",
      title: "Кой обработва данните ви",
      blocks: [
        p(
          t`Администратор на личните данни, които оставяте на този сайт, е ${legal.company}. По-долу „аз“ означава администратора. За всички въпроси за данните ви ми пишете на ${contact.email} или се обадете на ${contact.phone}.`,
        ),
        controllerFacts,
      ],
    },
    {
      id: "danni",
      title: "Какви данни събирам",
      blocks: [
        p(t`Когато изпратите запитване за консултация:`),
        list(
          t`име, телефон и — по желание — имейл;`,
          t`какъв кредит ви интересува, желаната сума, как и кога предпочитате да се свържа с вас и съобщението ви, ако напишете такова;`,
          t`от коя страница сте изпратили запитването и през коя реклама или сайт сте дошли (параметри на кампанията като utm, gclid, fbclid).`,
        ),
        p(
          t`IP адресът ви се използва само в момента на изпращане — за защита от спам и прекалено много заявки — и не се записва заедно със запитването.`,
        ),
        p(
          t`През сайта не искам и не приемам ЕГН, данни от лична карта, документи за доходи или други документи. Ако по-късно са нужни за банката, ще ги обсъдим лично.`,
        ),
      ],
    },
    {
      id: "tseli",
      title: "За какво ги използвам",
      blocks: [
        {
          kind: "table",
          caption: "Цели и правни основания по чл. 6, ал. 1 от Общия регламент (ОРЗД)",
          head: ["Цел", "Правно основание"],
          rows: [
            [
              t`Да ви се обадя, да отговоря на запитването и да ви консултирам`,
              t`Стъпки преди сключване на договор по ваше искане — чл. 6(1)(б)`,
            ],
            [
              t`Защита на формата от спам и злоупотреби (Cloudflare Turnstile, ограничение на заявките)`,
              t`Легитимен интерес — чл. 6(1)(е)`,
            ],
            [
              t`Отчитане кои реклами водят до запитвания (Meta Pixel, Google Ads)`,
              t`Вашето съгласие от банера за бисквитки — чл. 6(1)(а)`,
            ],
            [
              t`Показване на картата на Google на страница „Контакти“`,
              t`Вашето съгласие или изричното ви действие (бутон „Покажи картата“) — чл. 6(1)(а)`,
            ],
            [
              t`Обща статистика за посещенията (Cloudflare Web Analytics, без бисквитки и без лични профили)`,
              t`Легитимен интерес — чл. 6(1)(е)`,
            ],
          ],
        },
        p(
          t`Не взимам автоматизирани решения и не правя профилиране, което има правни последици за вас.`,
        ),
      ],
    },
    {
      id: "poluchateli",
      title: "На кого предавам данните",
      blocks: [
        list(
          t`Resend — изпраща ми запитването по имейл и ви изпраща потвърждение;`,
          t`Google (Google Sheets) — таблицата, в която записвам запитванията;`,
          t`Cloudflare — хостинг на сайта, защита от спам (Turnstile) и статистика без бисквитки;`,
          t`Meta и Google — рекламни бисквитки, само ако сте ги приели;`,
          t`Google Maps — само ако заредите картата;`,
          t`${legal.intermediary} — кредитният посредник, чрез когото работя, и банките, с които кандидатствате — само след като се договорим и с вашето изрично съгласие.`,
        ),
        p(t`Не продавам данни и не ги давам за реклама на трети лица.`),
      ],
    },
    {
      id: "izvan-es",
      title: "Предаване извън Европейския съюз",
      blocks: [
        p(
          t`Някои от доставчиците по-горе са американски компании или използват сървъри извън ЕС. Предаването става въз основа на Рамката за защита на данните ЕС–САЩ или стандартни договорни клаузи, одобрени от Европейската комисия.`,
        ),
      ],
    },
    {
      id: "srok",
      title: "Колко дълго пазя данните",
      blocks: [
        p(
          t`Ако след консултацията не продължим заедно, изтривам запитването до ${legal.retention} след получаването му.`,
        ),
        p(
          t`Ако работим по кредит, пазя данните толкова, колкото е нужно за услугата и колкото изискват законите — например счетоводните и тези срещу изпирането на пари.`,
        ),
        p(
          t`Сроковете на бисквитките са описани в ${link("Политиката за бисквитките", "/biskvitki")}.`,
        ),
      ],
    },
    {
      id: "prava",
      title: "Вашите права",
      blocks: [
        p(t`По всяко време можете да поискате:`),
        list(
          t`достъп до данните, които пазя за вас, и копие от тях;`,
          t`поправка на неточни данни;`,
          t`изтриване („право да бъдеш забравен“);`,
          t`ограничаване на обработването;`,
          t`да получите данните си в машинночетим вид (преносимост);`,
          t`да възразите срещу обработване на основание легитимен интерес;`,
          t`да оттеглите съгласието си — за бисквитките чрез „Настройки на бисквитките“ в долната част на всяка страница. Оттеглянето не засяга законността на обработването преди него.`,
        ),
        p(t`Пишете ми на ${contact.email}. Отговарям до един месец, а обикновено много по-бързо.`),
      ],
    },
    {
      id: "zhalba",
      title: "Право на жалба",
      blocks: [
        p(
          t`Ако смятате, че обработвам данните ви незаконно, можете да подадете жалба до надзорния орган:`,
        ),
        p(authority(kzld)),
      ],
    },
    {
      id: "sigurnost",
      title: "Сигурност",
      blocks: [
        p(
          t`Сайтът работи само по защитена връзка (HTTPS). Запитванията не се пазят на сайта, а само в имейла и таблицата ми, до които имам достъп само аз. В техническите записи на сайта не се записват имена, телефони, имейли или съобщения.`,
        ),
      ],
    },
    {
      id: "promeni",
      title: "Промени",
      blocks: [
        p(t`Ако променя тази политика, ще публикувам новата версия тук с новата дата най-горе.`),
      ],
    },
  ],
};

const categoryRows = (["necessary", "marketing", "media"] as const).map((id) => [
  t`${cookieCategories[id].title}`,
  t`${cookieCategories[id].text}`,
]);

export const cookiePolicy: LegalDoc = {
  slug: "biskvitki",
  label: "Бисквитки",
  title: "Политика за бисквитките",
  description: "Кои бисквитки използва сайтът, за какво, колко дълго и как да промените избора си.",
  updated: "2026-10-19",
  sections: [
    {
      id: "izbor",
      title: "Вашият избор",
      blocks: [
        p(
          t`Рекламните бисквитки и картата на Google работят само ако ги разрешите. Можете да промените избора си тук или от „Настройки на бисквитките“ в долната част на всяка страница.`,
        ),
        { kind: "consent" },
      ],
    },
    {
      id: "kakvo-sa",
      title: "Какво са бисквитките",
      blocks: [
        p(
          t`Бисквитките са малки файлове, които сайтът записва в браузъра ви. Подобно е и локалното хранилище на браузъра. Някои са необходими, за да работи сайтът; за останалите искам съгласието ви предварително.`,
        ),
      ],
    },
    {
      id: "kategorii",
      title: "Категории",
      blocks: [
        {
          kind: "table",
          caption: "Категории бисквитки на сайта",
          head: ["Категория", "За какво служи"],
          rows: categoryRows,
        },
      ],
    },
    {
      id: "spisak",
      title: "Пълен списък",
      blocks: [
        {
          kind: "table",
          caption: "Бисквитки и записи в браузъра",
          head: ["Име", "Доставчик", "Категория", "За какво", "Срок"],
          rows: cookies.map((cookie) => [
            t`${cookie.name}${cookie.kind === "storage" ? " (хранилище на браузъра)" : ""}`,
            t`${cookie.provider}`,
            t`${cookieCategories[cookie.category].title}`,
            t`${cookie.purpose}`,
            t`${cookie.duration}`,
          ]),
        },
      ],
    },
    {
      id: "statistika",
      title: "Статистика без бисквитки",
      blocks: [
        p(
          t`За да знам колко хора посещават сайта и кои страници четат, използвам Cloudflare Web Analytics. Той не поставя бисквитки, не следи посетителите между сайтовете и не създава профили, затова не изисква съгласие.`,
        ),
      ],
    },
    {
      id: "brauzar",
      title: "Управление от браузъра",
      blocks: [
        p(
          t`Можете да изтриете или блокирате бисквитките и от настройките на браузъра си. Ако блокирате необходимите, банерът ще се показва при всяко посещение.`,
        ),
        p(
          t`Повече за обработването на данните — в ${link("Политиката за поверителност", "/poveritelnost")}.`,
        ),
      ],
    },
  ],
};

export const termsPage: LegalDoc = {
  slug: "obshti-usloviya",
  label: "Общи условия",
  title: "Общи условия и правна информация",
  description:
    "Кой стои зад сайта, регистрацията ми като кредитен посредник, какво включва безплатната консултация и правилата за ползване на сайта.",
  updated: "2026-10-19",
  sections: [
    {
      id: "dostavchik",
      title: "Информация за доставчика",
      blocks: [
        p(t`Информация по чл. 4 от Закона за електронната търговия:`),
        {
          kind: "facts",
          rows: [
            ...controllerFacts.rows,
            { term: "Регистрация", value: t`${legal.disclosure}` },
            { term: "Надзорен орган", value: authority(bnb) },
          ],
        },
      ],
    },
    {
      id: "usluga",
      title: "Какво предлагам",
      blocks: [
        p(
          t`Безплатна консултация и съдействие при избор и кандидатстване за ипотечен, потребителски или бизнес кредит и за рефинансиране. Сравнявам предложенията на банките, с които работя, помагам с документите и ви водя до подписването на договора.`,
        ),
        p(
          t`Не съм банка и не отпускам кредити. Решението за кредита и окончателните условия са на банката.`,
        ),
      ],
    },
    {
      id: "vaznagrazhdenie",
      title: "Безплатно за вас",
      blocks: [
        p(
          t`Консултацията и съдействието ми са безплатни за вас. Възнаграждение получавам от банката, с която сключите договор. Това не променя условията, които банката ви предлага.`,
        ),
        p(
          t`Ако някога за конкретна услуга се дължи плащане от вас, ще ви кажа предварително и писмено, преди да е възникнало задължение.`,
        ),
      ],
    },
    {
      id: "kalkulatori",
      title: "Калкулатори и примерни стойности",
      blocks: [
        p(
          t`Калкулаторите на сайта дават ориентировъчни резултати и не са оферта. Лихвите в тях са примерни. Точните условия, годишният процент на разходите (ГПР) и представителният пример се посочват от банката в индивидуалното ѝ предложение.`,
        ),
      ],
    },
    {
      id: "otzivi",
      title: "Отзиви, снимки и лога",
      blocks: [
        p(
          t`Отзивите и снимките на клиенти се публикуват само с писменото им съгласие. Логата на банките са търговски марки на съответните банки и показват с кои банки работя.`,
        ),
      ],
    },
    {
      id: "polzvane",
      title: "Ползване на сайта",
      blocks: [
        list(
          t`Текстовете, снимките и дизайнът на сайта са защитени от авторското право. Не ги копирайте без разрешение.`,
          t`Информацията на сайта е обща и не замества индивидуалната консултация.`,
          t`Полагам грижа сайтът да е точен и достъпен, но не отговарям за прекъсвания или за решения, взети само въз основа на общата информация тук.`,
          t`Изпращайте във формата само верни данни и само своите.`,
        ),
      ],
    },
    {
      id: "spori",
      title: "Жалби и спорове",
      blocks: [
        p(
          t`Ако не сте доволни, пишете ми на ${contact.email} — ще потърсим решение заедно. Можете да се обърнете и към:`,
        ),
        list(authority(kzp), authority(bnb)),
        p(t`За неуредените въпроси се прилага българското законодателство.`),
      ],
    },
    {
      id: "danni",
      title: "Лични данни и бисквитки",
      blocks: [
        p(
          t`Как обработвам данните ви — в ${link("Политиката за поверителност", "/poveritelnost")}. Какви бисквитки използвам — в ${link("Политиката за бисквитките", "/biskvitki")}.`,
        ),
      ],
    },
  ],
};

export const legalDocs = [privacyPolicy, cookiePolicy, termsPage] as const;

export const legalCopy = {
  updated: "Последна актуализация:",
  toc: "Съдържание",
  draft:
    "Проект: текстът предстои да бъде прегледан от юрист и може да бъде променен преди публикуването на сайта.",
};
