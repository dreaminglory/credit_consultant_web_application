import { isPending, type MaybePending } from "@/config/pending";

export type MapLinks = {
  /** Keyless Google Maps embed, loaded into an iframe only after a click (FR-27). */
  embed: string;
  /** Opens the address in Google Maps (web or app). */
  open: string;
};

/**
 * Google Maps URLs for the office. Only the business address goes into the URL, never visitor
 * data. `null` while the address is a placeholder (O-11), so nothing points at a made-up place.
 */
export function mapLinks(city: string, address: MaybePending): MapLinks | null {
  if (isPending(address)) return null;
  const query = encodeURIComponent(`${address}, ${city}`);
  return {
    embed: `https://www.google.com/maps?q=${query}&output=embed`,
    open: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}
