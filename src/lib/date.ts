const longDate = new Intl.DateTimeFormat("bg-BG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Sofia",
});

/** "2026-10-19" → "19 октомври 2026 г." (Europe/Sofia, CLAUDE.md conventions). */
export function formatIsoDate(iso: string): string {
  // Noon UTC is the same calendar day in Sofia all year round.
  return longDate.format(new Date(`${iso}T12:00:00Z`));
}
