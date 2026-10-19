import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight, Onest } from "next/font/google";
import { Attribution } from "@/components/blocks/lead/Attribution";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CalculatorsPanel, LoansPanel } from "@/components/layout/MenuPanels";
import { MobileBar } from "@/components/layout/MobileBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/config/site";
import "./globals.css";

// Fonts are self-hosted at build time (A-4); Cyrillic subset is required (DR-3).
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["cyrillic", "latin"],
  weight: ["700", "800"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["cyrillic", "latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.person.name} — кредитен консултант | ${site.brand.name}`,
    template: `%s | ${site.person.name} · ${site.brand.name}`,
  },
  description: site.brand.description,
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  // Lets the fixed phone action bar respect the home-indicator safe area.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bg" className={`${interTight.variable} ${onest.variable} ${plexMono.variable}`}>
      <body>
        <SkipLink />
        <Header panels={{ loans: <LoansPanel />, calculators: <CalculatorsPanel /> }} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileBar />
        <Attribution />
      </body>
    </html>
  );
}
