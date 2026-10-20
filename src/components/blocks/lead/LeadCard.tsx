import { leadSection } from "@/content/lead";
import { ContactActions } from "@/components/blocks/ContactActions";
import { cn } from "@/lib/cn";
import type { LeadProduct, LeadVariant } from "@/lib/lead/schema";
import { LeadForm } from "./LeadForm";

type LeadCardProps = {
  /** Anchor id, so a link can scroll straight to the form card. */
  id?: string;
  variant: LeadVariant;
  product?: LeadProduct;
  productFromUrl?: boolean;
  className?: string;
};

/**
 * The white form card (mockup v2 `.form-card`) around `LeadForm`. The phone/Viber/WhatsApp
 * fallback is rendered here on the server and handed to the form for its error state (FR-6).
 */
export function LeadCard({ id, variant, product, productFromUrl, className }: LeadCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-card bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgb(14_22_21/0.45)] sm:p-8",
        className,
      )}
    >
      <LeadForm
        variant={variant}
        defaultProduct={product}
        productFromUrl={productFromUrl}
        fallback={<ContactActions variant="line" />}
      />
      <noscript>
        <div className="mt-5 rounded-tile border-2 border-gold bg-gold/10 p-4">
          <p className="font-medium">{leadSection.noScript}</p>
          <ContactActions variant="line" className="mt-4" />
        </div>
      </noscript>
    </div>
  );
}
