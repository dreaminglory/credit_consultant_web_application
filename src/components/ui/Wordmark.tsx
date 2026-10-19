import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

type WordmarkProps = {
  /** Light text for dark surfaces (footer). */
  tone?: "dark" | "light";
  /** Renders the name as a link to Home (header); plain text in the footer. */
  href?: string;
  className?: string;
};

/**
 * Text wordmark until a logo is chosen (O-13): firm name over her name, the D-2 lockup.
 * Swap the body of this component for the SVG logo later; callers do not change.
 */
export function Wordmark({ tone = "dark", href, className }: WordmarkProps) {
  const body = (
    <>
      <span className="font-head text-[22px] leading-none font-extrabold tracking-[-0.03em]">
        Extra<span className={tone === "dark" ? "text-sea" : "text-gold"}>Consult</span>
      </span>
      <span
        className={cn(
          "mt-1 hidden font-mono whitespace-nowrap text-[11px] leading-none font-medium tracking-[0.06em] uppercase sm:block",
          tone === "dark" ? "text-muted" : "text-haze",
        )}
      >
        {site.person.name}
      </span>
    </>
  );
  const classes = cn("grid no-underline", className);
  return href ? (
    <Link href={href} className={classes} translate="no">
      {body}
    </Link>
  ) : (
    <div className={classes} translate="no">
      {body}
    </div>
  );
}
