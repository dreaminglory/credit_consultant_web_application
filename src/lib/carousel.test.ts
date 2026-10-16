import { describe, expect, it } from "vitest";
import { nearestIndex, wrapIndex } from "./carousel";

describe("wrapIndex", () => {
  it("loops in both directions", () => {
    expect(wrapIndex(4, 4)).toBe(0);
    expect(wrapIndex(-1, 4)).toBe(3);
    expect(wrapIndex(2, 4)).toBe(2);
  });

  it("copes with an empty carousel", () => {
    expect(wrapIndex(1, 0)).toBe(0);
  });
});

describe("nearestIndex", () => {
  const offsets = [0, 400, 800, 1200];

  it("picks the closest slide", () => {
    expect(nearestIndex(offsets, 0, false)).toBe(0);
    expect(nearestIndex(offsets, 230, false)).toBe(1);
    expect(nearestIndex(offsets, 790, false)).toBe(2);
  });

  it("picks the last slide at the end of the track", () => {
    expect(nearestIndex(offsets, 900, true)).toBe(3);
  });

  it("copes with no slides", () => {
    expect(nearestIndex([], 100, false)).toBe(0);
  });
});
