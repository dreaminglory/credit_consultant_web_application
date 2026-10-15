import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Line icons (24 px grid, 1.75 stroke) drawn for this site; no icon library (dependency rule). */
const paths = {
  home: "M4 11.5 12 5l8 6.5M6.5 10v9h11v-9M10 19v-5h4v5",
  refresh: "M19 8a7.5 7.5 0 0 0-13.2-1.5M5 4v3.5h3.5M5 16a7.5 7.5 0 0 0 13.2 1.5M19 20v-3.5h-3.5",
  briefcase: "M4 8.5h16v10H4zM9 8.5V6h6v2.5M4 13h16",
  wallet: "M4 7.5h14.5v11H4zM4 7.5l12-3v3M15 13h3.5",
  calculator:
    "M6.5 3.5h11v17h-11zM9 7h6M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M12 14.5h.01M15 14.5h.01M9 18h.01M12 18h6",
  chevron: "m7 10 5 5 5-5",
  menu: "M4 8h16M4 16h16",
  close: "m6 6 12 12M18 6 6 18",
  phone:
    "M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2z",
  arrow: "M5 12h14m-5-5 5 5-5 5",
} as const;

export type IconName = keyof typeof paths;

type IconProps = Omit<ComponentProps<"svg">, "children"> & { name: IconName };

/** 20 px unless `className` sets a `size-*`. Decorative by default (`aria-hidden`); pair with visible text or an aria-label on the parent. */
export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(!className?.includes("size-") && "size-5", className)}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
