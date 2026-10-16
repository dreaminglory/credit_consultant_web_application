/**
 * Maths for the process journey line (B-07, PR-1, PR-4). Kept pure so it is unit-tested; the
 * component only measures the DOM and writes the results to CSS custom properties.
 */

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * How far the reader has travelled through the list, 0…1. `anchor` is the viewport line that
 * "draws" the journey (a little below the middle), `top`/`height` are the list's rect.
 */
export function scrollProgress(top: number, height: number, anchor: number): number {
  if (height <= 0) return 0;
  return clamp01((anchor - top) / height);
}

/**
 * Number of lit nodes. Node `i` sits `offset` of the way into its own 1/count slice of the line:
 * 0.5 for the horizontal layout (nodes centred in their column), 0 for the vertical one (nodes at
 * the top of their row).
 */
export function litCount(progress: number, count: number, offset: number): number {
  let lit = 0;
  for (let i = 0; i < count; i++) {
    if (progress * count - i - offset >= 0) lit = i + 1;
  }
  return lit;
}
