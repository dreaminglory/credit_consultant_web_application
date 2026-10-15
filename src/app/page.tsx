import { site } from "@/config/site";
import { ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Picture } from "@/components/ui/Picture";
import { Section } from "@/components/ui/Section";

// Temporary Home until M3 builds the flagship page (REQUIREMENTS §4.3).
export default function HomePage() {
  return (
    <main>
      <Section className="flex min-h-svh items-center">
        <Mesh />
        <Container className="grid items-end gap-12 md:grid-cols-[1.25fr_0.75fr]">
          <div>
            <Label>
              {site.person.role} · {site.office.city}
            </Label>
            <h1 className="mt-5">Аз намирам кредита. Вие получавате ключовете.</h1>
            <p className="mt-7 max-w-[58ch] text-xl opacity-85">
              Сайтът се изгражда. Основата е готова — следва началната страница.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/dev/kit" variant="dark">
                Виж дизайн системата <ButtonArrow />
              </ButtonLink>
            </div>
          </div>
          <GlassCard className="max-w-[420px] p-3.5">
            <Picture
              name="desislava-teal-suit"
              alt={site.person.name}
              width={799}
              height={1201}
              sizes="(min-width: 768px) 420px, 100vw"
              priority
              className="aspect-[4/5] rounded-tile"
            />
            <div className="px-2 pt-4 pb-1.5">
              <p className="font-head text-xl font-extrabold tracking-[-0.02em]">
                {site.person.name}
              </p>
              <p className="text-sm text-muted">{site.brand.name}</p>
            </div>
          </GlassCard>
        </Container>
      </Section>
    </main>
  );
}
