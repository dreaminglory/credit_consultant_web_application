import Link from "next/link";
import { isLink, legalCopy, type Inline, type LegalBlock, type LegalDoc } from "@/content/legal";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { ConsentStatus } from "@/components/consent/ConsentStatus";
import { Container } from "@/components/ui/Container";
import { Value } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";
import { formatIsoDate } from "@/lib/date";

const linkClass = "font-medium text-petrol underline underline-offset-4 hover:text-ink";

function Text({ text }: { text: Inline }) {
  return text.map((segment, index) => {
    if (!isLink(segment)) return <Value key={index} value={segment} />;
    const external = segment.href.startsWith("http");
    return external ? (
      <a
        key={index}
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {segment.label}
        <span className="sr-only"> (отваря се в нов прозорец)</span>
      </a>
    ) : (
      <Link key={index} href={segment.href} className={linkClass}>
        {segment.label}
      </Link>
    );
  });
}

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "p":
      return (
        <p>
          <Text text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="grid list-disc gap-2 pl-5 marker:text-sea">
          {block.items.map((item, index) => (
            <li key={index}>
              <Text text={item} />
            </li>
          ))}
        </ul>
      );
    case "facts":
      return (
        <dl className="grid gap-x-6 rounded-tile border border-line bg-paper px-5 py-2 sm:grid-cols-[minmax(150px,auto)_1fr]">
          {block.rows.map((row) => (
            <div
              key={row.term}
              className="grid border-b border-line py-3 last:border-0 sm:col-span-2 sm:grid-cols-subgrid"
            >
              <dt className="text-[15px] text-muted">{row.term}</dt>
              <dd className="font-medium">
                <Text text={row.value} />
              </dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        // Wide tables scroll inside their own box, never the page (360 px phones).
        <div
          className="-mx-1 overflow-x-auto px-1"
          tabIndex={0}
          role="region"
          aria-label={block.caption}
        >
          {/* Phones: each row stacks into a labelled card; from 640 px a normal table. */}
          <table className="w-full border-collapse text-left text-[15px] max-sm:block sm:min-w-[560px]">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="max-sm:sr-only">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="border-b-2 border-ink py-2 pr-4 align-bottom font-mono text-xs font-medium tracking-[0.05em] uppercase"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-sm:grid max-sm:gap-3">
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-line max-sm:grid max-sm:gap-2 max-sm:rounded-tile max-sm:border max-sm:bg-paper max-sm:p-4"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        "align-top sm:py-3 sm:pr-4",
                        cellIndex === 0 && "font-semibold",
                      )}
                    >
                      {cellIndex > 0 && (
                        <span
                          aria-hidden="true"
                          className="block font-mono text-[11px] tracking-[0.05em] text-muted uppercase sm:hidden"
                        >
                          {block.head[cellIndex]}
                        </span>
                      )}
                      <Text text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "consent":
      return <ConsentStatus />;
  }
}

/**
 * Legal page (T6): hero with the last-updated date, a table of contents (sticky beside the text
 * on large screens), readable text and the closing CTA band. Static HTML; only the cookie
 * choice control hydrates.
 */
export function LegalTemplate({ doc }: { doc: LegalDoc }) {
  const updated = formatIsoDate(doc.updated);
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: doc.label }]}
        label={doc.label}
        title={doc.title}
        intro={doc.description}
      >
        <p className="enter mt-6 font-mono text-[13px] font-medium tracking-[0.05em] text-muted uppercase">
          {legalCopy.updated} <time dateTime={doc.updated}>{updated}</time>
        </p>
      </PageHero>

      <Section tone="white">
        <Container className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <nav aria-labelledby="legal-toc" className="lg:sticky lg:top-28 lg:self-start">
            <h2
              id="legal-toc"
              className="font-mono text-xs leading-none font-medium tracking-[0.08em] uppercase"
            >
              {legalCopy.toc}
            </h2>
            <ol className="mt-4 grid gap-1 border-l border-line text-[15px]">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px flex min-h-11 items-center border-l-2 border-transparent py-1.5 pl-4 text-muted no-underline transition-colors duration-150 hover:border-gold hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="grid max-w-[72ch] gap-12">
            {doc.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28"
              >
                <h2 id={`${section.id}-title`} className="text-[clamp(26px,3vw,36px)]">
                  {section.title}
                </h2>
                <div className="mt-5 grid gap-4 leading-relaxed">
                  {section.blocks.map((block, index) => (
                    <Block key={index} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
