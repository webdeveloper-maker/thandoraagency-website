/**
 * Thandora enquiry form → Google Sheet.
 *
 * Bound to the "Thandora enquiries" sheet (Extensions → Apps Script) and
 * deployed as a Web app (Execute as: Me, Who has access: Anyone). The site
 * POSTs each enquiry here (lib/enquiry.ts); one row is appended to the
 * "Enquiries" tab. This copy is for reference: edits only take effect once
 * pasted into Apps Script and redeployed (Manage deployments → Edit → New version).
 */
const TAB = "Enquiries";
const KEYS = ["name", "company", "email", "location", "service", "budget", "timeline", "note"];
const HEADER = ["Submitted at", "Name", "Company", "Email", "Location", "Service", "Budget", "Timeline", "Note"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse((e.postData && e.postData.contents) || "{}");
    if (d.website) return reply({ ok: true }); // spam bot: ignore
    if (!d.name || !d.email || !d.note) return reply({ ok: false, error: "missing fields" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(TAB) || ss.insertSheet(TAB);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);

    // Store as plain text: stop values like "=..." from running as formulas.
    const clean = (v) => String(v || "").slice(0, 5000).replace(/^[=+\-@]/, "'$&");
    sheet.appendRow([new Date(), ...KEYS.map((k) => clean(d[k]))]);
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
