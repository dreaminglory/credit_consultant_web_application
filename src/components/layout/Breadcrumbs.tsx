import Link from "next/link";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

type BreadcrumbsProps = {
  /** Trail after "Начало"; the last item is the current page and needs no href. */
  items: Crumb[];
  className?: string;
};

/** Breadcrumb trail for inner pages (NAV-7): Начало › Кредити › Ипотечни. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const trail: Crumb[] = [{ label: "Начало", href: "/" }, ...items];
  return (
    <nav aria-label="Път до страницата" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[13px] leading-6 font-medium">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="text-muted no-underline transition-colors duration-150 hover:text-ink"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-ink")}>
                  {crumb.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-sage">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
