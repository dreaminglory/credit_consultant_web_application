/**
 * Annuity (equal monthly payment) maths for the calculators (FR-12…17, A-14). Rates are nominal
 * annual percentages, terms are in months. Payments are rounded to the cent, as banks quote
 * them, and every total is built from the rounded payment.
 */

/** Rounds to the cent, half away from zero (Excel ROUND). */
export function roundCents(value: number): number {
  return (Math.sign(value) * Math.round((Math.abs(value) + Number.EPSILON) * 100)) / 100;
}

/** Unrounded monthly payment (Excel `-PMT(rate/12, months, principal)`). */
export function exactPayment(principal: number, annualRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 1200;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - (1 + r) ** -months);
}

/** Monthly payment rounded to the cent. */
export function payment(principal: number, annualRatePct: number, months: number): number {
  return roundCents(exactPayment(principal, annualRatePct, months));
}

/** Loan a monthly payment repays (Excel `-PV(rate/12, months, payment)`), to the cent. */
export function principalFromPayment(
  monthlyPayment: number,
  annualRatePct: number,
  months: number,
): number {
  if (monthlyPayment <= 0 || months <= 0) return 0;
  const r = annualRatePct / 1200;
  if (r === 0) return roundCents(monthlyPayment * months);
  return roundCents((monthlyPayment * (1 - (1 + r) ** -months)) / r);
}
