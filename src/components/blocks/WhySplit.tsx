import { why, type Reason } from "@/content/home";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/cn";

/** Gutter that lines the split halves up with the 1240 px container (mockup v2). */
const gutter = "px-5 md:px-[max(20px,calc((100vw-1240px)/2+20px))]";

function Half({
  label,
  title,
  reasons,
  tone,
}: {
  label: string;
  title: string;
  reasons: Reason[];
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "py-16 md:py-24",
        dark ? "bg-ink text-white md:pl-14" : "bg-paper text-ink md:pr-14",
        gutter,
      )}
    >
      <Label>{label}</Label>
      <h2 className="mt-3.5 mb-9 text-[clamp(34px,4.4vw,60px)]">{title}</h2>
      <ul className="grid gap-[18px]">
        {reasons.map((reason) => (
          <li key={reason.title} className="grid grid-cols-[28px_1fr] gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 grid size-7 place-items-center rounded-full text-sm font-bold",
                dark ? "bg-gold text-ink" : "bg-sea text-white",
              )}
            >
              ✓
            </span>
            <p>
              <strong className="block font-semibold">{reason.title}</strong>
              <span className={dark ? "text-haze" : "text-muted"}>{reason.text}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Why a consultant / why me (B-11): full-bleed light/dark split (mockup v2). */
export function WhySplit() {
  return (
    <section aria-label="Защо кредитен консултант и защо аз" className="grid md:grid-cols-2">
      <Half {...why.consultant} tone="light" />
      <Half {...why.me} tone="dark" />
    </section>
  );
}
