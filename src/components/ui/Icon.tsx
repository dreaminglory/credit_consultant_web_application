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
  chat: "M5 6h14v9.5h-8.5L6.5 19v-3.5H5zM9 10h6",
  compare: "M4 19.5h16M7 19.5v-6M12 19.5v-12M17 19.5v-9",
  badge: "M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM8.5 12.2l2.4 2.4 4.6-4.9",
  document: "M7 3.5h7l4 4v13H7zM14 3.5v4h4M9.5 12h6M9.5 15.5h6",
  shield: "M12 3.5 5.5 6v5.5c0 4 2.7 7.2 6.5 9 3.8-1.8 6.5-5 6.5-9V6zM9 12l2.2 2.2L15.5 10",
  pen: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  /** Paint roller. */
  roller: "M5 4.5h11v4H5zM16 6.5h2.5V11H11v2.5M9 13.5h3.5V20H9z",
  /** Brick wall. */
  bricks: "M4 6h16v4H4zM4 10h7v4H4zM11 10h9v4h-9zM4 14h16v4H4zM11 6v4M7.5 14v4M15.5 14v4",
  support: "M12 19.5s-7-4.3-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.3c0 4.9-7 9.2-7 9.2z",
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
