import type { IconName } from "@/components/ui/Icon";

/**
 * What a mortgage loan can finance (B-25). Renovation / finishing work and house building are the
 * featured purposes. No rates, limits or promises: terms depend on the bank, the property
 * valuation and the applicant's profile.
 */

export type FinancingPurpose = {
  id: string;
  /** Mono tag above the title. */
  tag: string;
  title: string;
  text: string;
  icon: IconName;
  /** Featured cards show these points and the call to action. */
  includes?: string[];
  /** Compact cards that have a page of their own link to it. */
  href?: string;
};

export const financingPurposes = {
  label: "Какво финансираме",
  title: "Ипотечен кредит за всяка цел с дома.",
  lead: "От покупката до последния довършителен щрих — едно запитване, един човек до вас и условията на няколко банки на едно място.",
  cta: "Попитайте за вашия случай",
  note: "Размерът, срокът и условията зависят от банката, от оценката на имота и от профила ви.",
  featured: [
    {
      id: "remont",
      tag: "Ремонт и довършване",
      title: "Кредит за ремонти и довършителни работи",
      text: "Обновяване, ремонт или завършване на имот — когато домът ви има нужда от още работа, за да стане такъв, какъвто го искате.",
      icon: "roller",
      includes: [
        "Основен ремонт и обновяване на жилище",
        "Довършителни работи след груб строеж",
        "Баня, кухня, подове, дограма, отопление",
        "Обзавеждане и подобрения по имота",
      ],
    },
    {
      id: "stroitelstvo",
      tag: "Строителство",
      title: "Кредит за строителство на къща",
      text: "Изграждане на еднофамилна къща върху собствен терен — със сума, разпределена по етапите на строителството.",
      icon: "bricks",
      includes: [
        "Строеж на еднофамилна къща върху ваш терен",
        "Средствата обикновено се отпускат на части, по етапи",
        "Банката може да поиска проект, разрешение и количествено-стойностна сметка",
        "Списъкът с документите ви се подготвя предварително",
      ],
    },
  ] satisfies FinancingPurpose[],
  compact: [
    {
      id: "pokupka",
      tag: "Покупка",
      title: "Жилищен кредит",
      text: "За покупка на готов или строящ се имот.",
      icon: "home",
    },
    {
      id: "refinansirane",
      tag: "Рефинансиране",
      title: "Рефинансиране на ипотечен кредит",
      text: "Замяна на съществуващ кредит с нов — само когато сметката показва реална полза.",
      icon: "refresh",
      href: "/krediti/refinansirane",
    },
  ] satisfies FinancingPurpose[],
};
