import Link from "next/link";
import { site } from "@/config/site";
import { cta } from "@/content/home";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mesh } from "@/components/ui/Mesh";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** CTA band (B-14): closes a page with the consultation button and direct contacts (FR-23). */
export function CtaBand() {
  return (
    <Section tone="ink">
      <Mesh tone="dark" />
      <Container>
        <Reveal className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-[clamp(36px,5vw,68px)]">{cta.title}</h2>
            <p className="mt-6 max-w-[52ch] text-lg text-mist">{cta.text}</p>
          </div>
          <div className="grid gap-4">
            <Link
              href={site.consultation.href}
              className={buttonClasses("gold", "justify-self-start")}
            >
              {site.consultation.label} <ButtonArrow />
            </Link>
            <ContactActions variant="line-light" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
