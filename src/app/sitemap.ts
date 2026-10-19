import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { sitemapPaths } from "@/lib/sitemap";

/** `/sitemap.xml` (TR-8), generated at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths(site).map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/krediti") ? 0.8 : 0.6,
  }));
}
