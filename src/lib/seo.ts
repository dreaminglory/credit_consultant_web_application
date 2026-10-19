import type { Metadata } from "next";
import { site } from "@/config/site";

/** Open Graph defaults shared by every page (TR-8); the share image is built by `npm run images`. */
export const baseOpenGraph = {
  type: "website",
  locale: "bg_BG",
  siteName: `${site.brand.name} · ${site.person.name}`,
  images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: site.brand.tagline }],
} satisfies Metadata["openGraph"];

/**
 * Title, description, canonical URL and Open Graph for one page. Next merges metadata shallowly,
 * so a page's `openGraph` must repeat the shared defaults — this keeps them in one place.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title, description, url: path },
  };
}
