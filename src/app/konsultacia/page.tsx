import type { Metadata } from "next";
import { FormTemplate } from "@/components/templates/FormTemplate";
import { consultationPage } from "@/content/lead";

export const metadata: Metadata = {
  title: consultationPage.title,
  description: consultationPage.description,
  alternates: { canonical: "/konsultacia" },
};

/** Free consultation (T5, FR-1…7): the full form variant. */
export default function ConsultationPage() {
  return <FormTemplate />;
}
