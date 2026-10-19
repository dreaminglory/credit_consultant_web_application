/**
 * Typed placeholders for content the owner has not supplied yet (REQUIREMENTS §13, A-6).
 * `npm run check:content` lists every `pending("O-…")` call left in src/ — it must be empty
 * before launch.
 */
export type OpenItem =
  | "O-1"
  | "O-2"
  | "O-3"
  | "O-4"
  | "O-5"
  | "O-6"
  | "O-7"
  | "O-8"
  | "O-9"
  | "O-10"
  | "O-11"
  | "O-12"
  | "O-13"
  | "O-14"
  | "O-15"
  | "O-16"
  | "D-2";

export type Pending = {
  readonly pending: OpenItem;
  /** What is missing, in English, for the owner checklist. */
  readonly hint: string;
  /** Draft value shown with a visible marker until the owner confirms it. */
  readonly draft?: string;
};

export type MaybePending<T = string> = T | Pending;

export function pending(id: OpenItem, hint: string, draft?: string): Pending {
  return { pending: id, hint, draft };
}

export function isPending(value: unknown): value is Pending {
  return typeof value === "object" && value !== null && "pending" in value;
}
