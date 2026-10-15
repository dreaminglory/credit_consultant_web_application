"use client";

import { useEffect, useRef, type ComponentProps } from "react";

type RevealProps = ComponentProps<"div"> & {
  /** Stagger delay in ms, for sibling items revealed together. */
  delay?: number;
};

/**
 * Fades and lifts its content in once it scrolls into view (DR-4).
 * Hidden state is CSS-only and applies only when scripting is enabled; reduced motion shows
 * content immediately. Use sparingly — one orchestrated reveal per section, not every card.
 */
export function Reveal({ delay = 0, style, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...props}
    />
  );
}
