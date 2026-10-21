import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Logo concepts for the owner to choose from (REQUIREMENTS §7.1, O-13). Shown on /dev/kit only.
 * Once one is chosen it moves into `Wordmark` and the favicon set; the other two are deleted.
 * Marks are drawn on a 48×48 grid. "light" = for light surfaces, "dark" = for petrol/ink,
 * "mono" = single colour (currentColor) for stamps, fax-style documents and embossing.
 */
export type LogoConcept = "key" | "roof" | "seal";
export type LogoTone = "light" | "dark" | "mono";

export const logoConcepts: { id: LogoConcept; name: string; idea: string }[] = [
  {
    id: "key",
    name: "Key-E",
    idea: "Средната черта на „E“ е ключ — „вземате ключовете“.",
  },
  {
    id: "roof",
    name: "Roof-E",
    idea: "„E“ под една линия на покрив — дом и сигурност.",
  },
  {
    id: "seal",
    name: "Печат EC",
    idea: "Монограм EC в печат: долната черта на „E“ продължава под „C“ и ги свързва.",
  },
];

// Fill classes per tone: [main, accent].
const tones: Record<LogoTone, [string, string]> = {
  light: ["fill-petrol", "fill-gold"],
  dark: ["fill-white", "fill-gold"],
  mono: ["fill-current", "fill-current"],
};
const strokes: Record<LogoTone, [string, string]> = {
  light: ["stroke-petrol", "stroke-gold"],
  dark: ["stroke-white", "stroke-gold"],
  mono: ["stroke-current", "stroke-current"],
};

type MarkProps = { concept: LogoConcept; tone?: LogoTone; className?: string };

export function LogoMark({ concept, tone = "light", className = "size-12" }: MarkProps) {
  const [main, accent] = tones[tone];
  const [mainStroke, accentStroke] = strokes[tone];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {concept === "key" && (
        <>
          {/* Stem with top and bottom bars. */}
          <path className={main} d="M9 7h27v6H15v22h21v6H9z" />
          {/* Middle bar = key blade with two teeth. */}
          <path className={accent} d="M15 21h27v6h-3v4h-5v-4h-3v3h-5v-3H15z" />
        </>
      )}
      {concept === "roof" && (
        <>
          <path
            className={cn(accentStroke, "fill-none")}
            d="M6 22 24 8l18 14"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path className={main} d="M14 24H34V29H19.5V31H30V35.5H19.5V37H34V42H14Z" />
        </>
      )}
      {concept === "seal" && (
        <>
          {tone !== "mono" && (
            <rect
              width="48"
              height="48"
              rx="13"
              className={tone === "light" ? "fill-petrol" : "fill-white/10"}
            />
          )}
          {/* E whose bottom bar runs on under the C, tying the two letters together. */}
          <path
            className={tone === "mono" ? main : "fill-gold"}
            d="M9 12H21V16.5H13.5V21.75H20V26.25H13.5V31.5H39V36H9Z"
          />
          <path
            className={cn(tone === "mono" ? mainStroke : "stroke-gold", "fill-none")}
            d="M35.7 16.5A6.5 6.5 0 1 0 35.7 26.5"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/** Full lockup: mark + firm name over her name (the D-2 lockup). */
export function LogoLockup({ concept, tone = "light", className }: MarkProps) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex items-center gap-3", className)} translate="no">
      <LogoMark concept={concept} tone={tone} className="size-11 shrink-0" />
      <div className="grid">
        <span className="font-head text-[24px] leading-none font-extrabold tracking-[-0.03em]">
          Extra
          <span className={tone === "mono" ? undefined : dark ? "text-gold" : "text-sea"}>
            Consult
          </span>
        </span>
        <span
          className={cn(
            "mt-1.5 font-mono text-[11px] leading-none font-medium tracking-[0.06em] whitespace-nowrap uppercase",
            tone === "mono" ? undefined : dark ? "text-haze" : "text-muted",
          )}
        >
          {site.person.name}
        </span>
      </div>
    </div>
  );
}
