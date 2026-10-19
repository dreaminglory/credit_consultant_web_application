/**
 * Stylised outline of Bulgaria for the coverage block (B-09, CV-2). The border is a hand-simplified
 * polygon of lon/lat points — recognisable, not cartographically exact — projected to SVG units.
 */

export type LonLat = readonly [lon: number, lat: number];
export type Point = { x: number; y: number };

/** Border, clockwise from the north-west tip: Danube, Black Sea coast, Turkey, Greece, N. Macedonia, Serbia. */
export const BORDER: readonly LonLat[] = [
  [22.68, 44.22],
  [22.9, 43.99],
  [23.5, 43.8],
  [23.97, 43.69],
  [24.5, 43.73],
  [24.95, 43.7],
  [25.35, 43.62],
  [25.7, 43.7],
  [25.95, 43.85],
  [26.6, 44.03],
  [27.27, 44.12],
  [27.9, 43.97],
  [28.3, 43.83],
  [28.6, 43.74],
  [28.58, 43.54],
  [28.47, 43.36],
  [28.17, 43.41],
  [27.92, 43.2],
  [27.88, 42.87],
  [27.9, 42.7],
  [27.73, 42.66],
  [27.47, 42.5],
  [27.7, 42.42],
  [27.85, 42.17],
  [28.03, 41.98],
  [27.5, 42.0],
  [27.0, 42.08],
  [26.55, 41.82],
  [26.32, 41.71],
  [26.15, 41.55],
  [25.95, 41.32],
  [25.5, 41.3],
  [25.0, 41.25],
  [24.6, 41.4],
  [24.3, 41.58],
  [24.0, 41.55],
  [23.6, 41.38],
  [23.2, 41.38],
  [22.93, 41.34],
  [22.75, 41.55],
  [22.65, 41.9],
  [22.36, 42.32],
  [22.5, 42.55],
  [22.88, 42.95],
  [22.65, 43.2],
  [22.4, 43.5],
  [22.55, 43.75],
  [22.7, 44.0],
];

export const CITIES = {
  plovdiv: [24.75, 42.15],
  sofia: [23.32, 42.7],
  varna: [27.92, 43.21],
  burgas: [27.3, 42.52],
  ruse: [25.95, 43.85],
  pleven: [24.62, 43.41],
  starazagora: [25.63, 42.43],
  blagoevgrad: [23.09, 42.02],
  tarnovo: [25.65, 43.08],
} as const satisfies Record<string, LonLat>;

const LON_MIN = 22.3;
const LAT_MAX = 44.25;
/** SVG units per degree of latitude; longitude is scaled by cos(42.7°) to keep proportions. */
const SCALE = 150;
const LON_FACTOR = Math.cos((42.7 * Math.PI) / 180);

/** Equirectangular projection into SVG units; (0, 0) is the north-west corner of the map. */
export function project([lon, lat]: LonLat): Point {
  return {
    x: (lon - LON_MIN) * LON_FACTOR * SCALE,
    y: (LAT_MAX - lat) * SCALE,
  };
}

const fmt = (n: number) => n.toFixed(1);

export function outlinePath(): string {
  const [first, ...rest] = BORDER.map(project);
  if (!first) return "";
  return `M${fmt(first.x)} ${fmt(first.y)}${rest.map((p) => `L${fmt(p.x)} ${fmt(p.y)}`).join("")}Z`;
}

/** Gentle arc between two points, bowing sideways so lines from one origin do not overlap. */
export function arcPath(from: Point, to: Point, bow = 0.18): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return `M${fmt(from.x)} ${fmt(from.y)}Q${fmt(cx)} ${fmt(cy)} ${fmt(to.x)} ${fmt(to.y)}`;
}

/** Ray-casting point-in-polygon test, used to check the data in tests. */
export function insideBorder(point: Point): boolean {
  const poly = BORDER.map(project);
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]!;
    const b = poly[j]!;
    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside;
    }
  }
  return inside;
}

/** Extent of the projected border, for the SVG viewBox. */
export function mapSize(): { width: number; height: number } {
  const pts = BORDER.map(project);
  return {
    width: Math.max(...pts.map((p) => p.x)),
    height: Math.max(...pts.map((p) => p.y)),
  };
}
