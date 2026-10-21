import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { CalculatorTemplate } from "@/components/templates/CalculatorTemplate";
import {
  calculatorCopy,
  isLiveCalculator,
  isReleasedCalculator,
  liveCalculatorSlugs,
  releasedCalculatorSlugs,
} from "@/content/calculators";

// Only released calculators get a page. In `npm run dev` the built but unreleased fee
// calculators (FR-18…20) open too, so the owner can review them before O-12 is closed.
const showUnreleased = process.env.NODE_ENV === "development";
const isShown = (slug: string) =>
  showUnreleased ? isLiveCalculator(slug) : isReleasedCalculator(slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return (showUnreleased ? liveCalculatorSlugs : releasedCalculatorSlugs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/kalkulatori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isShown(slug) || !isLiveCalculator(slug)) return {};
  const copy = calculatorCopy[slug];
  const metadata = pageMetadata({
    title: copy.title,
    description: copy.intro,
    path: `/kalkulatori/${slug}`,
  });
  return isReleasedCalculator(slug)
    ? metadata
    : { ...metadata, robots: { index: false, follow: false } };
}

export default async function CalculatorPage({ params }: PageProps<"/kalkulatori/[slug]">) {
  const { slug } = await params;
  if (!isShown(slug) || !isLiveCalculator(slug)) notFound();
  return <CalculatorTemplate slug={slug} preview={!isReleasedCalculator(slug)} />;
}
