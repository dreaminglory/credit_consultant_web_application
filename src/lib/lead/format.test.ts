import { describe, expect, it } from "vitest";
import {
  autoReplyHtml,
  campaignLabel,
  escapeHtml,
  formatSofia,
  leadEmailHtml,
  leadEmailText,
  leadSubject,
  sheetColumns,
  sheetRow,
} from "./format";
import type { Lead } from "./schema";

const lead: Lead = {
  product: "ipotechni",
  name: "Мария",
  phone: "+359888123456",
  city: "Пловдив",
  amount: 120000,
  method: "viber",
  time: "9-12",
  email: "maria@example.com",
  notes: "Имам кредит с лихва 4%",
  source: {
    page: "/konsultacia",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "ipoteki",
  },
};

// 2026-10-16 09:05 UTC = 12:05 in Sofia (EEST, UTC+3).
const receivedAt = new Date(Date.UTC(2026, 9, 16, 9, 5));

describe("leadSubject (FR-8)", () => {
  it("follows „Нова заявка: продукт — сума — име, град“", () => {
    expect(leadSubject(lead)).toMatch(/^Нова заявка: Ипотечен — 120\s000\s€ — Мария, Пловдив$/);
  });

  it("leaves out empty parts", () => {
    expect(leadSubject({ ...lead, amount: null, city: "" })).toBe("Нова заявка: Ипотечен — Мария");
  });

  it("never contains line breaks", () => {
    expect(leadSubject({ ...lead, name: "A\r\nBcc: x@y.z" })).not.toMatch(/[\r\n]/);
  });
});

describe("owner email", () => {
  it("escapes visitor input in the HTML", () => {
    const html = leadEmailHtml(
      { ...lead, notes: '<script>alert("x")</script>' },
      "id-1",
      receivedAt,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("has click-to-call, Viber and WhatsApp links and the Sofia time", () => {
    const html = leadEmailHtml(lead, "id-1", receivedAt);
    expect(html).toContain('href="tel:+359888123456"');
    expect(html).toContain("viber://chat?number=%2B359888123456");
    expect(html).toContain("https://wa.me/359888123456");
    expect(html).toContain(escapeHtml(formatSofia(receivedAt)));
    expect(formatSofia(receivedAt)).toContain("12:05");
  });

  it("has a plain-text fallback with every field", () => {
    const text = leadEmailText(lead, "id-1", receivedAt);
    for (const part of [
      "Мария",
      "+359888123456",
      "Viber",
      "9–12 ч.",
      "google / cpc / ipoteki",
      "id-1",
    ]) {
      expect(text).toContain(part);
    }
  });
});

describe("campaignLabel", () => {
  it("falls back from UTM to click ids, referrer and direct", () => {
    expect(campaignLabel({ ...lead, source: { gclid: "abc" } })).toMatch(/Google Ads/);
    expect(campaignLabel({ ...lead, source: { referrer: "https://www.google.com" } })).toBe(
      "https://www.google.com",
    );
    expect(campaignLabel({ ...lead, source: {} })).toBe("директно");
  });
});

describe("sheetRow (FR-9)", () => {
  it("matches the column list and starts with status „Нова“", () => {
    const row = sheetRow(lead, "id-1", receivedAt);
    expect(row).toHaveLength(sheetColumns.length);
    expect(row[sheetColumns.indexOf("Статус")]).toBe("Нова");
    expect(row[sheetColumns.indexOf("Сума (€)")]).toBe(120000);
    expect(row[sheetColumns.indexOf("Номер на заявката")]).toBe("id-1");
  });
});

describe("auto-reply (FR-11)", () => {
  it("greets by name, escaped", () => {
    expect(autoReplyHtml({ ...lead, name: "<b>Мария</b>" })).toContain("&lt;b&gt;Мария&lt;/b&gt;");
  });
});

describe("Apps Script (scripts/lead-sheet.gs)", () => {
  it("writes the same header row as sheetColumns", async () => {
    const { readFile } = await import("node:fs/promises");
    const script = await readFile(
      new URL("../../../scripts/lead-sheet.gs", import.meta.url),
      "utf8",
    );
    const block = /const HEADERS = \[([\s\S]*?)\];/.exec(script)?.[1] ?? "";
    const headers = [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    expect(headers).toEqual([...sheetColumns]);
  });
});
