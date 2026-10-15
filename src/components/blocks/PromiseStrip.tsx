import { promises } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";

/** Promise strip (B-05): four short promises, lifted over the bottom edge of the hero. */
export function PromiseStrip() {
  return (
    <section aria-label="Какво получавате" className="relative z-10 -mt-14 md:-mt-16">
      <Container>
        <GlassCard className="bg-white/85 p-2 shadow-float">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => (
              <li key={promise.title} className="p-5 lg:px-6 lg:py-6">
                <p className="font-head text-xl leading-tight font-extrabold tracking-[-0.02em]">
                  {promise.title}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-muted">{promise.text}</p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Container>
    </section>
  );
}
