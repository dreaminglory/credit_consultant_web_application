import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter_Tight, Onest } from "next/font/google";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bg" className={`${interTight.variable} ${onest.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
