import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Section } from "@/components/ui/Section";

type PageHeroProps = {
  breadcrumbs: Crumb[];
  label: string;
  title: string;
  intro: string;
  /** Key facts shown as chips under the intro (loan pages). */
  facts?: readonly string[];
  /** Optional actions under the intro. */
  children?: ReactNode;
};

/**
 * Inner page hero (B-03): breadcrumbs, mono label, the page's h1, intro and a soft gradient.
 * Static HTML + CSS only (HP-1); the sticky header floats over it like on Home.
 */
export function PageHero({ breadcrumbs, label, title, intro, facts, children }: PageHeroProps) {
  return (
    <Section className="-mt-[88px] overflow-hidden pt-[128px] pb-14 md:pt-[148px] md:pb-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-50">
        <Mesh />
      </div>
      <Container>
        <Breadcrumbs items={breadcrumbs} className="enter" />
        <Label className="enter mt-8">{label}</Label>
        <h1 className="enter mt-4 max-w-[18ch] text-[clamp(40px,6.4vw,88px)]">{title}</h1>
        <p className="enter mt-6 max-w-[60ch] text-lg opacity-85 md:text-xl">{intro}</p>
        {facts && facts.length > 0 && (
          <ul aria-label="Накратко" className="enter mt-8 flex flex-wrap gap-2">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-white/70 bg-white/55 px-3.5 py-2.5 font-mono text-xs leading-none font-medium tracking-[0.05em] uppercase"
              >
                {fact}
              </li>
            ))}
          </ul>
        )}
        {children}
      </Container>
    </Section>
  );
}
