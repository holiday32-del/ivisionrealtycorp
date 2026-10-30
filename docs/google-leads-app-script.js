/** Google Apps Script: paste into a script bound to the lead spreadsheet.
 * Set Script Property LEAD_WEBHOOK_SECRET to a strong random value.
 * Execute as Me; web app access Anyone. Keep URL + secret server-side.
 * Create tabs 'New Wide Lending' and 'iVision Realty' in the sheet.
 */
const HEADERS = ["Date/time", "Name", "Phone", "Email", "Site/page it came from", "Program or interest", "Message/notes", "Status"];
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const data = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty("LEAD_WEBHOOK_SECRET");
    if (!expected || data.secret !== expected) throw Error("Unauthorized");
    const configs = {
      "New Wide Lending": { tab: "New Wide Lending", to: "info@newwidelending.com" },
      "IVISION Realty Corp": { tab: "iVision Realty", to: "info@ivisionrealtycorp.com" }
    };
    const cfg = configs[data.site];
    if (!cfg || data.recipient !== cfg.to) throw Error("Unknown site");
    const name = String(data.name || "").slice(0,200), email = String(data.email || "").slice(0,254);
    if (!name || !email || !data.page || !data.id) throw Error("Invalid lead");
    lock.waitLock(20000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(cfg.tab);
    if (!sheet) throw Error("Missing lead tab");
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    // Hidden metadata in column I for idempotency, not part of the eight-column lead view.
    if (sheet.getRange(1,9).getValue() !== "_submission_id") sheet.getRange(1,9).setValue("_submission_id");
    sheet.hideColumns(9);
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2,9,last-1,1).getValues().some(row => row[0] === data.id)) {
      return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
    }
    const safe = x => { const s = String(x ?? "").slice(0,4000); return /^[=+@\-]/.test(s) ? "'" + s : s; };
    const row = [new Date(), safe(name), safe(data.phone), safe(email), safe(data.site + " " + data.page), safe(data.interest), safe(data.message), "New", data.id];
    sheet.appendRow(row);
    // Send only after sheet append; retry fails safely without producing another row.
    const subject = data.site + " lead — " + data.page;
    MailApp.sendEmail({to:cfg.to, subject, body: "New website lead\n\n" + HEADERS.map((h,i)=>h+": "+row[i]).join("\n")});
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({success:false,error:"Lead not processed"})).setMimeType(ContentService.MimeType.JSON);
  } finally { try { lock.releaseLock(); } catch(_) {} }
}
