import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight, Onest } from "next/font/google";
import Script from "next/script";
import { Attribution } from "@/components/blocks/lead/Attribution";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { MarketingScripts } from "@/components/consent/MarketingScripts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CalculatorsPanel, LoansPanel } from "@/components/layout/MenuPanels";
import { MobileBar } from "@/components/layout/MobileBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/config/site";
import { baseOpenGraph } from "@/lib/seo";
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
  // noindex on every page until launch; pages that are never indexed set their own robots.
  robots: site.allowIndexing ? undefined : { index: false, follow: false },
  title: {
    default: `${site.person.name} — кредитен консултант | ${site.brand.name}`,
    template: `%s | ${site.person.name} · ${site.brand.name}`,
  },
  description: site.brand.description,
  // Pages set their own title, description, canonical and Open Graph via pageMetadata (TR-8).
  openGraph: baseOpenGraph,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  // Lets the fixed phone action bar respect the home-indicator safe area.
  viewportFit: "cover",
};

const { cfBeaconToken } = site.tracking;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bg" className={`${interTight.variable} ${onest.variable} ${plexMono.variable}`}>
      <body>
        <ConsentProvider>
          <SkipLink />
          {/* Early in the DOM so keyboard users reach the choice right after the skip link. */}
          <ConsentBanner />
          <Header panels={{ loans: <LoansPanel />, calculators: <CalculatorsPanel /> }} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileBar />
          <MarketingScripts />
          <Attribution />
        </ConsentProvider>
        {cfBeaconToken && (
          // Cookieless, no personal data: needs no consent (FR-29).
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
          />
        )}
      </body>
    </html>
  );
}
