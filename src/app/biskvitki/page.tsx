import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { cookiePolicy } from "@/content/legal";
import { LegalTemplate } from "@/components/templates/LegalTemplate";

export const metadata: Metadata = pageMetadata({
  title: cookiePolicy.title,
  description: cookiePolicy.description,
  path: "/biskvitki",
});

/** Cookie policy (T6, LC-2). Draft until lawyer review (O-14). */
export default function CookiesPage() {
  return <LegalTemplate doc={cookiePolicy} />;
}
