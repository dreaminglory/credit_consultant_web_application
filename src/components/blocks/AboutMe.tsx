import Link from "next/link";
import { site } from "@/config/site";
import { about } from "@/content/home";
import { KeyNumbers } from "@/components/blocks/KeyNumbers";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Label";
import { Picture } from "@/components/ui/Picture";
import { Value } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** About me (B-19): full Home section — portrait, story, how I work, real numbers (B-20). */
export function AboutMe() {
  return (
    <Section id={about.anchor} tone="white">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Picture
            name="desislava-teal-suit-notebook"
            alt={`${site.person.name} с бележник в офис сграда`}
            width={799}
            height={1201}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 420px, 100vw"
            className="mx-auto aspect-[4/5] max-w-[480px] rounded-card object-[50%_20%]"
          />
        </Reveal>

        <div>
          <Label>{about.label}</Label>
          <h2 className="mt-3.5 text-[clamp(36px,4.6vw,64px)]">{about.title}</h2>
          <p className="mt-6 max-w-[58ch] text-xl">
            <Value value={about.story} />
          </p>

          <h3 className="mt-10 text-xl">{about.principlesTitle}</h3>
          <ul className="mt-4 grid gap-4">
            {about.principles.map((principle) => (
              <li key={principle.title} className="grid grid-cols-[28px_1fr] gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-7 place-items-center rounded-full bg-sea text-sm font-bold text-white"
                >
                  ✓
                </span>
                <p>
                  <strong className="block font-semibold">{principle.title}</strong>
                  <span className="text-muted">{principle.text}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <KeyNumbers />
          </div>

          <Link href={about.cta.href} className={buttonClasses("line", "mt-8")}>
            {about.cta.label}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
