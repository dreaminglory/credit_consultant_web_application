import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { site, type LoanSlug } from "@/config/site";
import { LoanTemplate } from "@/components/templates/LoanTemplate";
import { loanCopy } from "@/content/loans";

// Only the four loans in config get a page; anything else is a 404.
export const dynamicParams = false;

const isLoan = (slug: string): slug is LoanSlug => site.loans.some((loan) => loan.slug === slug);

export function generateStaticParams() {
  return site.loans.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/krediti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isLoan(slug)) return {};
  const copy = loanCopy[slug];
  return pageMetadata({ title: copy.title, description: copy.intro, path: `/krediti/${slug}` });
}

export default async function LoanPage({ params }: PageProps<"/krediti/[slug]">) {
  const { slug } = await params;
  if (!isLoan(slug)) notFound();
  return <LoanTemplate slug={slug} />;
}
