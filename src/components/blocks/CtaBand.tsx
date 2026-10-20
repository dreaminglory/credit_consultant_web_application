import Link from "next/link";
import { site } from "@/config/site";
import { cta } from "@/content/home";
import { leadSection } from "@/content/lead";
import { ContactActions } from "@/components/blocks/ContactActions";
import { ButtonArrow, buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * CTA band (B-14): closes a page with the consultation button and direct contacts (FR-23). The
 * button lands on the form itself: pass `href` on pages that already contain the form.
 */
export function CtaBand({ href }: { href?: string }) {
  return (
    <Section tone="ink">
      <Mesh tone="dark" />
      <Container>
        <Reveal className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <figure className="mb-8 max-w-[40ch] border-l-2 border-gold pl-5">
              <blockquote className="font-head text-xl leading-snug font-semibold tracking-[-0.02em] text-white italic">
                <p>„{cta.quote.text}“</p>
              </blockquote>
              <figcaption className="mt-3">
                <Label className="text-gold opacity-100">{cta.quote.author}</Label>
              </figcaption>
            </figure>
            <h2 className="text-[clamp(36px,5vw,68px)]">{cta.title}</h2>
            <p className="mt-6 max-w-[52ch] text-lg text-mist">{cta.text}</p>
          </div>
          <div className="grid gap-4">
            <Link
              href={href ?? `${site.consultation.href}#${leadSection.formAnchor}`}
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
