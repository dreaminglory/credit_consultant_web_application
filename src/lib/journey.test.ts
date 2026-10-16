import { describe, expect, it } from "vitest";
import { litCount, scrollProgress } from "./journey";

describe("scrollProgress", () => {
  it("is 0 before the list reaches the anchor and 1 once it has passed", () => {
    expect(scrollProgress(500, 800, 400)).toBe(0);
    expect(scrollProgress(-900, 800, 400)).toBe(1);
  });

  it("is proportional in between", () => {
    expect(scrollProgress(0, 800, 400)).toBe(0.5);
  });

  it("ignores an empty list", () => {
    expect(scrollProgress(0, 0, 400)).toBe(0);
  });
});

describe("litCount", () => {
  it("lights nothing at the start and everything at the end", () => {
    expect(litCount(0, 8, 0.5)).toBe(0);
    expect(litCount(1, 8, 0.5)).toBe(8);
  });

  it("lights a centred node only once the line passes its middle", () => {
    // 8 nodes: node 0 is centred at 1/16 of the line.
    expect(litCount(0.06, 8, 0.5)).toBe(0);
    expect(litCount(0.0625, 8, 0.5)).toBe(1);
  });

  it("lights a node at the top of its row as soon as the line reaches it", () => {
    expect(litCount(0, 8, 0)).toBe(1);
    expect(litCount(0.125, 8, 0)).toBe(2);
  });
});
