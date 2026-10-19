import type { Metadata } from "next";
import { ContactCard } from "@/components/blocks/ContactCard";
import { Coverage } from "@/components/blocks/Coverage";
import { ConsultationSection } from "@/components/blocks/lead/ConsultationSection";
import { PageHero } from "@/components/blocks/PageHero";
import { contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: contactPage.title,
  description: contactPage.intro,
  alternates: { canonical: "/kontakti" },
};

/** Contacts (T4, FR-26, FR-27): hero → contact card + click-to-load map (B-18) → coverage (B-09) → form (the closing CTA). */
export default function ContactsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: contactPage.label }]}
        label={contactPage.label}
        title={contactPage.title}
        intro={contactPage.intro}
      />
      <ContactCard />
      <Coverage />
      <ConsultationSection />
    </>
  );
}
