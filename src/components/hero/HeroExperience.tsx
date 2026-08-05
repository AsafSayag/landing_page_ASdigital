"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  INTRO,
  Q1,
  Q1_LINK,
  Q1_SOURCE,
  Q2,
  Q3,
  Q4,
  INSIGHTS,
  ECHO_LINE,
  ECHO_DEPTH,
  GOAL_LINE,
  URGENCY_LINE,
  DIAG_FORM,
  SYSTEM_PROGRESS,
} from "@/lib/hero-diagnosis";
import { whatsappHref } from "@/lib/content";
import { ArrowIcon } from "@/components/icons";
import CloudEmblem from "./CloudEmblem";
import "./hero.css";

const TwinCanvas = dynamic(() => import("./TwinCanvas"), { ssr: false });

type Phase = "q1" | "q1link" | "q1source" | "q2" | "q3" | "q4" | "form";


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

type Answers = {
  q1?: string; q1id?: string;
  q1src?: string; q1srcid?: string;
  q2?: string; q2id?: string;
  q3?: string; q3id?: string;
  q4?: string; q4id?: string;
};

export default function HeroExperience() {
  const [mounted, setMounted] = useState(false);
  const webgl = useWebGL();

  const [phase, setPhase] = useState<Phase>("q1");
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [siteUrl, setSiteUrl] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  /* הקלפים מונפשים עם עיכוב פתיחה רק בטעינה הראשונה */
  const [firstPaint, setFirstPaint] = useState(true);

  useEffect(() => setMounted(true), []);

  /* בחירת תשובה: מצב פעיל → זרימת חלקיקים → השאלה הבאה נכנסת ברוגע */
  const advance = (next: Phase, patch: Answers, id: string) => {
    if (locked) return;
    setSelected(id);
    setLocked(true);
    setFirstPaint(false);
    // האנרגיה נספגת סביב הענן, ורק אז השאלה הבאה. את התשובות שומרים כאן
    // ולא בלחיצה — כך הכותרת המהדהדת מתחלפת *יחד* עם השאלה, לא לפניה.
    setTimeout(() => {
      setAnswers((a) => ({ ...a, ...patch }));
      setPhase(next);
      setSelected(null);
      setLocked(false);
    }, 1150);
  };

  const insight = answers.q1id ? INSIGHTS[answers.q1id] : "";
  /* הכותרת המכווצת מהדהדת תמיד את הבחירה *האחרונה* — כך היא מתחלפת
     בכל שאלה ולא נתקעת על התשובה הראשונה. */
  const lastId =
    answers.q4id ?? answers.q3id ?? answers.q2id ?? answers.q1srcid ?? answers.q1id;
  const echo = lastId ? ECHO_LINE[lastId] : "";
  /* התג מתכהה עם כל תשובה — מזכוכית שקופה בהתחלה לרקע אטום בסוף */
  const echoDepth = ECHO_DEPTH[phase] ?? 0;
  const goal = answers.q2id ? GOAL_LINE[answers.q2id] : "";
  const urgency = answers.q4id ? URGENCY_LINE[answers.q4id] : "";

  const waHref = useMemo(() => {
    const lines = [
      "היי אסף, סיימתי את האבחון באתר של AS digital 👋",
      answers.q1 && `מצב נוכחי: ${answers.q1}`,
      answers.q1src && `מאיפה מגיעים לקוחות היום: ${answers.q1src}`,
      siteUrl && `קישור: ${siteUrl}`,
      answers.q2 && `מטרה: ${answers.q2}`,
      answers.q3 && `תחום: ${answers.q3}`,
      answers.q4 && `לוח זמנים: ${answers.q4}`,
      name && `שם: ${name}`,
      phone && `טלפון: ${phone}`,
      "אשמח לשיחת אפיון.",
    ].filter(Boolean) as string[];
    return whatsappHref(lines.join("\n"));
  }, [answers, siteUrl, name, phone]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waHref, "_blank", "noopener,noreferrer");
  };

  const progress = SYSTEM_PROGRESS[phase] ?? 0.15;
  const focus = 0.9;

  /* מודדים את מרכז האמבלם *ביחס לקנבס* (לא לחלון!) — הקנבס ממלא את
     ה-section, שיכול להיות גבוה מהמסך (למשל בשלב הטופס). חישוב מול
     window היה מסיט את ההילה בעשרות פיקסלים. */
  const heroRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const [targetNdc, setTargetNdc] = useState({ x: 0, y: 0.35 });
  const measure = useCallback(() => {
    const hero = heroRef.current;
    const el = cloudRef.current;
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
          {/* ---------- אמבלם "העסק שלך" ---------- */}
          <div className="dtx-rise" style={{ ["--d" as string]: "0.05s" }}>
            <CloudEmblem ref={cloudRef} />
          </div>

          {/* ---------- כותרת ראשית — נראית מיד ---------- */}
          <div
            className={`dtx-headline dtx-rise ${phase !== "q1" ? "dtx-headline--compact" : ""}`}
            style={{ ["--d" as string]: "0.2s", ["--echo-depth" as string]: echoDepth }}
          >
            <h1 className="dtx-h1">
              {echo ? (
                /* key — כדי שמעבר בין תשובות יפעיל מחדש את אנימציית הכניסה */
                <span key={echo} className="dtx-h1__l2 dtx-h1__echo">
                  {echo}
                </span>
              ) : (
                <>
                  <span className="dtx-h1__l1">{INTRO.line1}</span>
                  <span className="dtx-h1__l2">
                    <span className="dtx-h1__a">{INTRO.line2a}</span>{" "}
                    <span className="dtx-h1__b">{INTRO.line2b}</span>
                  </span>
                </>
              )}
            </h1>
          </div>

          <p className="dtx-sub dtx-rise" style={{ ["--d" as string]: "0.6s" }}>
            {INTRO.sub}
          </p>

          {/* ---------- שלבים ---------- */}
          <div className="dtx-step">
            <div key={phase} className="dtx-step__inner">
              {phase === "q1" && (
                <StepBlock q={Q1} locked={locked} base={cardsBase}>
                  {Q1.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() =>
                        advance(
                          o.id === "site-weak" ? "q1link" : o.id === "no-site" ? "q1source" : "q2",
                          { q1: o.label, q1id: o.id },
                          o.id
                        )
                      }
                    >
                      {o.label}
                    </DiagCard>
                  ))}
                </StepBlock>
              )}

              {phase === "q1source" && (
                /* השאלה מוצגת בתג הזכוכית שמעל, ולכן כאן רק האפשרויות */
                <div className={`dtx-stepblock ${locked ? "is-locked" : ""}`}>
                  <div className="dtx-cards">
                    {Q1_SOURCE.options.map((o, i) => (
                      <DiagCard
                        key={o.id}
                        i={i}
                        base={cardsBase}
                        selected={selected === o.id}
                        dimmed={!!selected && selected !== o.id}
                        onClick={() => advance("q2", { q1src: o.label, q1srcid: o.id }, o.id)}
                      >
                        {o.label}
                      </DiagCard>
                    ))}
                  </div>
                </div>
              )}

              {phase === "q1link" && (
                <div className="dtx-stepblock">
                  <StepHead title={Q1_LINK.title} lead={Q1_LINK.lead} />
                  <form
                    className="dtx-linkrow"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFirstPaint(false);
                      setPhase("q2");
                    }}
                  >
                    <input
                      className="field ltr dtx-linkinput"
                      type="url"
                      dir="ltr"
                      inputMode="url"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder={Q1_LINK.placeholder}
                      aria-label={Q1_LINK.title}
                    />
                    <div className="dtx-linkbtns">
                      <button type="submit" className="glass-btn glass-btn--primary">
                        {Q1_LINK.submit}
                        <ArrowIcon width={18} height={18} />
                      </button>
                      <button
                        type="button"
                        className="dtx-skip"
                        onClick={() => {
                          setSiteUrl("");
                          setFirstPaint(false);
                          setPhase("q2");
                        }}
                      >
                        {Q1_LINK.skip}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {phase === "q2" && (
                <StepBlock q={Q2} locked={locked} base={cardsBase}>
                  {Q2.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() => advance("q3", { q2: o.label, q2id: o.id }, o.id)}
                    >
                      {o.label}
                    </DiagCard>
                  ))}
                </StepBlock>
              )}

              {phase === "q3" && (
                <StepBlock q={Q3} locked={locked} base={cardsBase}>
                  {Q3.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() => advance("q4", { q3: o.label, q3id: o.id }, o.id)}
                    >
                      {o.label}
                    </DiagCard>
                  ))}
                </StepBlock>
              )}

              {phase === "q4" && (
                <StepBlock q={Q4} locked={locked} base={cardsBase}>
                  {Q4.options.map((o, i) => (
                    <DiagCard
                      key={o.id}
                      i={i}
                      base={cardsBase}
                      selected={selected === o.id}
                      dimmed={!!selected && selected !== o.id}
                      onClick={() => advance("form", { q4: o.label, q4id: o.id }, o.id)}
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
                        <span className="dtx-insight__label">{DIAG_FORM.insightLabel}</span>
                        <p className="dtx-insight__text">{insight}</p>
                        {goal && <p className="dtx-insight__goal">{goal}</p>}
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

        <a href="#services" className="dtx-scroll" aria-label="המשיכו לתוכן">
          <span>{INTRO.hint}</span>
          <span className="dtx-scroll__mouse">
            <span />
          </span>
        </a>
      </div>
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
  q: { n: string; title: string; lead?: string };
  locked?: boolean;
  base: number;
  children: React.ReactNode;
}) {
  return (
    <div className={`dtx-stepblock ${locked ? "is-locked" : ""}`}>
      <div className="dtx-rise" style={{ ["--d" as string]: `${Math.max(base - 0.25, 0)}s` }}>
        <StepHead title={q.title} lead={q.lead} />
      </div>
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
