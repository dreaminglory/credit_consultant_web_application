import Link from "next/link";
import { site } from "@/config/site";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { loanIcons } from "./menuIcons";

const tile = (padding: string) =>
  `flex gap-4 rounded-tile ${padding} no-underline transition-[background-color,translate] duration-150 ease-out-soft hover:-translate-y-px hover:bg-ink/5 focus-visible:bg-ink/5`;

/** Кредити mega-menu content (NAV-3): one tile per loan plus a "not sure?" side panel. */
export function LoansPanel() {
  return (
    <div className="grid gap-3 p-3 lg:grid-cols-[1fr_300px]">
      <ul className="grid gap-1 sm:grid-cols-2">
        {site.loans.map((loan) => (
          <li key={loan.slug}>
            <Link href={`/krediti/${loan.slug}`} className={tile("p-4")} data-menu-item="loans">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-petrol text-white">
                <Icon name={loanIcons[loan.slug]} />
              </span>
              <span>
                <span className="block font-head text-lg leading-tight font-extrabold tracking-[-0.02em]">
                  {loan.name}
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted">{loan.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between gap-6 rounded-tile bg-petrol p-6 text-white">
        <div>
          <p className="font-head text-xl leading-tight font-extrabold tracking-[-0.02em]">
            {site.loansMenuAside.title}
          </p>
          <p className="mt-2 text-sm text-mist">{site.loansMenuAside.text}</p>
        </div>
        <div className="grid gap-3">
          <Link
            href={site.consultation.href}
            className={buttonClasses("light", undefined, "compact")}
            data-menu-item="loans"
          >
            {site.consultation.label}
          </Link>
          <Link
            href="/krediti"
            className="py-2 text-center text-sm font-semibold text-white underline-offset-4 hover:underline"
            data-menu-item="loans"
          >
            Всички кредити
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Калкулатори dropdown content (NAV-4). Fee calculators stay out until released (O-12). */
export function CalculatorsPanel() {
  return (
    <div className="p-3">
      <ul className="grid gap-0.5">
        {site.calculators
          .filter((calc) => calc.available)
          .map((calc) => (
            <li key={calc.slug}>
              <Link
                href={`/kalkulatori/${calc.slug}`}
                className={tile("p-3")}
                data-menu-item="calculators"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-petrol">
                  <Icon name="calculator" />
                </span>
                <span>
                  <span className="block font-semibold">{calc.name}</span>
                  <span className="block text-sm leading-snug text-muted">{calc.hint}</span>
                </span>
              </Link>
            </li>
          ))}
      </ul>
      <Link
        href="/kalkulatori"
        className="mt-2 flex min-h-11 items-center justify-between rounded-tile px-4 text-sm font-semibold no-underline hover:bg-ink/5"
        data-menu-item="calculators"
      >
        Всички калкулатори
        <Icon name="arrow" className="size-4" />
      </Link>
    </div>
  );
}
