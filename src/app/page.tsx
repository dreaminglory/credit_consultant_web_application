import { AboutMe } from "@/components/blocks/AboutMe";
import { BankLogos } from "@/components/blocks/BankLogos";
import { CalculatorHub } from "@/components/blocks/CalculatorHub";
import { ContactStrip } from "@/components/blocks/ContactStrip";
import { Coverage } from "@/components/blocks/Coverage";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Faq } from "@/components/blocks/Faq";
import { ConsultationSection } from "@/components/blocks/lead/ConsultationSection";
import { HomeHero } from "@/components/blocks/HomeHero";
import { LoanCards } from "@/components/blocks/LoanCards";
import { ProcessTimeline } from "@/components/blocks/ProcessTimeline";
import { PromiseStrip } from "@/components/blocks/PromiseStrip";
import { Testimonials } from "@/components/blocks/Testimonials";
import { WhySplit } from "@/components/blocks/WhySplit";

/**
 * Home (T1), sections in the order of REQUIREMENTS §4.3, ending with the compact consultation
 * form (B-17) and the contact strip.
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
      <ConsultationSection />
      <ContactStrip />
    </>
  );
}
