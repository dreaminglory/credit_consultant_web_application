import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { termsPage } from "@/content/legal";
import { LegalTemplate } from "@/components/templates/LegalTemplate";

export const metadata: Metadata = pageMetadata({
  title: termsPage.title,
  description: termsPage.description,
  path: "/obshti-usloviya",
});

/** Terms of use and legal information (T6, LC-3). Draft until lawyer review (O-14). */
export default function TermsPage() {
  return <LegalTemplate doc={termsPage} />;
}
