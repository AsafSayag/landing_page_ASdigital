"use client";

import { useEffect } from "react";
import { flushLeadDraft } from "@/lib/save-lead";

/** מאזין יחיד לכל קישורי הוואטסאפ באתר — ה-FAB, ההדר, כפתורי ה-CTA
    ועמודי המידע. עובד בהאזנה מואצלת ולא ב-onClick על כל כפתור, כי רוב
    הכפתורים יושבים ב-Server Components שאין להם handlers. */
export default function LeadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;
      const label = (link.getAttribute("aria-label") || link.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
      flushLeadDraft(label ? `כפתור וואטסאפ — ${label}` : "כפתור וואטסאפ");
    };
    /* capture — כדי לתפוס את הלחיצה גם אם רכיב פנימי עוצר את הבועה. */
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
