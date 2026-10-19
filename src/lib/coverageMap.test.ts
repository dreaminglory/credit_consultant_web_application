import { describe, expect, it } from "vitest";
import { CITIES, arcPath, insideBorder, mapSize, outlinePath, project } from "./coverageMap";

describe("coverage map", () => {
  it("places every city inside the border outline", () => {
    for (const [name, lonLat] of Object.entries(CITIES)) {
      expect(insideBorder(project(lonLat)), name).toBe(true);
    }
  });

  it("places points outside the country outside the outline", () => {
    expect(insideBorder(project([21.0, 43.0]))).toBe(false); // Serbia
    expect(insideBorder(project([29.5, 43.0]))).toBe(false); // Black Sea
    expect(insideBorder(project([25.0, 40.5]))).toBe(false); // Greece
  });

  it("projects east of west and north above south", () => {
    const sofia = project(CITIES.sofia);
    const varna = project(CITIES.varna);
    expect(varna.x).toBeGreaterThan(sofia.x);
    expect(project(CITIES.ruse).y).toBeLessThan(project(CITIES.plovdiv).y);
  });

  it("keeps the map wider than tall, like the country", () => {
    const { width, height } = mapSize();
    expect(width).toBeGreaterThan(height);
  });

  it("builds closed outline and arc paths", () => {
    expect(outlinePath()).toMatch(/^M[\d. ]+L.*Z$/);
    expect(arcPath({ x: 0, y: 0 }, { x: 100, y: 0 })).toMatch(/^M0\.0 0\.0Q/);
  });
});
