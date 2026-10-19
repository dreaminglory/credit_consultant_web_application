import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { CalculatorTemplate } from "@/components/templates/CalculatorTemplate";
import { calculatorCopy, isLiveCalculator, liveCalculatorSlugs } from "@/content/calculators";

// Only released calculators get a page; the fee calculators 404 until O-12 (FR-18…20).
export const dynamicParams = false;

export function generateStaticParams() {
  return liveCalculatorSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/kalkulatori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLiveCalculator(slug)) return {};
  const copy = calculatorCopy[slug];
  return pageMetadata({ title: copy.title, description: copy.intro, path: `/kalkulatori/${slug}` });
}

export default async function CalculatorPage({ params }: PageProps<"/kalkulatori/[slug]">) {
  const { slug } = await params;
  if (!isLiveCalculator(slug)) notFound();
  return <CalculatorTemplate slug={slug} />;
}
