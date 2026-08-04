"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_SCROLL } from "@/lib/content";
import "./process-scroll.css";

/* ---------------------------------------------------------------------------
   סקשן וידאו נגלל: הסרטון "מתנגן" לפי מיקום הגלילה (scrubbing),
   הכותרות נכנסות אחת-אחרי-השנייה, ופס דק מראה את ההתקדמות.
   הסרטון מקודד עם keyframes צפופים כדי שה-seek יהיה חלק.

   ביצועים: הווידאו לא נטען עד שמתקרבים לסקשן, ולולאת ה-rAF רצה
   רק כשהסקשן באמת על המסך.
--------------------------------------------------------------------------- */

const STEPS = PROCESS_SCROLL.steps;

export default function ProcessScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  const targetT = useRef(0);
  const currentT = useRef(0);
  const rafId = useRef(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  /* טעינת הווידאו רק כשמתקרבים — לא מתחרה ב-LCP של ההירו */
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          video.preload = "auto";
          video.load();
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  /* scrubbing — פעיל רק כשהסקשן על המסך */
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let onScreen = false;

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));

      const dur = video.duration;
      if (Number.isFinite(dur) && dur > 0) targetT.current = p * (dur - 0.05);

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const tick = () => {
      rafId.current = requestAnimationFrame(tick);
      const gap = targetT.current - currentT.current;
      // החלקה אדפטיבית: מדביק פערים גדולים מהר, ונשאר חלק בגלילה רגילה
      currentT.current += gap * Math.min(0.45, 0.14 + Math.abs(gap) * 0.12);
      if (video.readyState >= 2 && Math.abs(video.currentTime - currentT.current) > 0.02) {
        try {
          video.currentTime = currentT.current;
        } catch {
          /* seek עוד לא זמין */
        }
      }
    };

    const start = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    };

    const onScroll = () => {
      readScroll();
      if (onScreen) start();
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(section);

    readScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    video.addEventListener("loadedmetadata", readScroll);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", readScroll);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="pscroll"
      aria-label={PROCESS_SCROLL.eyebrow}
    >
      <div className="pscroll-sticky">
        {!reduced && (
          <video
            ref={videoRef}
            className="pscroll-video"
            src="/video/process.mp4"
            poster="/video/process-poster.jpg"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}

        {/* שכבות מיזוג לצבעי המותג */}
        <div className="pscroll-grade" aria-hidden="true" />
        <div className="pscroll-vignette" aria-hidden="true" />

        <div className="pscroll-inner container-x">
          <p className="pscroll-eyebrow">{PROCESS_SCROLL.eyebrow}</p>

          <div className="pscroll-stage">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className={`pscroll-step ${
                  i === active ? "is-active" : i < active ? "is-past" : "is-next"
                }`}
              >
                <h2 className="pscroll-title">{s.title}</h2>
                <p className="pscroll-body">{s.body}</p>
              </div>
            ))}
          </div>

          <ol className="pscroll-dots" aria-hidden="true">
            {STEPS.map((s, i) => (
              <li key={s.title} className={i <= active ? "is-on" : ""} />
            ))}
          </ol>
        </div>

        <div className="pscroll-bar" aria-hidden="true">
          <span ref={barRef} className="pscroll-bar__fill" />
        </div>
      </div>
    </section>
  );
}
