/* Google Ads — מזהה תגית ופעולת ההמרה "ליד".
   התגית עצמה נטענת פעם אחת ב-layout.tsx; כאן רק שולחים את האירוע. */
export const GOOGLE_ADS_ID = "AW-18391999533";
const CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/MeZ8CLXchOQcEK3I_sFE`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** נקרא רק אחרי שהשרת אישר שהליד נשמר. gtag מוגדר בסקריפט האתחול
    ב-<head>, אבל ה-optional chaining שומר עלינו אם חוסם פרסומות
    מנע את טעינת התגית — אז פשוט לא נשלח כלום במקום לזרוק שגיאה. */
export function trackLeadConversion() {
  window.gtag?.("event", "conversion", { send_to: CONVERSION_SEND_TO });
}
