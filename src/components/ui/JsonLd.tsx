import { serializeJsonLd } from "@/lib/jsonLd";

/** Embeds structured data (A-16). A plain `<script>`: JSON-LD is data, not executable code. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
