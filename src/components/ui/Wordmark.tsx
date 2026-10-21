import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/brand/Logo";

type WordmarkProps = {
  /** Light text for dark surfaces (footer). */
  tone?: "dark" | "light";
  /** Renders the name as a link to Home (header); plain text in the footer. */
  href?: string;
  className?: string;
};

/**
 * Logo lockup (O-13, DR-7): EC seal beside the firm name over her name, the D-2 lockup.
 * The link's accessible name is its text, so the mark stays decorative.
 */
export function Wordmark({ tone = "dark", href, className }: WordmarkProps) {
  const body = (
    <>
      <LogoMark tone={tone === "dark" ? "light" : "dark"} className="size-10 shrink-0" />
      <span className="grid">
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
      </span>
    </>
  );
  // min-h keeps the header link a 44px tap target on phones, where the subtitle is hidden.
  const classes = cn("flex min-h-11 items-center gap-2.5 no-underline", className);
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
