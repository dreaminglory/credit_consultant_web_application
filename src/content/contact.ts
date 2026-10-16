/**
 * Bulgarian copy for `/kontakti` (T4, B-18, FR-26…27) and the 404 page. First person, feminine
 * forms. Contact values themselves come only from `site` (TR-11). Draft wording: O-16.
 */

export const contactPage = {
  label: "Контакти",
  title: "Звъннете, пишете или елате в офиса.",
  intro:
    "Отговарям лично — по телефон, Viber, WhatsApp или имейл. За среща в офиса в Пловдив се уговорете предварително, за да ви отделя нужното време.",
  cardLabel: "Офисът",
  cardTitle: "Офисът ми в Пловдив",
};

export const mapCopy = {
  anchor: "karta",
  show: "Покажи картата",
  open: "Отвори в Google Maps",
  /** Shown under the preview: why the live map is not loaded yet (FR-27, BM-8). */
  note: "Картата се зарежда от Google едва след като я отворите.",
  iframeTitle: "Карта: офисът на Десислава Арабаджиева в Пловдив",
  previewLabel: "Схема на местоположението на офиса",
};

export const notFoundPage = {
  label: "Грешка 404",
  title: "Тази страница не съществува.",
  intro:
    "Адресът може да е сгрешен или страницата да е преместена. Ето откъде можете да продължите.",
  links: [
    {
      href: "/krediti",
      title: "Кредити",
      text: "Ипотечни, рефинансиране, бизнес и потребителски кредити",
    },
    {
      href: "/kalkulatori",
      title: "Калкулатори",
      text: "Вноска, колко можете да изтеглите, цена на кредита",
    },
    { href: "/kontakti", title: "Контакти", text: "Телефон, адрес и карта на офиса" },
  ],
  home: "Към началната страница",
};
