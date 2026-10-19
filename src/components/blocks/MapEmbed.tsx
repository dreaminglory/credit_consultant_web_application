"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { mapCopy } from "@/content/contact";
import { cn } from "@/lib/cn";
import type { MapLinks } from "@/lib/map";

/** Streets of the stylised preview: a loose grid with two diagonal boulevards (viewBox 800×500). */
const streets = [
  "M-20 120 C 180 110, 420 140, 820 100",
  "M-20 300 C 200 290, 520 320, 820 280",
  "M-20 420 C 260 430, 560 400, 820 440",
  "M140 -20 C 150 160, 120 340, 160 520",
  "M330 -20 C 340 180, 360 330, 340 520",
  "M560 -20 C 540 160, 580 360, 560 520",
  "M700 -20 C 690 200, 720 320, 700 520",
  "M-20 520 L 820 -20",
  "M60 -20 L 760 520",
];

/**
 * Click-to-load office map (B-18, FR-27, BM-8). Until the visitor asks for it, the page shows an
 * in-house SVG sketch and makes no request to Google; the keyless embed loads only on click.
 */
type MapEmbedProps = {
  links: MapLinks;
  /** Shown next to the pin in the preview, e.g. the street address. */
  pinLabel: string;
  className?: string;
};

export function MapEmbed({ links, pinLabel, className }: MapEmbedProps) {
  const [clicked, setClicked] = useState(false);
  const { consent } = useConsent();
  // Consent to external content (B-22) loads the map at once; otherwise it waits for the click.
  const live = clicked || consent?.media === true;
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The button disappears with the click: hand keyboard focus to the map instead of the body.
  useEffect(() => {
    if (clicked) frameRef.current?.focus();
  }, [clicked]);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-sand md:aspect-[16/10]",
        className,
      )}
    >
      {live ? (
        <iframe
          ref={frameRef}
          src={links.embed}
          title={mapCopy.iframeTitle}
          loading="lazy"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <>
          <svg
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={mapCopy.previewLabel}
            className="absolute inset-0 size-full"
          >
            {/* A river band along the top, like the Maritsa north of the centre. */}
            <path
              d="M-20 60 C 160 30, 320 90, 480 50 S 720 20, 820 50 L 820 -20 L -20 -20 Z"
              className="fill-sea/30"
            />
            {streets.map((d) => (
              <path
                key={d}
                d={d}
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"
                className="stroke-paper"
              />
            ))}
            <path
              d="M330 -20 C 340 180, 360 330, 340 520"
              fill="none"
              strokeWidth="6"
              className="stroke-petrol/30"
            />
            <circle cx="400" cy="250" r="26" className="pin-pulse fill-gold" />
            <circle cx="400" cy="250" r="14" className="fill-gold stroke-white" strokeWidth="5" />
          </svg>
          <p
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 ml-6 -translate-y-1/2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-ink shadow-float max-sm:top-[calc(50%+40px)] max-sm:-translate-x-1/2 max-sm:ml-0"
          >
            {pinLabel}
          </p>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 bg-linear-to-t from-ink/70 to-transparent p-5 pt-16 text-white sm:flex-row sm:items-end sm:justify-between md:p-7">
            <p className="max-w-[34ch] text-[15px] text-mist">{mapCopy.note}</p>
            <Button variant="light" onClick={() => setClicked(true)}>
              <Icon name="home" className="size-[18px]" />
              {mapCopy.show}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
