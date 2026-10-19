/**
 * Phone numbers for the consultation form (FR-3): Bulgarian numbers in local (`0888 123 456`,
 * `032 123 456`) or international form (`+359…`, `00359…`), and any other international number
 * for clients abroad. Returns E.164 (`+359888123456`) or `null` when the input is not a number.
 */
export function normalizePhone(input: string): string | null {
  const compact = input.replace(/[\s\-./()]/g, "").replace(/^00/, "+");

  // Bulgarian, international form; tolerate the common extra 0 after the country code.
  const bg = /^\+?3590?(\d{8,9})$/.exec(compact);
  if (bg) return `+359${bg[1]}`;

  // Bulgarian, local form: mobiles have 10 digits, Plovdiv and other landlines 9.
  const local = /^0([1-9]\d{7,8})$/.exec(compact);
  if (local) return `+359${local[1]}`;

  // Any other country (E.164: up to 15 digits, no leading 0).
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;

  return null;
}
