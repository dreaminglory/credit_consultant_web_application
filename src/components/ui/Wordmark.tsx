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
 * Logo lockup (O-13, DR-7): the arch mark beside her name, stacked on two lines at every width so
 * the long name stays narrower than the old firm lockup. The link's accessible name is its text,
 * so the mark stays decorative.
 */
export function Wordmark({ tone = "dark", href, className }: WordmarkProps) {
  const [first, ...rest] = site.person.name.split(" ");
  const body = (
    <>
      <LogoMark tone={tone === "dark" ? "light" : "dark"} className="size-10 shrink-0" />
      <span className="grid font-head text-[19px] leading-[1.02] font-extrabold tracking-[-0.03em] whitespace-nowrap">
        <span>{first}</span>
        <span className={tone === "dark" ? "text-sea" : "text-gold"}>{rest.join(" ")}</span>
      </span>
    </>
  );
  // min-h keeps the header link a 44px tap target on phones.
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
