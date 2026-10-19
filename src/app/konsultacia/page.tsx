import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FormTemplate } from "@/components/templates/FormTemplate";
import { consultationPage } from "@/content/lead";

export const metadata: Metadata = pageMetadata({
  title: consultationPage.title,
  description: consultationPage.description,
  path: "/konsultacia",
});

/** Free consultation (T5, FR-1…7): the full form variant. */
export default function ConsultationPage() {
  return <FormTemplate />;
}
