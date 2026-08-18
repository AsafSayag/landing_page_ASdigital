/**
 * AS digital — קליטת לידים מהאתר אל הגיליון "לידים דף נחיתה".
 *
 * זה לא קוד שרץ בפרויקט Next — הוא חי ב-Apps Script שמחובר לגיליון,
 * והעותק כאן קיים כדי שהוא ינוהל בגיט ולא רק בענן של גוגל.
 *
 * להתקנה: בגיליון → תוספים → Apps Script → להדביק במקום התוכן הקיים →
 * שמירה → פריסה → ניהול פריסות → עריכה → גרסה: New version → פריסה.
 * בלי הפריסה מחדש, הכתובת הקיימת ממשיכה להריץ את הקוד הישן.
 */

const HEADERS = ["תאריך", "שם", "טלפון", "הודעה", "מקור"];

function doPost(e) {
  /* נעילה כדי ששתי פניות שמגיעות באותה שנייה לא ידרסו זו את זו — בלעדיה
     appendRow של שתי בקשות במקביל עלול לכתוב לאותה שורה. */
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeaders_(sheet);
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.message || "",
      data.source || "",
    ]);
    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** משלים את שורת הכותרות אם חסרה בה עמודה — לא נוגע בשורות הנתונים. */
function ensureHeaders_(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  if (range.getValues()[0].join("") === HEADERS.join("")) return;
  range.setValues([HEADERS]).setFontWeight("bold");
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
