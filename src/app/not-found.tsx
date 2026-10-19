import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Section } from "@/components/ui/Section";
import { notFoundPage } from "@/content/contact";

export const metadata: Metadata = {
  title: notFoundPage.title,
  robots: { index: false },
};

/** 404 (T4): hero → where to go next → CTA band. Also shown for unreleased calculators (O-12). */
export default function NotFound() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: notFoundPage.label }]}
        label={notFoundPage.label}
        title={notFoundPage.title}
        intro={notFoundPage.intro}
      >
        <div className="enter mt-8 flex flex-wrap gap-3">
          <ButtonLink href={site.consultation.href}>
            {site.consultation.label} <ButtonArrow />
          </ButtonLink>
          <ButtonLink href="/" variant="line">
            {notFoundPage.home}
          </ButtonLink>
        </div>
      </PageHero>
      <Section tone="white">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {notFoundPage.links.map((link) => (
              <li key={link.href}>
                <GlassCard className="group relative flex h-full flex-col gap-3 bg-white/85 p-7 transition-[translate,box-shadow] duration-250 ease-out-soft focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-float">
                  <h2 className="text-[28px]">
                    <Link
                      href={link.href}
                      className="no-underline after:absolute after:inset-0 after:rounded-card after:content-['']"
                    >
                      {link.title}
                    </Link>
                  </h2>
                  <p className="text-muted">{link.text}</p>
                  <span
                    aria-hidden="true"
                    className="mt-auto grid size-10 place-items-center rounded-full bg-ink text-white transition-transform duration-150 ease-out-soft group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </GlassCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
