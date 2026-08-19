import { trackLeadConversion } from "./ads-conversion";

export type Lead = { name: string; phone: string; message: string };
type LeadRow = Lead & { source: string };

/* מה שהמשתמש הקליד עד עכשיו — באיזה טופס שלא יהיה. נשמר ברמת המודול
   כדי שגם לחיצה על כפתור וואטסאפ "יבש" (FAB, הדר, CTA) תוכל לשלוח
   את הפרטים שכבר נאספו, למרות שאין לכפתור טופס משלו. */
const draft: Lead = { name: "", phone: "", message: "" };

/* איזה אנשי קשר כבר נכתבו לגיליון במהלך הביקור — מונע שורה כפולה
   כשלוחצים על כמה כפתורי וואטסאפ ברצף. */
const sent = new Set<string>();

const contactKey = (l: Lead) => `${l.name.trim()}|${l.phone.trim()}`;

/* אילו המרות Google Ads כבר דווחו בביקור הזה, לפי הטלפון — זהות הליד
   היציבה. אותו אדם ששולח גם את האבחון וגם את טופס יצירת הקשר הוא ליד
   אחד, ולכן המרה אחת; טלפון אחר בהמשך הביקור הוא ליד חדש שכן נספר. */
const converted = new Set<string>();

/* ליד בלי טלפון אינו בר-יצירת-קשר ולכן אינו המרה. שדות טופס יצירת הקשר
   אינם חובה, אז בלי הסינון הזה שליחה של טופס ריק הייתה נספרת כהמרה.
   שבע ספרות מפרידות מספר אמיתי מהקלדה מקרית. */
function phoneKey(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? digits : "";
}

/** ערך ריק אף פעם לא דורס ערך קיים — אחרת טופס שנטען אחרון היה מוחק
    את מה שהמשתמש הקליד בטופס הקודם. */
export function updateLeadDraft(patch: Partial<Lead>) {
  for (const key of ["name", "phone", "message"] as const) {
    const value = patch[key];
    if (value && value.trim()) draft[key] = value;
  }
}

function post(row: LeadRow) {
  /* keepalive קריטי: בלעדיו המעבר לאפליקציית וואטסאפ בנייד מבטל את
     הבקשה באמצע והליד נעלם — הלקוח מגיע לצ'אט, אבל השורה לא נכתבת. */
  return fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
    keepalive: true,
  })
    .then((res) => res.ok)
    .catch(() => false);
}

/** כותב את השורה, ורק אם השרת החזיר הצלחה מדווח על המרה ל-Google Ads.
    הבדיקה והסימון של המפתח קורים באותו tick, ולכן לחיצה כפולה על
    "שליחה" מייצרת אמנם שתי בקשות — אבל המרה אחת בלבד. כשל מהשרת לא
    מסמן כלום, כך שניסיון חוזר מוצלח עדיין ייספר. */
function postAndTrack(row: LeadRow) {
  const key = phoneKey(row.phone);
  post(row).then((ok) => {
    if (!ok || !key || converted.has(key)) return;
    converted.add(key);
    trackLeadConversion();
  });
}

/** שליחה מפורשת מטופס — תמיד נכתבת. */
export function saveLead(lead: Lead, source: string) {
  updateLeadDraft(lead);
  sent.add(contactKey(lead));
  postAndTrack({ ...lead, source });
}

/** לחיצה על כפתור וואטסאפ שאין לו טופס. שולחים רק אם יש בכלל פרטים
    ליצירת קשר — בלי זה כל מבקר שנוגע ב-FAB היה מייצר שורה ריקה. */
export function flushLeadDraft(source: string) {
  const key = contactKey(draft);
  if (key === "|" || sent.has(key)) return;
  sent.add(key);
  postAndTrack({ ...draft, source });
}
