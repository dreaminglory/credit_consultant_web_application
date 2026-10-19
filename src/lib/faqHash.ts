/**
 * URL hashes for the FAQ (FAQ-3): `#vaprosi-<category>` selects a category,
 * `#vaprosi-<category>-<question>` also opens that question.
 */

export const FAQ_PREFIX = "vaprosi";

type HashCategory = { id: string; items: readonly { id: string }[] };

export type FaqTarget = { categoryId: string; questionId: string | null };

export const categoryHash = (categoryId: string) => `${FAQ_PREFIX}-${categoryId}`;
export const questionHash = (categoryId: string, questionId: string) =>
  `${FAQ_PREFIX}-${categoryId}-${questionId}`;

/** Maps a location hash (with or without `#`) to a category/question, or null if it is not ours. */
export function resolveFaqHash(
  hash: string,
  categories: readonly HashCategory[],
): FaqTarget | null {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  for (const category of categories) {
    if (id === categoryHash(category.id)) return { categoryId: category.id, questionId: null };
    for (const item of category.items) {
      if (id === questionHash(category.id, item.id)) {
        return { categoryId: category.id, questionId: item.id };
      }
    }
  }
  return null;
}
