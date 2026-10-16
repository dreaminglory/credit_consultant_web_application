/**
 * Google Apps Script web app that appends consultation requests to a Google Sheet (FR-9, A-11).
 * The site's `/api/lead` POSTs JSON `{ secret, row }`; the column order is `sheetColumns` in
 * src/lib/lead/format.ts — keep HEADERS below identical.
 *
 * Setup (owner's Google account):
 * 1. Create a Google Sheet, e.g. „ExtraConsult — заявки“. Extensions → Apps Script.
 * 2. Replace the code with this file and save.
 * 3. Project Settings → Script properties → add `SHEET_SECRET` = a long random string
 *    (e.g. from `openssl rand -hex 32`). Put the same value in the site's `SHEET_SECRET`.
 * 4. Deploy → New deployment → type „Web app“; Execute as: Me; Who has access: Anyone.
 *    Copy the URL ending in `/exec` into the site's `SHEET_WEBHOOK_URL`.
 * 5. After any code change: Deploy → Manage deployments → edit → New version (the URL stays).
 *
 * The script never logs the row. Only a request with the right secret can write; nobody can
 * read the Sheet through this endpoint.
 */

const SHEET_NAME = "Заявки";

const HEADERS = [
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
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty("SHEET_SECRET");
    if (!secret || body.secret !== secret) return json({ ok: false, error: "forbidden" });
    if (!Array.isArray(body.row) || body.row.length !== HEADERS.length) {
      return json({ ok: false, error: "bad_row" });
    }

    lock.waitLock(10000);
    const sheet = getSheet();
    // Prefix values that a spreadsheet would run as formulas (CSV/formula injection).
    const row = body.row.map((value) =>
      typeof value === "string" && /^[=+\-@]/.test(value) ? "'" + value : value,
    );
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: "exception" });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
