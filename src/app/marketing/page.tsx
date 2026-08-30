import type { Metadata } from "next";
import SitePage from "@/components/SitePage";

/* עמוד הקמפיין: אותו עמוד בדיוק, עם גרסת ההירו שמדברת על שיווק העסק
   (ממומן · אורגני · ניהול אתר · AI) במקום על הקמת אתר חדש.
   הוא נחשף רק למי שנכנס דרך הקישור הישיר — noindex/nofollow מוציאים
   אותו מגוגל, והוא גם לא נמצא ב-sitemap ואין אליו קישור מהאתר. בלי זה
   הוא היה מתחרה בדף הראשי על אותן מילות חיפוש (תוכן כפול). */
export const metadata: Metadata = {
  title: "שיווק לעסק — קידום ממומן, אורגני ו-AI | AS digital",
  description:
    "קידום ממומן בגוגל ובמטא, קידום אורגני, ניהול ותחזוקת אתרים ואוטומציות AI. אסף סאייג, מולך ישירות.",
  alternates: { canonical: "/marketing" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function MarketingLanding() {
  return <SitePage hero="marketing" />;
}
