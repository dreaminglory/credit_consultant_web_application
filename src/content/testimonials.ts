import { pending } from "@/config/pending";
import type { LoanSlug } from "@/config/site";

/**
 * Client testimonials (B-10, FR-24). Real content only, supplied with written consent (O-1);
 * never write one here by hand. Until the owner delivers them the carousel shows marked
 * placeholder slides, so the layout and behaviour can already be reviewed.
 */

export const testimonialsSection = {
  anchor: "otzivi",
  label: "Отзиви",
  title: "Какво казват клиентите ми",
  carouselLabel: "Отзиви на клиенти",
};

export type Testimonial = {
  id: string;
  /** Product the client took; drives the filter on loan pages (FR-25). */
  product: LoanSlug;
  quote: string;
  /** First name or initial only. */
  name: string;
  city: string;
  year: number;
  /** Photo of the consultant with the client, from the image pipeline (A-8). */
  photo: { name: string; alt: string; width: number; height: number };
};

export const testimonials: Testimonial[] = [];

/** Shown while `testimonials` is empty. */
export const testimonialsMissing = pending(
  "O-1",
  "About 8 photos (consultant alone and with clients) and each client's feedback, with written consent",
);

/** How many marked placeholder slides to show while the real ones are missing. */
export const placeholderSlides = 4;
