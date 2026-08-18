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
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
    keepalive: true,
  }).catch(() => {});
}

/** שליחה מפורשת מטופס — תמיד נכתבת. */
export function saveLead(lead: Lead, source: string) {
  updateLeadDraft(lead);
  sent.add(contactKey(lead));
  post({ ...lead, source });
}

/** לחיצה על כפתור וואטסאפ שאין לו טופס. שולחים רק אם יש בכלל פרטים
    ליצירת קשר — בלי זה כל מבקר שנוגע ב-FAB היה מייצר שורה ריקה. */
export function flushLeadDraft(source: string) {
  const key = contactKey(draft);
  if (key === "|" || sent.has(key)) return;
  sent.add(key);
  post({ ...draft, source });
}
