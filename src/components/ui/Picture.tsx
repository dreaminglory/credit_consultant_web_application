import { cn } from "@/lib/cn";

/** Widths produced by scripts/optimize-images.mjs. */
const WIDTHS = [400, 640, 800] as const;

type PictureProps = {
  /** Base name in /public/img, e.g. "desislava-teal-suit". */
  name: string;
  alt: string;
  /** Intrinsic aspect ratio of the source, to reserve space and avoid layout shift. */
  width: number;
  height: number;
  sizes: string;
  /** Above-the-fold images load eagerly with high priority (LCP). */
  priority?: boolean;
  className?: string;
};

/** Responsive AVIF/WebP image from the build-time pipeline (A-8, TR-7). */
export function Picture({ name, alt, width, height, sizes, priority, className }: PictureProps) {
  const srcSet = (ext: string) => WIDTHS.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        src={`/img/${name}-640.webp`}
        srcSet={srcSet("webp")}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cn("h-auto w-full object-cover", className)}
      />
    </picture>
  );
}
