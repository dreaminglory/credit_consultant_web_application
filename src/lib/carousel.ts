/** Index helpers for the testimonial carousel (B-10, FR-25). Pure, so they are unit-tested. */

/** Wraps `index` into `0…count-1`, so arrows loop around. */
export function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

/**
 * Index of the slide whose snap position is closest to `scrollLeft`. When the track is scrolled
 * all the way to the end the last slide wins, because it may be too short to ever reach the
 * snap position of the first slides.
 */
export function nearestIndex(offsets: readonly number[], scrollLeft: number, atEnd: boolean) {
  if (offsets.length === 0) return 0;
  if (atEnd) return offsets.length - 1;
  let best = 0;
  for (let i = 1; i < offsets.length; i++) {
    if (Math.abs(offsets[i]! - scrollLeft) < Math.abs(offsets[best]! - scrollLeft)) best = i;
  }
  return best;
}
