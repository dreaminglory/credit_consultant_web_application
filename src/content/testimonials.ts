import type { LoanSlug } from "@/config/site";

/**
 * Client testimonials (B-10, FR-24). Real content only, supplied by the owner with the clients'
 * consent (O-1); never write one here by hand. Quotes are word for word, in the order of the
 * owner's spreadsheet (raw_contents/images/clinets/clients.xlsx), each with its own photo.
 */

export const testimonialsSection = {
  anchor: "otzivi",
  label: "Отзиви",
  title: "Какво казват клиентите ми",
  carouselLabel: "Отзиви на клиенти",
};

export type Testimonial = {
  id: string;
  /** Product the client took; drives the filter on loan pages (FR-25). Omitted when unknown. */
  product?: LoanSlug;
  quote: string;
  /** First name or initial only; omitted until the client agrees to it. */
  name?: string;
  city?: string;
  year?: number;
  /** Photo of the consultant with the client, from the image pipeline (A-8). */
  photo: { name: string; alt: string; width: number; height: number };
};

const photoAlt = "Десислава Арабаджиева със свои клиенти";

export const testimonials: Testimonial[] = [
  {
    id: "klient-1",
    product: "ipotechni",
    quote:
      "Най-добрата в бранша. Ако желаете топ обслужване, прозрачност, високо ниво на комуникация и сигурност при вземане на вашето решение за кредит - това е вашият правилен избор за кредитен консултант!",
    city: "Пловдив",
    year: 2024,
    photo: { name: "client-1", alt: photoAlt, width: 848, height: 1131 },
  },
  {
    id: "klient-2",
    product: "ipotechni",
    quote:
      "Голям професионалист в работата си коректна спрямо клиента и обръща необходимото внимание на съответния клиент. Благодаря и за добре свършената работа и бих работил отново с г-жа Арабаджиева, ако се налага, както и бих я препоръчал със сигурност.",
    city: "Пловдив",
    year: 2023,
    photo: { name: "client-2", alt: photoAlt, width: 848, height: 1131 },
  },
  {
    id: "klient-3",
    product: "ipotechni",
    quote:
      "Изключително съм впечатлен от високото ниво на професионализъм на Десислава Арабаджиева. Работи с изключителна прецизност, яснота и отговорност във всеки етап от процеса. Комуникацията е перфектна – точна, бърза и изчерпателна, което създава пълно доверие и спокойствие. Благодарение на нейния ангажимент и компетентност всичко беше реализирано безупречно и в кратки срокове. Изказвам искрената си благодарност.",
    city: "Пловдив",
    year: 2026,
    photo: { name: "client-3", alt: photoAlt, width: 1179, height: 930 },
  },
  {
    id: "klient-4",
    product: "ipotechni",
    quote:
      "Нямам думи да изразя своите благодарности към Деси Арабаджиева,защото тя сбъдна една наша голяма мечта!!!",
    city: "Пловдив",
    year: 2025,
    photo: { name: "client-4", alt: photoAlt, width: 1350, height: 1800 },
  },
  {
    id: "klient-5",
    product: "ipotechni",
    quote:
      "Изключително съм благодарен на Десислава за цялостното съдействие при финансирането на новия ми дом в Пловдив! Тъй като нямах налични спестявания, тя структурира офертата и изчисли всички съпътстващи разходи с изключителна точност. Взе върху себе си целия процес — от документацията и избора на банка, до точното определяне на размера на ипотеката. Спести ми огромно количество време, стрес и усилия. Изключителен професионалист, на когото можете да се доверите на 100%!",
    city: "Пловдив",
    year: 2023,
    photo: { name: "client-5", alt: photoAlt, width: 1012, height: 1801 },
  },
  {
    id: "klient-6",
    product: "ipotechni",
    quote: "Изключителен специалист! Всичко беше обяснено, изпълнено на сто процента!",
    city: "Пловдив",
    year: 2026,
    photo: { name: "client-6", alt: photoAlt, width: 1013, height: 1801 },
  },
  {
    id: "klient-7",
    product: "ipotechni",
    quote:
      "10/10 за Десислава! Невероятно отношение към всеки детайл от началото до края на сделката!",
    city: "Пловдив",
    year: 2025,
    photo: { name: "client-7", alt: photoAlt, width: 1350, height: 1800 },
  },
  {
    id: "klient-8",
    product: "ipotechni",
    quote:
      "Позитивен професионалист! Благодаря на госпожа Десислава Тортоманова-Арабаджиева за изчерпателните и подробни оферти и разяснения!",
    city: "Пловдив",
    year: 2024,
    photo: { name: "client-8", alt: photoAlt, width: 1099, height: 1800 },
  },
];
