"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   ThemeShift — מעבר צבע אנימטיבי בין תמה כהה לבהירה (ולהפך).
   הצבע "נמרח" אלכסונית לפי מיקום הגלילה (scrub): המשתמש רואה את ההחלפה
   קורית בזמן אמת, עם קצה זוהר ופס אור שחולף. ערך ההתקדמות --p (0→1)
   מחושב מיחס המיקום של הרצועה ביחס לחלון.
--------------------------------------------------------------------------- */

export default function ThemeShift({
  variant,
}: {
  variant: "to-light" | "to-dark";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.style.setProperty("--p", "1");
      return;
    }

    let raf = 0;
    let onScreen = false;

    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // p=0 כשהרצועה נכנסת מלמטה, p=1 כשהיא יוצאת מהחלק העליון
      const p = (vh - r.top) / (vh + r.height);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
      raf = onScreen ? requestAnimationFrame(tick) : 0;
    };

    // רצים בלולאת rAF רק כשהרצועה קרובה/על המסך — חלק ויעיל
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen && !raf) raf = requestAnimationFrame(tick);
      },
      { rootMargin: "40% 0px 40% 0px" }
    );
    io.observe(el);
    tick();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`theme-shift theme-shift--${variant}`} aria-hidden="true">
      <span className="theme-shift__fill" />
      <span className="theme-shift__shine" />
    </div>
  );
}
