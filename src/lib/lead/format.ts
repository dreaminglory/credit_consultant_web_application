import { site } from "@/config/site";
import { autoReply } from "@/content/lead";
import { contactLinks } from "@/lib/contact";
import { labelOf, type Lead } from "./schema";

/**
 * Owner email, Sheet row and auto-reply built from a lead (FR-8, FR-9, FR-11). Pure functions;
 * every visitor-supplied value is HTML-escaped before it goes into markup. Email clients ignore
 * CSS variables, so the email markup inlines the token colours (ink, paper, petrol, muted).
 */

const eur = new Intl.NumberFormat("bg-BG", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const sofia = new Intl.DateTimeFormat("bg-BG", {
  timeZone: "Europe/Sofia",
  dateStyle: "short",
  timeStyle: "short",
});

export function formatSofia(date: Date) {
  return sofia.format(date);
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One line per header field; email subjects cannot contain line breaks. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

export const productLabel = (lead: Lead) => labelOf(site.lead.products, lead.product);
export const methodLabel = (lead: Lead) => labelOf(site.lead.methods, lead.method);
export const timeLabel = (lead: Lead) =>
  lead.time ? labelOf(site.lead.timeSlots, lead.time) : "—";
export const amountLabel = (lead: Lead) => (lead.amount === null ? "—" : eur.format(lead.amount));

/** `Нова заявка: {продукт} — {сума} € — {име}, {град}`; empty parts are left out (FR-8). */
export function leadSubject(lead: Lead) {
  const amount = lead.amount === null ? null : `${eur.format(lead.amount)}`;
  const who = [lead.name, lead.city].filter(Boolean).join(", ");
  return oneLine(`Нова заявка: ${[productLabel(lead), amount, who].filter(Boolean).join(" — ")}`);
}

/** Campaign summary: „google / cpc / пролет-ипотеки“, or the referrer, or „директно“. */
export function campaignLabel(lead: Lead) {
  const { utm_source, utm_medium, utm_campaign, gclid, fbclid, referrer } = lead.source;
  const utm = [utm_source, utm_medium, utm_campaign].filter(Boolean).join(" / ");
  if (utm) return utm;
  if (gclid) return "Google Ads (gclid)";
  if (fbclid) return "Facebook / Instagram (fbclid)";
  return referrer ?? "директно";
}

type Row = { label: string; value: string; href?: string };

function rows(lead: Lead, requestId: string, receivedAt: Date): Row[] {
  const links = contactLinks({ phoneE164: lead.phone, email: lead.email ?? "" });
  return [
    { label: "Продукт", value: productLabel(lead) },
    { label: "Име", value: lead.name },
    { label: "Телефон", value: lead.phone, href: links.tel ?? undefined },
    { label: "Населено място", value: lead.city || "—" },
    { label: "Сума", value: amountLabel(lead) },
    { label: "Как да говорим", value: methodLabel(lead) },
    { label: "Удобно време", value: timeLabel(lead) },
    {
      label: "Имейл",
      value: lead.email ?? "—",
      href: lead.email ? (links.mailto ?? undefined) : undefined,
    },
    { label: "Пояснения", value: lead.notes || "—" },
    { label: "Източник", value: campaignLabel(lead) },
    { label: "Страница", value: lead.source.page ?? "—" },
    { label: "Първа страница", value: lead.source.landing ?? "—" },
    { label: "Получена", value: formatSofia(receivedAt) },
    { label: "Номер на заявката", value: requestId },
  ];
}

export function leadEmailText(lead: Lead, requestId: string, receivedAt: Date) {
  const links = contactLinks({ phoneE164: lead.phone, email: "" });
  return [
    leadSubject(lead),
    "",
    ...rows(lead, requestId, receivedAt).map((row) => `${row.label}: ${row.value}`),
    "",
    `Обаждане: ${links.tel}`,
    `Viber: ${links.viber}`,
    `WhatsApp: ${links.whatsapp}`,
  ].join("\n");
}

export function leadEmailHtml(lead: Lead, requestId: string, receivedAt: Date) {
  const links = contactLinks({ phoneE164: lead.phone, email: "" });
  const button = (href: string | null, label: string) =>
    href
      ? `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:999px;background:#0e1615;color:#ffffff;text-decoration:none;font-weight:600">${label}</a>`
      : "";
  const tableRows = rows(lead, requestId, receivedAt)
    .map((row) => {
      const value = escapeHtml(row.value).replace(/\n/g, "<br>");
      const cell = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:#0f3b3e">${value}</a>`
        : value;
      return `<tr><th align="left" valign="top" style="padding:8px 16px 8px 0;color:#4e5b59;font-weight:500;white-space:nowrap">${escapeHtml(row.label)}</th><td style="padding:8px 0">${cell}</td></tr>`;
    })
    .join("");

  return `<!doctype html><html lang="bg"><body style="margin:0;padding:24px;background:#f5f3ee;font-family:Arial,sans-serif;color:#0e1615">
<div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px">
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.25">${escapeHtml(leadSubject(lead))}</h1>
<p style="margin:0 0 16px">${button(links.tel, "Обади се")}${button(links.viber, "Viber")}${button(links.whatsapp, "WhatsApp")}</p>
<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:15px">${tableRows}</table>
</div></body></html>`;
}

/** Sheet columns (FR-9), in order. The Apps Script writes them as the header row. */
export const sheetColumns = [
  "Получена",
  "Име",
  "Телефон",
  "Имейл",
  "Продукт",
  "Сума (€)",
  "Населено място",
  "Как да говорим",
  "Удобно време",
  "Пояснения",
  "Страница",
  "Първа страница",
  "Източник",
  "Кампания",
  "gclid",
  "fbclid",
  "Статус",
  "Номер на заявката",
] as const;

export function sheetRow(lead: Lead, requestId: string, receivedAt: Date) {
  const { source } = lead;
  return [
    formatSofia(receivedAt),
    lead.name,
    lead.phone,
    lead.email ?? "",
    productLabel(lead),
    lead.amount ?? "",
    lead.city,
    methodLabel(lead),
    lead.time ? timeLabel(lead) : "",
    lead.notes,
    source.page ?? "",
    source.landing ?? "",
    [source.utm_source, source.utm_medium].filter(Boolean).join(" / ") || source.referrer || "",
    source.utm_campaign ?? "",
    source.gclid ?? "",
    source.fbclid ?? "",
    "Нова",
    requestId,
  ];
}

export { autoReply };

/** Auto-reply (FR-11); the copy lives in content/lead.ts and `/blagodarim` shows it too. */
export function autoReplyText(lead: Lead) {
  return [
    `Здравейте, ${lead.name}!`,
    "",
    autoReply.title,
    autoReply.text,
    "",
    autoReply.closing,
    "",
    site.person.name,
    site.person.role,
  ].join("\n");
}

export function autoReplyHtml(lead: Lead) {
  return `<!doctype html><html lang="bg"><body style="margin:0;padding:24px;background:#f5f3ee;font-family:Arial,sans-serif;color:#0e1615">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;padding:28px;font-size:16px;line-height:1.6">
<p style="margin:0 0 12px">Здравейте, ${escapeHtml(lead.name)}!</p>
<h1 style="margin:0 0 12px;font-size:22px;line-height:1.25">${autoReply.title}</h1>
<p style="margin:0 0 12px">${autoReply.text}</p>
<p style="margin:0 0 20px;color:#4e5b59">${autoReply.closing}</p>
<p style="margin:0"><strong>${escapeHtml(site.person.name)}</strong><br>${escapeHtml(site.person.role)}</p>
</div></body></html>`;
}
