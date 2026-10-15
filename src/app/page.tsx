import { stubs } from "@/content/home";
import { AboutMe } from "@/components/blocks/AboutMe";
import { BankLogos } from "@/components/blocks/BankLogos";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ContactStrip } from "@/components/blocks/ContactStrip";
import { Coverage } from "@/components/blocks/Coverage";
import { CtaBand } from "@/components/blocks/CtaBand";
import { HomeHero } from "@/components/blocks/HomeHero";
import { LoanCards } from "@/components/blocks/LoanCards";
import { PromiseStrip } from "@/components/blocks/PromiseStrip";
import { SectionStub } from "@/components/blocks/SectionStub";
import { WhySplit } from "@/components/blocks/WhySplit";

/**
 * Home (T1), sections in the order of REQUIREMENTS §4.3. Static blocks are final (M3); the
 * interactive ones are stubs until M4 (process, reviews, FAQ), M5 (calculators), M6 (form).
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PromiseStrip />
      <LoanCards />
      <AboutMe />
      <WhySplit />
      <SectionStub {...stubs.process} tone="petrol" />
      <BankLogos />
      <SectionStub {...stubs.testimonials} tone="sand" />
      <Coverage />
      <CtaBand />
      <SectionStub {...stubs.calculators} tone="white" />
      <SectionStub {...stubs.faq} />
      <SectionStub {...stubs.form} tone="ink">
        <ContactActions variant="line-light" className="mt-8 flex flex-wrap gap-3" />
      </SectionStub>
      <ContactStrip />
    </>
  );
}
