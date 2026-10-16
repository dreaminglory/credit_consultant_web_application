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
  /** Optional key facts or actions under the intro. */
  children?: ReactNode;
};

/**
 * Inner page hero (B-03): breadcrumbs, mono label, the page's h1, intro and a soft gradient.
 * Static HTML + CSS only (HP-1); the sticky header floats over it like on Home.
 */
export function PageHero({ breadcrumbs, label, title, intro, children }: PageHeroProps) {
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
        {children}
      </Container>
    </Section>
  );
}
