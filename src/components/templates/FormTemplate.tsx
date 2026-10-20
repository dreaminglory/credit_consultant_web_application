import { promises } from "@/content/home";
import { faqCategories } from "@/content/faq";
import { consultationPage, leadSection } from "@/content/lead";
import { ContactActions } from "@/components/blocks/ContactActions";
import { Coverage } from "@/components/blocks/Coverage";
import { Faq } from "@/components/blocks/Faq";
import { LeadCard } from "@/components/blocks/lead/LeadCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Section } from "@/components/ui/Section";

/** Questions people ask before they send a request: the service and my registration. */
const miniFaq = faqCategories.filter((c) => c.id === "usluga" || c.id === "registratsia");

/**
 * Form page (T5): split hero with promises + the full consultation form (B-17) → coverage
 * (B-09) → mini FAQ (B-13).
 */
export function FormTemplate() {
  return (
    <>
      <Section className="-mt-[88px] overflow-hidden pt-[128px] md:pt-[148px]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50">
          <Mesh />
        </div>
        <Container className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <Breadcrumbs items={[{ label: consultationPage.label }]} className="enter" />
            <Label className="enter mt-8">{consultationPage.label}</Label>
            <h1 className="enter mt-4 text-[clamp(40px,5.6vw,80px)]">{consultationPage.heading}</h1>
            <p className="enter mt-6 max-w-[52ch] text-lg opacity-85">{consultationPage.intro}</p>
            <ul className="mt-8 grid gap-4">
              {promises.map((item) => (
                <li key={item.title} className="border-l-2 border-gold pl-4">
                  <strong className="block font-semibold">{item.title}</strong>
                  <span className="block text-[15px] text-muted">{item.text}</span>
                </li>
              ))}
            </ul>
            <ContactActions variant="line" className="mt-8" />
          </div>
          <LeadCard id={leadSection.formAnchor} variant="full" productFromUrl className="enter" />
        </Container>
      </Section>
      <Coverage />
      <Faq categories={miniFaq} />
    </>
  );
}
