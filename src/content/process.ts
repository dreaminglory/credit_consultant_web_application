import type { IconName } from "@/components/ui/Icon";
import { pending, type MaybePending } from "@/config/pending";
import type { LoanSlug } from "@/config/site";

/**
 * Process with durations (B-07, PR-1…5, CONTENT.md §2). Steps, durations and the total are
 * drafts until the owner confirms them (O-9); each variant removes or renames the steps that
 * do not apply to the product.
 */

export const processSection = {
  anchor: "proces",
  label: "Процесът",
  title: "Как работим заедно — стъпка по стъпка",
  variantsLabel: "Вид кредит",
  you: "Вие",
  me: "Аз",
  totalLabel: "От първия разговор до усвояването",
  totalNote:
    "Срокът е ориентировъчен и зависи от банката и от това колко бързо са готови документите.",
};

export type ProcessStep = {
  id: string;
  title: string;
  text: string;
  duration: MaybePending;
  /** What the client does (PR-5). */
  you: string;
  /** What the consultant does (PR-5). */
  me: string;
  icon: IconName;
};

export type ProcessVariant = {
  /** Same ids as the loan products, so a loan page can pick its own variant (PR-3). */
  id: LoanSlug;
  label: string;
  total: MaybePending;
  steps: ProcessStep[];
};

/** Step durations are drafts from CONTENT.md §2 and show as marked placeholders until O-9. */
const draftDuration = (text: string) =>
  pending("O-9", "Confirm the step durations (drafts from CONTENT.md §2)", text);

const baseSteps = {
  consultation: {
    id: "konsultacia",
    title: "Безплатна консултация",
    text: "Обсъждаме вашите цели, доходи и задължения и определяме реалистичните параметри на кредита.",
    duration: draftDuration("30–60 мин."),
    you: "Разказвате ми целта си и какво вече имате.",
    me: "Анализирам доходите, задълженията и реалните ви възможности.",
    icon: "chat",
  },
  comparison: {
    id: "analiz",
    title: "Анализ и сравнение на офертите",
    text: "Проучвам условията на банките, отправям запитвания и договарям най-изгодното предложение за вашия профил.",
    duration: draftDuration("1–2 работни дни"),
    you: "Отговаряте на въпросите ми и избирате предложение.",
    me: "Сравнявам банките и договарям лихвата и таксите.",
    icon: "compare",
  },
  preApproval: {
    id: "predvaritelno-odobrenie",
    title: "Предварително одобрение",
    text: "Подготвям и подавам искането в избраната банка и следя процеса до получаване на становище.",
    duration: draftDuration("3–5 работни дни"),
    you: "Предоставяте първоначалните документи.",
    me: "Подавам искането и следя всеки ден докъде е стигнало.",
    icon: "badge",
  },
  valuation: {
    id: "otsenka",
    title: "Пазарна оценка на имота",
    text: "Организирам задължителната оценка с лицензиран оценител, одобрен от банката.",
    duration: draftDuration("3–4 работни дни"),
    you: "Осигурявате достъп до имота.",
    me: "Уговарям оценителя и следя срока.",
    icon: "home",
  },
  documents: {
    id: "dokumenti",
    title: "Подготовка на документите",
    text: "Събирам, проверявам и комплектувам всички документи, необходими за окончателното одобрение и усвояването.",
    duration: draftDuration("3–5 работни дни"),
    you: "Изпращате поисканите документи.",
    me: "Проверявам, подреждам и комплектувам досието.",
    icon: "document",
  },
  finalApproval: {
    id: "okonchatelno-odobrenie",
    title: "Окончателно одобрение",
    text: "Банката извършва финалните проверки и юридическия анализ; договорът за кредит се подготвя за подпис.",
    duration: draftDuration("5–7 работни дни"),
    you: "Почти нищо — на въпросите на банката отговарям аз.",
    me: "Комуникирам с банката до окончателното становище.",
    icon: "shield",
  },
  signing: {
    id: "podpis",
    title: "Подписване и усвояване",
    text: "Подписвате договора, при нотариус се изповядва сделката и се учредява ипотеката; банката превежда средствата.",
    duration: draftDuration("1–3 работни дни"),
    you: "Подписвате договора и присъствате при нотариуса.",
    me: "Преглеждам договора с вас и съм до вас при подписването.",
    icon: "pen",
  },
  followUp: {
    id: "sled-podpisa",
    title: "Последващо съдействие",
    text: "Оставам на ваше разположение и следя за възможности за по-добри условия — включително бъдещо рефинансиране.",
    duration: "Без срок",
    you: "Обаждате ми се, когато имате въпрос.",
    me: "Оставам на разположение и следя за по-добри условия.",
    icon: "support",
  },
} satisfies Record<string, ProcessStep>;

const { consultation, comparison, preApproval, valuation, documents, finalApproval, signing } =
  baseSteps;

const refinancingSteps: ProcessStep[] = [
  consultation,
  comparison,
  preApproval,
  {
    ...valuation,
    title: "Оценка на обезпечението",
    text: "Организирам оценката на обезпечението с лицензиран оценител, одобрен от банката.",
    you: "Осигурявате достъп до обезпечението.",
  },
  documents,
  finalApproval,
  {
    ...signing,
    title: "Подписване и погасяване на стария кредит",
    text: "Подписвате договора с новата банка, а старият ви кредит се погасява със средствата от нея.",
    you: "Подписвате договора с новата банка.",
    me: "Преглеждам договора и следя старият кредит да бъде погасен.",
  },
  baseSteps.followUp,
];

/** Business and consumer loans have no property valuation (CONTENT.md §2). */
const withoutProperty: ProcessStep[] = [
  consultation,
  comparison,
  preApproval,
  documents,
  finalApproval,
  {
    ...signing,
    title: "Подписване и превод на средствата",
    text: "Подписвате договора, а банката превежда средствата.",
    you: "Подписвате договора.",
    me: "Преглеждам договора с вас и следя за превода на средствата.",
  },
  baseSteps.followUp,
];

export const processVariants: ProcessVariant[] = [
  {
    id: "ipotechni",
    label: "Ипотечен кредит",
    total: pending(
      "O-9",
      "Confirm the total time, first conversation to disbursement (mortgage)",
      "3–6 седмици",
    ),
    steps: [...Object.values(baseSteps)],
  },
  {
    id: "refinansirane",
    label: "Рефинансиране",
    total: pending("O-9", "Total time, first conversation to disbursement (refinancing)"),
    steps: refinancingSteps,
  },
  {
    id: "biznes",
    label: "Бизнес кредит",
    total: pending("O-9", "Total time, first conversation to disbursement (business loan)"),
    steps: withoutProperty,
  },
  {
    id: "potrebitelski",
    label: "Потребителски кредит",
    total: pending("O-9", "Total time, first conversation to disbursement (consumer loan)"),
    steps: withoutProperty,
  },
];
