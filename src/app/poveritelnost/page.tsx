import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { privacyPolicy } from "@/content/legal";
import { LegalTemplate } from "@/components/templates/LegalTemplate";

export const metadata: Metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: "/poveritelnost",
});

/** Privacy policy (T6, LC-1). Draft until lawyer review (O-14). */
export default function PrivacyPage() {
  return <LegalTemplate doc={privacyPolicy} />;
}
