import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** `/robots.txt` (TR-8): everything public is crawlable; the API, thank-you and dev pages are not. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/blagodarim", "/dev/"] },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
