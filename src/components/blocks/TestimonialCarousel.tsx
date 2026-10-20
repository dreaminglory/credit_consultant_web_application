"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { RoundButton } from "@/components/ui/RoundButton";
import { cn } from "@/lib/cn";
import { nearestIndex, wrapIndex } from "@/lib/carousel";
import { useMediaQuery } from "@/lib/useMediaQuery";

/** Time each slide stays before the slow auto-advance moves on (FR-25). */
const INTERVAL_MS = 7000;

/** Scrolls slide `index` to the snap position of the track, respecting its scroll padding. */
function scrollToSlide(track: HTMLElement, index: number, smooth: boolean) {
  const slide = track.children[index] as HTMLElement | undefined;
  if (!slide) return;
  const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
  const target = Math.min(slide.offsetLeft - padding, track.scrollWidth - track.clientWidth);
  const from = track.scrollLeft;
  clearTimeout(animation.get(track));
  if (!smooth || Math.abs(target - from) < 2) {
    track.scrollLeft = target;
    return;
  }
  // Own timer-driven animation instead of `behavior: "smooth"`, which some browsers silently ignore.
  // Snapping is switched off while it runs, otherwise it fights every frame.
  const start = performance.now();
  track.style.scrollSnapType = "none";
  const step = () => {
    const t = Math.min((performance.now() - start) / SCROLL_MS, 1);
    track.scrollLeft = from + (target - from) * (1 - Math.pow(1 - t, 3));
    if (t < 1) {
      animation.set(track, window.setTimeout(step, 16));
    } else {
      track.style.scrollSnapType = "";
      animation.delete(track);
    }
  };
  step();
}

const SCROLL_MS = 450;
const animation = new WeakMap<HTMLElement, number>();

type TestimonialCarouselProps = {
  /** Server-rendered slide contents, one per testimonial. */
  slides: ReactNode[];
  label: string;
};

const text = {
  prev: "Предишен отзив",
  next: "Следващ отзив",
  pause: "Пауза",
  play: "Пусни",
  dots: "Избор на отзив",
  slide: "слайд",
  carousel: "карусел",
};

/**
 * Testimonial carousel (B-10, FR-25): native scroll-snap track (swipe), arrows, dots, keyboard,
 * slow auto-advance that pauses while the slides are hovered or focused (not the controls, so
 * "Пусни" always resumes), stops for good once the visitor takes control,
 * has a visible pause button, and never runs with reduced motion.
 */
export function TestimonialCarousel({ slides, label }: TestimonialCarouselProps) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  /** True after arrows, dots, keys or auto-advance move the track; scroll position no longer decides the slide. */
  const manual = useRef(false);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    // The last slides cannot reach the snap position, so the scroll offset alone cannot tell
    // which slide was asked for. Remember it, and let a real swipe or wheel hand control back.
    const next = wrapIndex(target, count);
    manual.current = true;
    indexRef.current = next;
    setIndex(next);
    scrollToSlide(track, next, motionOk);
  };
  /** Any deliberate use of the controls ends auto-advance until "Пусни" is pressed. */
  const take = (target: number) => {
    setPlaying(false);
    goTo(target);
  };

  // Keep the dots in step with the track, however it was scrolled (swipe, keys, arrows).
  const onScroll = () => {
    if (manual.current || frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const track = trackRef.current;
      if (!track) return;
      const padding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
      const offsets = Array.from(track.children, (el) => (el as HTMLElement).offsetLeft - padding);
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const next = nearestIndex(offsets, track.scrollLeft, atEnd);
      indexRef.current = next;
      setIndex(next);
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number | undefined> = {
      ArrowRight: indexRef.current + 1,
      ArrowLeft: indexRef.current - 1,
      Home: 0,
      End: count - 1,
    };
    const target = keys[event.key];
    if (target === undefined) return;
    event.preventDefault();
    take(target);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const auto = motionOk && playing && !hovered && !focused && inView && count > 1;
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = wrapIndex(indexRef.current + 1, count);
      manual.current = true;
      indexRef.current = next;
      setIndex(next);
      scrollToSlide(track, next, true);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [auto, count]);

  return (
    <div
      role="region"
      aria-roledescription={text.carousel}
      aria-label={label}
      className="[--carousel-gutter:max(20px,calc((100vw-1240px)/2+20px))]"
    >
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label={label}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          manual.current = false;
          if (e.pointerType === "touch") setPlaying(false);
        }}
        onWheel={() => {
          manual.current = false;
        }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="carousel-track relative flex gap-5 overflow-x-auto overscroll-x-contain py-2"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription={text.slide}
            aria-label={`${i + 1} / ${count}`}
            className="w-[88%] shrink-0 snap-start md:w-[min(78%,900px)]"
          >
            {slide}
          </div>
        ))}
        {/* Trailing space so the last slide can reach the snap position. */}
        <div aria-hidden="true" className="w-px shrink-0" />
      </div>

      {count > 1 && (
        <div className="mx-auto mt-8 flex max-w-site flex-wrap items-center justify-between gap-4 px-5">
          <div role="group" aria-label={text.dots} className="flex">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1} / ${count}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => take(i)}
                className="grid h-11 w-6 cursor-pointer place-items-center"
              >
                <span
                  className={cn(
                    "block h-2.5 rounded-full transition-[width,background-color] duration-250 ease-out-soft",
                    i === index ? "w-7 bg-ink" : "w-2.5 bg-ink/25",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {motionOk && (
              <Button variant="line" size="compact" onClick={() => setPlaying((p) => !p)}>
                {playing ? text.pause : text.play}
              </Button>
            )}
            <RoundButton tone="dark" label={text.prev} onClick={() => take(indexRef.current - 1)}>
              ←
            </RoundButton>
            <RoundButton tone="dark" label={text.next} onClick={() => take(indexRef.current + 1)}>
              →
            </RoundButton>
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {playing && motionOk ? "" : `${index + 1} / ${count}`}
      </p>
    </div>
  );
}
