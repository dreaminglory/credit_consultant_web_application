import { coverage } from "@/content/home";
import { CoverageMap } from "@/components/blocks/CoverageMap";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Coverage: Plovdiv → all Bulgaria → abroad (B-09, CV-1…3). Also used on /konsultacia, /kontakti. */
export function Coverage() {
  return (
    <Section id={coverage.anchor}>
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader
            label={coverage.label}
            title={coverage.title}
            titleClassName="text-[clamp(32px,3.8vw,54px)]"
          />
          <p className="mt-6 max-w-[58ch] text-lg text-muted">{coverage.intro}</p>
          <ul className="mt-8 grid gap-5">
            {coverage.points.map((point) => (
              <li key={point.title} className="border-l-2 border-gold pl-5">
                <strong className="block font-head text-xl leading-tight font-extrabold tracking-[-0.02em]">
                  {point.title}
                </strong>
                <span className="mt-1 block text-muted">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <CoverageMap />
      </Container>
    </Section>
  );
}
