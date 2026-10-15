import { isPending, type MaybePending } from "@/config/pending";

type ContactConfig = {
  phoneE164: MaybePending;
  email: MaybePending;
};

export type ContactLinks = {
  tel: string | null;
  viber: string | null;
  whatsapp: string | null;
  mailto: string | null;
};

/**
 * Builds tel:, Viber, WhatsApp and mailto hrefs from config. Each is `null` while the owner has
 * not supplied the value (O-5), so no component ever links to a made-up number.
 */
export function contactLinks({ phoneE164, email }: ContactConfig): ContactLinks {
  const phone = isPending(phoneE164) ? null : phoneE164.replace(/[^\d+]/g, "");
  const digits = phone?.replace(/^\+/, "") ?? null;
  return {
    tel: phone ? `tel:${phone}` : null,
    viber: phone ? `viber://chat?number=%2B${digits}` : null,
    whatsapp: digits ? `https://wa.me/${digits}` : null,
    mailto: isPending(email) ? null : `mailto:${email}`,
  };
}
