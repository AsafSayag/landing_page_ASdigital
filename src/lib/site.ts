/* מקור אמת יחיד לכתובת האתר. שנה כאן כשהדומיין נקבע סופית
   (או הגדר NEXT_PUBLIC_SITE_URL בסביבת הפריסה). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://as-digital.co.il"
).replace(/\/$/, "");
