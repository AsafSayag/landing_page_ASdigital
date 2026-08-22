"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  INTRO,
  Q_STATE,
  Q_LINK,
  Q_SOURCE,
  Q_TIMING,
  INSIGHTS,
  ECHO_LINE,
  ECHO_DEPTH,
  URGENCY_LINE,
  HERO_CTA,
  HERO_PROOF,
  DIAG_INTRO,
  DIAG_FORM,
  SYSTEM_PROGRESS,
} from "@/lib/hero-diagnosis";
import { whatsappHref } from "@/lib/content";
import { saveLead, updateLeadDraft } from "@/lib/save-lead";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import SentModal from "@/components/SentModal";
import "./hero.css";

const TwinCanvas = dynamic(() => import("./TwinCanvas"), { ssr: false });

type Phase = "state" | "link" | "source" | "timing" | "form";


function useWebGL() {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/* בפריסת הערימה שתי העדויות לא מוצגות זו מתחת לזו אלא מתחלפות במקומן.
   20 שניות זה קצב איטי בכוונה: מספיק זמן לקרוא בנחת, ומספיק נדיר כדי
   שההחלפה לא תתחרה על תשומת הלב עם הכותרת וה-CTA.
   1259px הוא בדיוק המשלים של נקודת השבירה שבה הן עוברות לצדדים. */
const PROOF_ROTATE_MS = 20_000;

function useProofCarousel(count: number) {
  const [carousel, setCarousel] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1259px)");
    const sync = () => setCarousel(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* הטיימר נבנה מחדש בכל החלפה — כך לחיצה על נקודה מאפסת את הספירה
     ולא משאירה את הכרטיס החדש על המסך לשבריר שנייה בלבד. */
  useEffect(() => {
    if (!carousel || count < 2) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % count), PROOF_ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [carousel, count, idx]);

  return { idx, setIdx };
}

type Answers = {
  state?: string; stateId?: string;      // נקודת הפתיחה
  src?: string; srcId?: string;          // מקור הלקוחות (למי שאין אתר)
  timing?: string; timingId?: string;    // לוח זמנים
};

export default function HeroExperience() {
  const [mounted, setMounted] = useState(false);
  const webgl = useWebGL();

  const [phase, setPhase] = useState<Phase>("state");
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [siteUrl, setSiteUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  /* הקלפים מונפשים עם עיכוב פתיחה רק בטעינה הראשונה */
  const [firstPaint, setFirstPaint] = useState(true);
  /* אישור השליחה — מחליף את המעבר לוואטסאפ */
  const [sentOpen, setSentOpen] = useState(false);
  /* העדות המוצגת בפריסת הערימה (בדסקטופ שתיהן גלויות ממילא) */
  const { idx: proofIdx, setIdx: setProofIdx } = useProofCarousel(HERO_PROOF.length);

  useEffect(() => setMounted(true), []);

  /* אחרי כל מעבר שלב המסך חוזר לראש העמוד: השאלה הבאה נכנסת שם, ובלי
     זה משתמש שגלל למטה נשאר מול תוכן שהתחלף מתחתיו. */
  const scrollToTop = useCallback(() => {
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("a11y-no-motion");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  /* בחירת תשובה: מצב פעיל → זרימת חלקיקים → השאלה הבאה נכנסת ברוגע */
  const advance = (next: Phase, patch: Answers, id: string) => {
    if (locked) return;
    setSelected(id);
    setLocked(true);
    setFirstPaint(false);
    scrollToTop();
    // האנרגיה נספגת סביב הענן, ורק אז השאלה הבאה. את התשובות שומרים כאן
    // ולא בלחיצה — כך הכותרת המהדהדת מתחלפת *יחד* עם השאלה, לא לפניה.
    setTimeout(() => {
      setAnswers((a) => ({ ...a, ...patch }));
      setPhase(next);
      setSelected(null);
      setLocked(false);
    }, 1150);
  };

  /* התובנה נגזרת מנקודת הפתיחה */
  const insight = answers.stateId ? INSIGHTS[answers.stateId] : "";
  /* הכותרת המכווצת מהדהדת תמיד את הבחירה *האחרונה* — כך היא מתחלפת
     בכל שאלה ולא נתקעת על התשובה הראשונה. */
  const lastId = answers.timingId ?? answers.srcId ?? answers.stateId;
  const echo = lastId ? ECHO_LINE[lastId] : "";
  /* התג מתכהה עם כל תשובה — מזכוכית שקופה בהתחלה לרקע אטום בסוף */
  const echoDepth = ECHO_DEPTH[phase] ?? 0;
  const urgency = answers.timingId ? URGENCY_LINE[answers.timingId] : "";

  /* סיכום האבחון — נכנס לעמודת ההודעה בגיליון, כדי שהליד יישמר עם
     ההקשר ולא רק עם שם וטלפון. */
  const summary = useMemo(
    () =>
      [
        answers.state && `מצב נוכחי: ${answers.state}`,
        answers.src && `מאיפה מגיעים לקוחות היום: ${answers.src}`,
        siteUrl && `קישור: ${siteUrl}`,
        answers.timing && `לוח זמנים: ${answers.timing}`,
      ].filter(Boolean) as string[],
    [answers, siteUrl]
  );

  /* גם אם ינטוש את האבחון באמצע וילחץ על כפתור וואטסאפ אחר — התשובות
     והפרטים שכבר מילא ילכו איתו לגיליון. */
  useEffect(() => {
    updateLeadDraft({ name, phone, message: summary.join(" | ") });
  }, [name, phone, summary]);

  /* הליד נכתב לגיליון בדיוק כמו קודם; מה שהתחלף הוא מה שקורה אחר כך —
     במקום לזרוק את המשתמש לוואטסאפ, נשארים באתר עם אישור קצר.
     בעבר המעבר לוואטסאפ הוציא את המשתמש מהעמוד, ולכן שליחה כפולה כמעט
     לא קרתה. עכשיו הטופס נשאר מלא מולו — ולחיצה נוספת הייתה מוסיפה
     שורה זהה לגיליון. שולחים רק כששם או טלפון באמת השתנו. */
  const submittedKey = useRef<string | null>(null);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${name.trim()}|${phone.trim()}`;
    if (submittedKey.current !== key) {
      submittedKey.current = key;
      saveLead({ name, phone, message: summary.join(" | ") }, "אבחון דיגיטלי");
    }
    setSentOpen(true);
  };

  const progress = SYSTEM_PROGRESS[phase] ?? 0.15;
  const focus = 0.9;

  /* נקודת ההתכנסות של החלקיקים היא הכותרת — מודדים את מרכזה *ביחס
     לקנבס* (לא לחלון!), כי הקנבס ממלא את ה-section שיכול להיות גבוה
     מהמסך (למשל בשלב הטופס). חישוב מול window היה מסיט את ההילה
     בעשרות פיקסלים. */
  const heroRef = useRef<HTMLElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const [targetNdc, setTargetNdc] = useState({ x: 0, y: 0.35 });
  const measure = useCallback(() => {
    const hero = heroRef.current;
    const el = focusRef.current;
    if (!hero || !el) return;
    const box = hero.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const r = el.getBoundingClientRect();
    const nx = ((r.left + r.width / 2 - box.left) / box.width) * 2 - 1;
    const ny = -(((r.top + r.height / 2 - box.top) / box.height) * 2 - 1);
    setTargetNdc((prev) =>
      Math.abs(prev.x - nx) < 0.002 && Math.abs(prev.y - ny) < 0.002 ? prev : { x: nx, y: ny }
    );
  }, []);

  useEffect(() => {
    // שתי פעימות rAF: מודדים אחרי שאנימציית הכניסה (translateY) התיישבה
    let f2 = 0;
    const f1 = requestAnimationFrame(() => {
      measure();
      f2 = requestAnimationFrame(measure);
    });
    const t = setTimeout(measure, 900);
    const ro = new ResizeObserver(measure);
    if (heroRef.current) ro.observe(heroRef.current);
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
      clearTimeout(t);
      ro.disconnect();
    };
  }, [measure, phase]);

  /* עיכובי הכניסה לפי הבריף: כותרת 0.2s · תת-כותרת 0.6s · קלפים 0.9s */
  const cardsBase = firstPaint ? 0.9 : 0.12;

  return (
    <section id="top" ref={heroRef} className="dtx" data-phase={phase} aria-label="אבחון דיגיטלי — AS digital">
      <div className="dtx-bg" aria-hidden="true">
        <div className="dtx-volume" />
        {/* שכבות אור רכות — נותנות נפח בלי להאיר את הטקסט יתר על המידה */}
        <div className="dtx-lights">
          <span className="dtx-ray dtx-ray--a" />
          <span className="dtx-ray dtx-ray--b" />
        </div>
      </div>

      <div className="dtx-canvas" aria-hidden="true">
        {mounted && webgl ? (
          <TwinCanvas progress={progress} focus={focus} targetNdc={targetNdc} />
        ) : (
          <div className="dtx-orb-fallback" />
        )}
      </div>

      <div className="dtx-overlay">
        <div className="container-x dtx-content">
          {/* ---------- כותרת ראשית — נראית מיד ---------- */}
          <div
            ref={focusRef}
            className={`dtx-headline dtx-rise ${phase !== "state" ? "dtx-headline--compact" : ""}`}
            style={{ ["--d" as string]: "0.2s", ["--echo-depth" as string]: echoDepth }}
          >
            <h1 className="dtx-h1">
              {echo ? (
                /* key — כדי שמעבר בין תשובות יפעיל מחדש את אנימציית הכניסה */
                <span key={echo} className="dtx-h1__l2 dtx-h1__echo">
                  {echo}
                </span>
              ) : (
                <span className="dtx-h1__l2">
                  <span className="dtx-h1__a">{INTRO.titleA}</span>{" "}
                  <span className="dtx-h1__b">{INTRO.titleB}</span>
                </span>
              )}
            </h1>
            {!echo && <p className="dtx-sub">{INTRO.sub}</p>}
          </div>

          {/* ---------- הפעולה הראשית ----------
              קישור wa.me רגיל בכוונה: LeadTracker מאזין בדלגציה על
              a[href*="wa.me"] ורושם את הפנייה. הוספת onClick משלנו כאן
              הייתה מייצרת אירוע כפול על אותה לחיצה. */}
          {phase === "state" && (
            <div className="dtx-cta dtx-rise" style={{ ["--d" as string]: "0.35s" }}>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn glass-btn--primary dtx-cta__btn"
                aria-label={HERO_CTA.label}
              >
                <WhatsAppIcon className="glass-btn__icon" />
                {HERO_CTA.label}
              </a>
              <p className="dtx-cta__reassure">{HERO_CTA.reassure}</p>
            </div>
          )}

          {/* המעבר למסלול המשני: קו הפרדה ואחריו כותרת שמסבירה למי
              השאלון מיועד. שתי השורות והקו יושבים באותו בלוק כדי
              שההיררכיה "מוכן לדבר / עוד מתלבט" תיקרא במבט אחד. */}
          {phase === "state" && (
            <div className="dtx-secondary dtx-rise" style={{ ["--d" as string]: "0.5s" }}>
              <div className="dtx-divider" aria-hidden="true" />
              <p className="dtx-secondary__title">{DIAG_INTRO.title}</p>
              <p className="dtx-secondary__lead">{DIAG_INTRO.lead}</p>
            </div>
          )}

          {/* ---------- שלבים ---------- */}
          <div className="dtx-step">
            <div key={phase} className="dtx-step__inner">
              {phase === "state" && (
                <StepBlock q={Q_STATE} locked={locked} base={cardsBase}>
                  {Q_STATE.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() =>
                        advance(
                          o.id === "site-weak" ? "link" : o.id === "no-site" ? "source" : "timing",
                          { state: o.label, stateId: o.id },
                          o.id
                        )
                      }
                    >
                      {o.label}
                    </DiagCard>
                  ))}
                </StepBlock>
              )}

              {phase === "source" && (
                /* השאלה מוצגת בתג הזכוכית שמעל, ולכן כאן רק האפשרויות */
                <div className={`dtx-stepblock ${locked ? "is-locked" : ""}`}>
                  <div className="dtx-cards">
                    {Q_SOURCE.options.map((o, i) => (
                      <DiagCard
                        key={o.id}
                        i={i}
                        base={cardsBase}
                        selected={selected === o.id}
                        dimmed={!!selected && selected !== o.id}
                        onClick={() => advance("timing", { src: o.label, srcId: o.id }, o.id)}
                      >
                        {o.label}
                      </DiagCard>
                    ))}
                  </div>
                </div>
              )}

              {phase === "link" && (
                <div className="dtx-stepblock">
                  <StepHead title={Q_LINK.title} lead={Q_LINK.lead} />
                  <form
                    className="dtx-linkrow"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFirstPaint(false);
                      setPhase("timing");
                      scrollToTop();
                    }}
                  >
                    <input
                      className="field ltr dtx-linkinput"
                      type="url"
                      dir="ltr"
                      inputMode="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder={Q_LINK.placeholder}
                      aria-label={Q_LINK.title}
                    />
                    <div className="dtx-linkbtns">
                      <button type="submit" className="glass-btn glass-btn--primary">
                        {Q_LINK.submit}
                        <ArrowIcon width={18} height={18} />
                      </button>
                      <button
                        type="button"
                        className="dtx-skip"
                        onClick={() => {
                          setSiteUrl("");
                          setFirstPaint(false);
                          setPhase("timing");
                          scrollToTop();
                        }}
                      >
                        {Q_LINK.skip}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {phase === "timing" && (
                <StepBlock q={Q_TIMING} locked={locked} base={cardsBase}>
                  {Q_TIMING.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() => advance("form", { timing: o.label, timingId: o.id }, o.id)}
                    >
                      {o.label}
                    </DiagCard>
                  ))}
                </StepBlock>
              )}

              {phase === "form" && (
                <div className="dtx-form-wrap dtx-rise" style={{ ["--d" as string]: "0.5s" }}>
                  <div className="dtx-form">
                    <p className="eyebrow">{DIAG_FORM.eyebrow}</p>
                    <h2 className="dtx-form__title">{DIAG_FORM.title}</h2>

                    {insight && (
                      <div className="dtx-insight">
                        <p className="dtx-insight__text">{insight}</p>
                        {urgency && <p className="dtx-insight__urgency">{urgency}</p>}
                      </div>
                    )}

                    <p className="dtx-form__sub">{DIAG_FORM.sub}</p>

                    <form onSubmit={onSubmit} className="dtx-form__grid">
                      <div>
                        <label htmlFor="dtx-name" className="field-label">
                          {DIAG_FORM.nameLabel}
                        </label>
                        <input
                          id="dtx-name"
                          className="field"
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={DIAG_FORM.namePlaceholder}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="dtx-phone" className="field-label">
                          {DIAG_FORM.phoneLabel}
                        </label>
                        <input
                          id="dtx-phone"
                          className="field ltr"
                          type="tel"
                          inputMode="tel"
                          dir="ltr"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={DIAG_FORM.phonePlaceholder}
                          required
                        />
                      </div>
                      <button type="submit" className="glass-btn glass-btn--primary dtx-form__submit">
                        {DIAG_FORM.submit}
                      </button>
                    </form>
                    <p className="dtx-form__reassure">{DIAG_FORM.reassure}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* הוכחה חברתית — בדסקטופ בפינות התחתונות משני צדי הקומפוזיציה,
            במובייל בערימה מסודרת מתחת לכפתורים, פתוחה תמיד ומתחת לקיפול.
            בשלב הטופס היא יורדת, כדי לא להתחרות ברגע ההמרה. */}
        {phase !== "form" && (
          <div className="dtx-proof">
            {/* עוטף פנימי — בפריסת הערימה הוא הגריד של הערימה, ובדסקטופ
                הוא display:contents והכרטיסים חוזרים להיות ילדים ישירים
                של ה-flex. */}
            <div className="dtx-proof__inner">
              {HERO_PROOF.map((t, i) => (
                <figure
                  key={t.name}
                  className={`dtx-quote dtx-rise${i === proofIdx ? " is-current" : ""}`}
                  style={{ ["--d" as string]: `${(firstPaint ? 1.5 : 0.5) + i * 0.12}s` }}
                >
                  <blockquote className="dtx-quote__text">{t.quote}</blockquote>
                  <figcaption className="dtx-quote__by">
                    <span className="dtx-quote__name">{t.name}</span>
                    <span className="dtx-quote__role">{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            {/* נקודות הניווט — רק בפריסת הערימה, שם מוצגת עדות אחת בכל רגע.
                בלעדיהן ההחלפה נראית כמו תוכן שמתחלף מעצמו בלי סיבה.
                הכרטיס הלא-פעיל מוסתר ב-visibility ולכן ממילא לא בעץ הנגישות. */}
            {HERO_PROOF.length > 1 && (
              <div className="dtx-proof__dots">
                {HERO_PROOF.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    className={`dtx-proof__dot${i === proofIdx ? " is-current" : ""}`}
                    aria-label={`עדות ${i + 1} מתוך ${HERO_PROOF.length}`}
                    aria-current={i === proofIdx}
                    onClick={() => setProofIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <a href="#services" className="dtx-scroll" aria-label="המשיכו לתוכן">
          <span>{INTRO.hint}</span>
          <span className="dtx-scroll__mouse">
            <span />
          </span>
        </a>
      </div>

      <SentModal open={sentOpen} onClose={() => setSentOpen(false)} />
    </section>
  );
}

function StepHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <>
      <div className="dtx-step__head">
        <h2 className="dtx-step__title">{title}</h2>
      </div>
      {lead && <p className="dtx-step__lead">{lead}</p>}
    </>
  );
}

function StepBlock({
  q,
  locked,
  base,
  children,
}: {
  /* options נדרש כאן רק כדי ש-Q_STATE (שאין לו יותר title) לא ייפול על
     בדיקת ה-weak type של TS — טיפוס שכל שדותיו אופציונליים דוחה אובייקט
     בלי אף שדה משותף. */
  q: { title?: string; lead?: string; options: { id: string; label: string }[] };
  locked?: boolean;
  base: number;
  children: React.ReactNode;
}) {
  /* שלב בלי כותרת (שאלת הפתיחה) לא מרנדר את בלוק הראש בכלל — עוטף ריק
     היה משאיר את המרווח שמעל הקלפים ותו לא. --nohead מבטל גם אותו. */
  return (
    <div
      className={`dtx-stepblock ${q.title ? "" : "dtx-stepblock--nohead"} ${locked ? "is-locked" : ""}`}
    >
      {q.title && (
        <div className="dtx-rise" style={{ ["--d" as string]: `${Math.max(base - 0.25, 0)}s` }}>
          <StepHead title={q.title} lead={q.lead} />
        </div>
      )}
      <div className="dtx-cards">{children}</div>
    </div>
  );
}

function DiagCard({
  i,
  base,
  selected,
  dimmed,
  onClick,
  children,
}: {
  i: number;
  base: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`dtx-card dtx-rise ${selected ? "is-selected" : ""} ${dimmed ? "is-dimmed" : ""}`}
      onClick={onClick}
      style={{ ["--d" as string]: `${base + i * 0.12}s` }}
    >
      <span className="dtx-card__label">{children}</span>
      <ArrowIcon className="dtx-card__arrow" width={18} height={18} />
    </button>
  );
}
