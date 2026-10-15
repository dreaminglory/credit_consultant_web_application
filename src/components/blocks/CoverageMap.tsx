import { coverage } from "@/content/home";
import { CITIES, arcPath, outlinePath, project, type Point } from "@/lib/coverageMap";
import { Reveal } from "@/components/ui/Reveal";

/** SVG viewBox with room around the country for the "abroad" arc. */
const VIEW = { x: -90, y: -70, width: 880, height: 590 };

const percent = (p: Point) => ({
  left: `${(((p.x - VIEW.x) / VIEW.width) * 100).toFixed(2)}%`,
  top: `${(((p.y - VIEW.y) / VIEW.height) * 100).toFixed(2)}%`,
});

const plovdiv = project(CITIES.plovdiv);
const abroad: Point = { x: -62, y: -38 };
const destinations = [
  CITIES.sofia,
  CITIES.varna,
  CITIES.burgas,
  CITIES.ruse,
  CITIES.pleven,
  CITIES.starazagora,
  CITIES.blagoevgrad,
  CITIES.tarnovo,
].map(project);

const outline = outlinePath();

const chip =
  "absolute rounded-full px-3 py-1.5 font-mono text-xs leading-none font-medium tracking-[0.05em] whitespace-nowrap text-white uppercase";

/**
 * Coverage map (B-09, CV-2): Bulgaria outline, a glowing Plovdiv pin, lines that draw out to
 * other cities and beyond the border. Labels are HTML so they stay readable on phones.
 */
export function CoverageMap() {
  return (
    <Reveal className="relative mx-auto w-full max-w-[640px]">
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-label="Карта на България: офис в Пловдив, линии към градовете в страната и към чужбина"
        className="h-auto w-full"
      >
        <path
          d={outline}
          className="fill-sand stroke-petrol"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        <g fill="none" strokeLinecap="round">
          {destinations.map((to, i) => (
            <path
              key={i}
              d={arcPath(plovdiv, to, i % 2 ? 0.16 : -0.16)}
              pathLength={1}
              className="draw-line stroke-sea"
              strokeWidth="2.5"
              style={{ "--draw-delay": `${i * 120}ms` } as React.CSSProperties}
            />
          ))}
          <path
            d={arcPath(plovdiv, abroad, 0.12)}
            pathLength={1}
            className="draw-line stroke-gold-deep"
            strokeWidth="3"
            style={{ "--draw-delay": "500ms" } as React.CSSProperties}
          />
        </g>

        {destinations.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            className="fill-white stroke-petrol"
            strokeWidth="2.5"
          />
        ))}
        <circle cx={abroad.x} cy={abroad.y} r="6" className="fill-gold-deep" />

        <circle cx={plovdiv.x} cy={plovdiv.y} r="14" className="pin-pulse fill-gold" />
        <circle
          cx={plovdiv.x}
          cy={plovdiv.y}
          r="11"
          className="fill-gold stroke-white"
          strokeWidth="4"
        />
      </svg>

      <span
        className={`${chip} -translate-x-1/2 -translate-y-[170%] bg-ink`}
        style={percent(plovdiv)}
      >
        {coverage.pinLabel}
      </span>
      <span
        className={`${chip} translate-x-[-15%] translate-y-[90%] bg-gold-deep`}
        style={percent(abroad)}
      >
        {coverage.abroadLabel}
      </span>
    </Reveal>
  );
}
