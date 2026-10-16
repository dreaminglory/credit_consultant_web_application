import { stubs } from "@/content/home";
import { AboutMe } from "@/components/blocks/AboutMe";
import { BankLogos } from "@/components/blocks/BankLogos";
import { CalculatorHub } from "@/components/blocks/CalculatorHub";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ContactStrip } from "@/components/blocks/ContactStrip";
import { Coverage } from "@/components/blocks/Coverage";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Faq } from "@/components/blocks/Faq";
import { HomeHero } from "@/components/blocks/HomeHero";
import { LoanCards } from "@/components/blocks/LoanCards";
import { ProcessTimeline } from "@/components/blocks/ProcessTimeline";
import { PromiseStrip } from "@/components/blocks/PromiseStrip";
import { SectionStub } from "@/components/blocks/SectionStub";
import { Testimonials } from "@/components/blocks/Testimonials";
import { WhySplit } from "@/components/blocks/WhySplit";

/**
 * Home (T1), sections in the order of REQUIREMENTS §4.3. Static blocks (M3) and the process,
 * reviews and FAQ (M4) and the calculator hub (M5) are final; the form (M6) is a stub until then.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PromiseStrip />
      <LoanCards />
      <AboutMe />
      <WhySplit />
      <ProcessTimeline />
      <BankLogos />
      <Testimonials />
      <Coverage />
      <CtaBand />
      <CalculatorHub />
      <Faq />
      <SectionStub {...stubs.form} tone="ink">
        <ContactActions variant="line-light" className="mt-8 flex flex-wrap gap-3" />
      </SectionStub>
      <ContactStrip />
    </>
  );
}
