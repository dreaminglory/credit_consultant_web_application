import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { LogoMark } from "@/components/brand/Logo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button, ButtonArrow, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Label } from "@/components/ui/Label";
import { Mesh } from "@/components/ui/Mesh";
import { Picture } from "@/components/ui/Picture";
import { PlaceholderBox, Value } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { RoundButton } from "@/components/ui/RoundButton";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Wordmark } from "@/components/ui/Wordmark";

// Internal review page for the design system (M1). Development only: production builds 404 it.
export const metadata: Metadata = {
  title: "Design kit",
  robots: { index: false, follow: false },
};

const swatches = [
  ["ink", "bg-ink text-white"],
  ["petrol", "bg-petrol text-white"],
  ["sea", "bg-sea text-white"],
  ["sand", "bg-sand"],
  ["paper", "bg-paper border border-line"],
  ["gold", "bg-gold"],
  ["muted", "bg-muted text-white"],
  ["mist", "bg-mist"],
] as const;

const tones: SectionTone[] = ["paper", "white", "sand", "ink", "petrol"];

export default function KitPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <Section className="pt-8">
        <Mesh />
        <Container>
          <Breadcrumbs
            items={[{ label: "Кредити", href: "/krediti" }, { label: "Design kit" }]}
            className="mb-6"
          />
          <GlassCard className="p-6 md:p-10">
            <Label>Design kit · M1 + M2 layout shell</Label>
            <h1 className="mt-4">Аз намирам кредита. Вие получавате ключовете.</h1>
            <p className="mt-6 max-w-[58ch] text-lg text-muted">
              Вътрешна страница за преглед на токените и базовите компоненти. Не е част от сайта.
            </p>
          </GlassCard>
        </Container>
      </Section>

      <Section tone="white">
        <Container className="grid gap-12">
          <div>
            <Label>Цветове</Label>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {swatches.map(([name, cls]) => (
                <div key={name} className={`rounded-tile p-4 font-mono text-sm ${cls}`}>
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Типография</Label>
            <h1 className="mt-6">Заглавие H1</h1>
            <h2 className="mt-4">Една среща вместо десет банки.</h2>
            <h3 className="mt-4">Подзаглавие H3 — предварително одобрение</h3>
            <p className="mt-4 max-w-[62ch]">
              Обсъждаме вашите цели, доходи и задължения и определяме реалистичните параметри на
              кредита. Основен текст с шрифт Onest, 17 px.
            </p>
          </div>

          <div>
            <Label>Бутони</Label>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href="/" variant="dark">
                Безплатна консултация <ButtonArrow />
              </ButtonLink>
              <ButtonLink href="/" variant="line">
                Изчислете вноската
              </ButtonLink>
              <Button variant="gold">
                Изпратете заявката <ButtonArrow />
              </Button>
              <Button variant="dark" disabled>
                Изпращане…
              </Button>
              <RoundButton label="Назад">←</RoundButton>
              <RoundButton label="Напред" tone="dark">
                →
              </RoundButton>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ink">
        <Mesh tone="dark" />
        <Container className="grid gap-6 md:grid-cols-2">
          <GlassCard tone="dark" className="p-8">
            <Label>Стъпка 03</Label>
            <h3 className="mt-4">Предварително одобрение</h3>
            <p className="mt-3 text-mist">
              Подготвям и подавам искането в избраната банка и следя процеса.
            </p>
          </GlassCard>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/" variant="gold">
              Безплатна консултация <ButtonArrow />
            </ButtonLink>
            <ButtonLink href="/" variant="light">
              Обадете се
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {tones.map((tone) => (
        <Section key={tone} tone={tone} className="py-10 md:py-12">
          <Container>
            <Label>Section tone: {tone}</Label>
          </Container>
        </Section>
      ))}

      <Section tone="paper">
        <Container className="grid gap-10 md:grid-cols-3">
          {[
            ["desislava-teal-suit", "Десислава Арабаджиева в тюркоазен костюм"],
            ["desislava-teal-suit-notebook", "Десислава Арабаджиева с бележник"],
            ["desislava-phone-call", "Десислава Арабаджиева разговаря по телефона"],
          ].map(([name, alt], i) => (
            <Reveal key={name} delay={i * 120}>
              <GlassCard className="p-3.5">
                <Picture
                  name={name}
                  alt={alt}
                  width={800}
                  height={1200}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-[4/5] rounded-tile"
                />
                <p className="px-2 pt-4 pb-1 font-mono text-xs">{name}</p>
              </GlassCard>
            </Reveal>
          ))}
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Label>Банки (BL-1) — сиво, цвят при посочване</Label>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {site.banks.map((bank) => (
              <li
                key={bank.id}
                className="grid aspect-video place-items-center rounded-tile border border-line bg-white p-5 grayscale transition-[filter] duration-200 hover:grayscale-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static SVG logo */}
                <img src={bank.logo} alt={bank.name} className="max-h-12 w-auto max-w-full" />
                {bank.note ? (
                  <p className="mt-2 text-center font-mono text-[10px] text-muted">{bank.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="paper" id="logo">
        <Container>
          <Label>Лого (DR-7, O-13)</Label>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-card border border-line bg-white p-6">
              <Wordmark />
            </div>
            <div className="rounded-card bg-petrol p-6 text-white">
              <Wordmark tone="light" />
            </div>
          </div>
          <div className="mt-4 flex items-end gap-5">
            <LogoMark className="size-12" />
            <LogoMark className="size-8" />
            <LogoMark className="size-4" />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Липсващо съдържание</Label>
            <p className="mt-4">
              Телефон: <Value value={site.contact.phone} />
            </p>
            <p className="mt-2">
              Адрес: <Value value={site.office.address} />
            </p>
            <p className="mt-2 text-sm">
              <Value value={site.legal.disclosure} />
            </p>
          </div>
          <PlaceholderBox item="O-1">Снимка с клиент и отзив — предстои</PlaceholderBox>
        </Container>
      </Section>
    </>
  );
}
