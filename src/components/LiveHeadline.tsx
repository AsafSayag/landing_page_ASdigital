"use client";

import { Fragment, useEffect, useRef } from "react";

/* כותרת ההירו, עם משקל שמגיב לקרבת העכבר.

   Open Sans הוא פונט משתנה (ציר wght בטווח 300–800), ולכן אפשר להזיז כל אות
   ברצף בין משקלים במקום להחליף גופן. כל אות מקבלת משקל לפי המרחק שלה מהסמן,
   והתוצאה היא גל עבה שנע לאורך הכותרת בעקבות היד.

   שלוש הערות מימוש שחשוב לא לשבור:
   1. הרוחב של כל אות ננעל פעם אחת במשקל הבסיס. בלי זה כל שינוי משקל היה משנה
      את רוחב האות ומזיז את כל השורה — הכותרת הייתה "קופצת" תחת העכבר.
   2. המדידה מחכה ל-document.fonts.ready, אחרת היא רצה על פונט הגיבוי.
   3. הערכים מתכנסים ליעד בלרפ בתוך rAF ולא נקבעים ישירות, כדי שהגל ירגיש נוזלי
      וייעצר ברכות כשהעכבר יוצא.

   ה-h1 נושא aria-label עם הטקסט המלא, והפיצול לאותיות מוסתר מקוראי מסך. */
export default function LiveHeadline({ lead, accent }: { lead: string; accent: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.closest<HTMLElement>(".hero");
    if (!root || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>(".lt"));
    if (!letters.length) return;

    const range = letters.map((l) => {
      const line = l.closest<HTMLElement>("[data-base]");
      return { base: Number(line?.dataset.base ?? 300), peak: Number(line?.dataset.peak ?? 700) };
    });

    /* שני רדיוסים ולא אחד: הכותרת היא פס אופקי, ולכן סטייה אנכית קטנה של
       העכבר לא אמורה לכבות את האפקט. */
    const RX = 210;
    const RY = 150;
    let points: { x: number; y: number }[] = [];
    const cur = new Float32Array(letters.length);
    let cx = -9999;
    let cy = -9999;
    let active = false;
    let frame = 0;
    let alive = true;

    /* נועלים רוחב ומודדים מרכזים ביחס להירו — ככה גלילה לא מבטלת את המדידה */
    const lock = () => {
      letters.forEach((l) => { l.style.width = ""; });
      const widths = letters.map((l) => l.getBoundingClientRect().width);
      letters.forEach((l, i) => { l.style.width = `${widths[i].toFixed(2)}px`; });
      const hr = hero.getBoundingClientRect();
      points = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2 };
      });
    };

    const tick = () => {
      frame = 0;
      let moving = false;
      for (let i = 0; i < letters.length; i++) {
        let target = 0;
        if (active) {
          const p = points[i];
          const d = Math.hypot((p.x - cx) / RX, (p.y - cy) / RY);
          const n = Math.max(0, 1 - d);
          target = n * n * (3 - 2 * n);
        }
        const next = cur[i] + (target - cur[i]) * 0.16;
        if (Math.abs(target - next) > 0.002 || Math.abs(next - cur[i]) > 0.002) moving = true;
        cur[i] = next;
        const { base, peak } = range[i];
        letters[i].style.fontVariationSettings = `"wght" ${Math.round(base + (peak - base) * next)}`;
      }
      if (moving && alive) frame = requestAnimationFrame(tick);
    };

    const run = () => { if (!frame && alive) frame = requestAnimationFrame(tick); };

    const onMove = (e: PointerEvent) => {
      const hr = hero.getBoundingClientRect();
      cx = e.clientX - hr.left;
      cy = e.clientY - hr.top;
      active = true;
      run();
    };
    const onLeave = () => { active = false; run(); };
    const onResize = () => { lock(); run(); };

    let ro: ResizeObserver | undefined;
    void document.fonts.ready.then(() => {
      if (!alive) return;
      lock();
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
      ro = new ResizeObserver(onResize);
      ro.observe(hero);
    });

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      ro?.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      letters.forEach((l) => { l.style.width = ""; l.style.fontVariationSettings = ""; });
    };
  }, [lead, accent]);

  return (
    <h1 ref={ref} className="h1 hero__title rise rise-2" aria-label={`${lead} ${accent}`}>
      <span className="hero__line" data-base="300" data-peak="780" aria-hidden="true">
        <Split text={lead} />
      </span>
      <em className="hero__line hero__title-accent" data-base="700" data-peak="800" aria-hidden="true">
        <Split text={accent} />
      </em>
    </h1>
  );
}

/* מילה היא inline-block כדי שלא תישבר באמצע; האותיות בתוכה הן שנושאות משקל.
   הרווח הוא טקסט-נוד *בין* המילים ולא בתוכן — רווח בסוף inline-block נגזר,
   והעתקה מהדף הייתה מחזירה את המילים דבוקות. */
function Split({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, w) => (
        <Fragment key={`${word}-${w}`}>
          <span className="lt-word">
            {Array.from(word).map((ch, i) => (
              <span className="lt" key={i}>
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
