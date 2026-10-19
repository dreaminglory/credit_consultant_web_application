import { exactPayment } from "./annuity";

/**
 * Monthly rate at which `months` equal payments repay `principal` (Excel `RATE`). Newton steps
 * inside a bracket that always holds the root, with bisection whenever a step would leave it.
 * Returns null when the payments cannot repay the principal.
 */
export function monthlyRate(principal: number, monthlyPayment: number, months: number) {
  if (principal <= 0 || monthlyPayment <= 0 || months <= 0) return null;
  const total = monthlyPayment * months;
  if (total < principal - 1e-9) return null;
  if (Math.abs(total - principal) <= 1e-9) return 0;

  // The payment rises with the rate and always exceeds principal × rate, so the root is below.
  let lo = 0;
  let hi = monthlyPayment / principal;
  const f = (r: number) => exactPayment(principal, r * 1200, months) - monthlyPayment;
  let r = Math.min(hi / 2, 0.01);
  for (let i = 0; i < 200; i++) {
    const value = f(r);
    if (Math.abs(value) < 1e-11) break;
    if (value > 0) hi = r;
    else lo = r;
    if (hi - lo < 1e-16) break;
    const h = Math.max(r * 1e-7, 1e-13);
    const slope = (f(r + h) - value) / h;
    const next = slope > 0 ? r - value / slope : Number.NaN;
    r = next > lo && next < hi ? next : (lo + hi) / 2;
  }
  return r;
}

/** Nominal annual rate in % that the payments imply (Excel `RATE(…)*12`). */
export function rateFromPayment(principal: number, monthlyPayment: number, months: number) {
  const r = monthlyRate(principal, monthlyPayment, months);
  return r === null ? null : r * 1200;
}
