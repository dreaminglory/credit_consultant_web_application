import { site } from "@/config/site";
import { banksSection } from "@/content/home";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Bank logos (B-08, BL-1…3): ledger-style grid, greyscale at rest and in colour on hover.
 * The list and file paths come from config; logo permission is open item O-4.
 */
export function BankLogos() {
  return (
    <Section id={banksSection.anchor}>
      <Container>
        <SectionHeader label={banksSection.label} title={banksSection.title} />
        <Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-5">
            {site.banks.map((bank) => (
              <li
                key={bank.id}
                className="bank-tile grid h-28 place-items-center bg-white px-6 transition-colors duration-150 hover:bg-paper"
              >
                {/* Static SVG from /public/banks: next/image adds nothing for vector files. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bank.logo}
                  alt={bank.name}
                  width={bank.size[0]}
                  height={bank.size[1]}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "bank-logo object-contain",
                    bank.tall
                      ? "h-[72px] w-auto max-w-[min(100%,120px)]"
                      : "h-auto w-auto max-h-11 max-w-[min(100%,150px)]",
                  )}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
