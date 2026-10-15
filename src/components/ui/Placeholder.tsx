import { isPending, type MaybePending } from "@/config/pending";

/**
 * Renders a config value, or a clearly marked placeholder when the owner has not supplied it
 * yet (CLAUDE.md: never invent content). Drafts are shown with the open-item ID.
 */
export function Value({ value }: { value: MaybePending }) {
  if (!isPending(value)) return <>{value}</>;
  return (
    <mark
      title={`${value.pending}: ${value.hint}`}
      className="rounded-md border border-dashed border-gold bg-gold/10 px-1.5 py-0.5 text-inherit"
    >
      {value.draft ?? `[${value.pending}]`}
    </mark>
  );
}

/** Block-level placeholder for missing media or sections (photos, testimonials). */
export function PlaceholderBox({ item, children }: { item: string; children: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-tile border-2 border-dashed border-gold bg-gold/10 p-4 text-center text-sm">
      <div>
        <p className="mb-1 font-mono text-[11px] tracking-[0.08em]">{item}</p>
        {children}
      </div>
    </div>
  );
}
