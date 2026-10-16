import { pending, isPending, type MaybePending } from "@/config/pending";
import { site, type LoanSlug } from "@/config/site";

/**
 * FAQ by category (B-13, CONTENT.md §4). First person, feminine forms. Answers contain no
 * invented figures: anything that needs a verified number or the owner's confirmation is a
 * typed placeholder and stays out of the FAQPage structured data until it is final (FAQ-4).
 */

export type FaqCategoryId =
  "usluga" | "ipotechni" | "refinansirane" | "kandidatstvane" | "registratsia";

export type FaqItem = {
  /** Short Latin slug; the URL hash is `#vaprosi-<category>-<id>` (FAQ-3). */
  id: string;
  question: string;
  answer: MaybePending;
};

export type FaqCategory = {
  id: FaqCategoryId;
  /** Pill label. */
  label: string;
  /** Loan page that embeds only this category (FAQ-4), when there is one. */
  loan?: LoanSlug;
  items: FaqItem[];
};

export const faqSection = {
  anchor: "vaprosi",
  label: "Въпроси",
  title: "Отговорите, които търсите",
  lead: "Не намирате отговор? Обадете ми се — отговарям лично.",
  categoriesLabel: "Категории въпроси",
};

/** Registration answer, built from config so it matches the footer and legal pages (CR-6). */
const registrationAnswer = pending(
  "O-3",
  "Approve the exact registration wording with CreditMall (FAQ 15)",
  `Да. Дейността ми се извършва чрез ${site.legal.intermediary} — кредитен посредник, вписан в регистъра на Българската народна банка под № ${site.legal.bnbRegisterNo}. ${site.legal.company} е с ЕИК ${site.legal.eik}. Можете да проверите регистрацията на сайта на БНБ.`,
);

export const faqCategories: FaqCategory[] = [
  {
    id: "usluga",
    label: "За услугата",
    items: [
      {
        id: "bezplatna",
        question: "Наистина ли консултацията е безплатна?",
        answer:
          "Да. Възнаграждението ми се плаща от банката, с която сключите кредита. Вие не плащате нищо — нито за консултацията, нито за подготовката на документите.",
      },
      {
        id: "zashto-konsultant",
        question: "Защо да ползвам кредитен консултант, вместо да отида директно в банката?",
        answer:
          "В банката ще чуете една оферта. Аз сравнявам много банки, знам кои ще одобрят вашия профил и преговарям за условията. Спестявате време, нерви и често пари.",
      },
      {
        id: "po-losh-uslovia",
        question: "Ще получа ли по-лоши условия, ако кандидатствам чрез вас?",
        answer:
          "Не. Условията не се влошават заради мен — често са по-добри, защото работя с банките постоянно.",
      },
      {
        id: "izvan-plovdiv",
        question: "Работите ли с клиенти извън Пловдив и в чужбина?",
        answer:
          "Да. Офисът ми е в Пловдив, но повечето стъпки се случват по телефон, Viber, WhatsApp или видеовръзка, а документите се изпращат електронно. Работя и с българи, които живеят извън страната. Срещаме се лично, когато е нужно.",
      },
    ],
  },
  {
    id: "ipotechni",
    label: "Ипотечни кредити",
    loan: "ipotechni",
    items: [
      {
        id: "samoychastie",
        question: "Какво самоучастие ми е необходимо?",
        // No percentage on purpose: it must be checked against current BNB rules first.
        answer:
          "Размерът зависи от банката, от вида на имота и от профила ви. Обикновено банката финансира само част от оценката на имота, а останалото и средствата за таксите осигурявате вие. Точната сума ще ви кажа след първия разговор.",
      },
      {
        id: "kolko-vreme",
        question: "Колко време отнема получаването на ипотечен кредит?",
        answer: pending(
          "O-9",
          "Confirm the typical mortgage timeline (FAQ 6)",
          "Обикновено от първия разговор до усвояването минават около 3–6 седмици. Срокът зависи от банката и от това колко бързо са готови документите.",
        ),
      },
      {
        id: "dokumenti",
        question: "Какви документи ще са ми нужни?",
        answer:
          "Зависи от случая — лична карта, документи за доход, за имота и за други кредити. След първия разговор ви изпращам точен списък.",
      },
      {
        id: "dopalnitelni-razhodi",
        question: "Какви допълнителни разходи има при покупка на имот с кредит?",
        answer:
          "Оценка на имота, нотариални такси, местен данък, такса за вписване, банкови такси и застраховки. Ще ви дам точна сметка, преди да започнем.",
      },
    ],
  },
  {
    id: "refinansirane",
    label: "Рефинансиране",
    loan: "refinansirane",
    items: [
      {
        id: "kakvo-e",
        question: "Какво е рефинансиране и кога си струва?",
        answer:
          "Рефинансирането е погасяване на сегашния ви кредит с нов, при по-добри условия — обикновено в друга банка. Струва си, когато спестяването е по-голямо от разходите по прехвърлянето. Можете да го проверите с калкулатора или да ми се обадите и ще го сметнем заедно.",
      },
      {
        id: "razhodi",
        question: "Какви са разходите по прехвърлянето на кредита?",
        answer:
          "Зависят от вашия договор и от новата банка: възможна такса за предсрочно погасяване на стария кредит, оценка на обезпечението, нотариални такси и такси за вписване, както и такси на новата банка. Преди да започнем, правя точна сметка и ви показвам дали промяната наистина ви спестява пари.",
      },
    ],
  },
  {
    id: "kandidatstvane",
    label: "Кандидатстване и одобрение",
    items: [
      {
        id: "drugi-krediti",
        question: "Мога ли да получа кредит, ако имам други кредити или лизинг?",
        answer:
          "Често да. Банките гледат каква част от дохода ви отива за вноски. Ще сметнем заедно и ще намерим решение — понякога рефинансирането на старите задължения помага.",
      },
      {
        id: "samoosiguriavasht",
        question: "Мога ли да кандидатствам, ако съм самоосигуряващ се или работя в чужбина?",
        answer:
          "Да, в много случаи. Изискванията са различни за всяка банка — точно тук консултантът помага най-много.",
      },
      {
        id: "sadlazhnik",
        question: "Мога ли да кандидатствам заедно със съдлъжник?",
        answer:
          "Да. Съдлъжник (например съпруг, съпруга или родител) може да увеличи сумата, която банката ще ви отпусне.",
      },
      {
        id: "kreditna-istoria",
        question: "Как кредитната ми история влияе на одобрението?",
        answer:
          "Банките гледат как сте обслужвали досегашните си задължения. Добрата история помага, а просрочията могат да затруднят одобрението или да променят условията. Преди да подадем искане, ще ви кажа честно какви са шансовете ви и как да ги подобрим.",
      },
    ],
  },
  {
    id: "registratsia",
    label: "Регистрация и сигурност",
    items: [
      {
        id: "registrirana",
        question: "Регистрирана ли сте като кредитен посредник?",
        answer: registrationAnswer,
      },
      {
        id: "lichni-danni",
        question: "Какво се случва с личните ми данни?",
        answer:
          "Използвам ги само за да ви помогна с кредита и ги предавам на банка само с ваше съгласие. Подробности — в Политиката за поверителност.",
      },
      {
        id: "plashtane-pri-otkaz",
        question: "Плащам ли нещо, ако кредитът не бъде одобрен?",
        answer: "Не. Услугата ми е безплатна за вас при всички случаи.",
      },
    ],
  },
];

/** Question/answer pairs that are final, for FAQPage structured data (FAQ-4). */
export function faqEntries(categories: readonly FaqCategory[]) {
  return categories
    .flatMap((category) => category.items)
    .flatMap(({ question, answer }) => (isPending(answer) ? [] : [{ question, answer }]));
}
