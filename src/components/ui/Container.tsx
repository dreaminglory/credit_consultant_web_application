import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Centered content column: 1240 px max, 20 px side gutters. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-site px-5", className)} {...props} />;
}
