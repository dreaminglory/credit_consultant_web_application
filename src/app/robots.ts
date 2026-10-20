import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { robotsRules } from "@/lib/seo";

/** `/robots.txt` (TR-8); blocks all crawling until launch (`site.allowIndexing`). */
export default function robots(): MetadataRoute.Robots {
  return robotsRules(site.allowIndexing, site.url);
}
