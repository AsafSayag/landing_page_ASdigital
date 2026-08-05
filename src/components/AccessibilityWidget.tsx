"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ACCESSIBILITY } from "@/lib/legal";
import { AccessibilityIcon, CloseIcon, ResetIcon } from "./icons";
import "./accessibility.css";

/* ---------------------------------------------------------------------------
   תפריט נגישות — פינה שמאלית תחתונה.

   ההגדרות מוחלות כמחלקות על <html> ונשמרות ב-localStorage. הטעינה הראשונית
   מתבצעת בסקריפט חוסם ב-layout (A11Y_BOOT_SCRIPT) כדי שמשתמש שהגדיל טקסט
   לא יראה הבזק של הגודל המקורי בכל טעינת עמוד.
   --------------------------------------------------------------------------- */

export const A11Y_STORAGE_KEY = "as-digital-a11y";

type Toggle = "contrast" | "gray" | "links" | "readable" | "noMotion";

type A11yState = {
  font: number;
  contrast: boolean;
  gray: boolean;
  links: boolean;
  readable: boolean;
  noMotion: boolean;
};

const DEFAULTS: A11yState = {
  font: 0,
  contrast: false,
  gray: false,
  links: false,
  readable: false,
  noMotion: false,
};

const TOGGLES: { key: Toggle; label: string; hint: string }[] = [
  { key: "contrast", label: "ניגודיות גבוהה", hint: "רקע כהה עם טקסט וקישורים בהירים במיוחד" },
  { key: "gray", label: "גווני אפור", hint: "מבטל את כל הצבעים בדף" },
  { key: "links", label: "הדגשת קישורים", hint: "מסמן כל קישור בקו תחתון ובמסגרת" },
  { key: "readable", label: "גופן קריא", hint: "מחליף לגופן עם צורות אותיות ברורות" },
  { key: "noMotion", label: "עצירת אנימציות", hint: "מקפיא תנועה, וידאו ואפקטים" },
];

/** מחיל את המצב על אלמנט ה-html. מקור אמת יחיד למיפוי state → DOM. */
function apply(state: A11yState) {
  const el = document.documentElement;
  if (state.font > 0) el.dataset.a11yFont = String(state.font);
  else delete el.dataset.a11yFont;
  el.classList.toggle("a11y-contrast", state.contrast);
  el.classList.toggle("a11y-gray", state.gray);
  el.classList.toggle("a11y-links", state.links);
  el.classList.toggle("a11y-readable", state.readable);
  el.classList.toggle("a11y-no-motion", state.noMotion);
  // CSS לא עוצר וידאו — צריך לעשות זאת מפורשות כדי שההבטחה תהיה אמיתית.
  document.querySelectorAll("video").forEach((v) => {
    if (state.noMotion) v.pause();
    else if (v.autoplay) void v.play().catch(() => {});
  });
}

/** הסקריפט שרץ לפני הצביעה הראשונה. חייב להישאר עצמאי — הוא מוזרק כמחרוזת. */
export const A11Y_BOOT_SCRIPT = `
try {
  var s = JSON.parse(localStorage.getItem(${JSON.stringify(A11Y_STORAGE_KEY)}) || "{}");
  var e = document.documentElement;
  if (s.font > 0) e.dataset.a11yFont = String(s.font);
  if (s.contrast) e.classList.add("a11y-contrast");
  if (s.gray) e.classList.add("a11y-gray");
  if (s.links) e.classList.add("a11y-links");
  if (s.readable) e.classList.add("a11y-readable");
  if (s.noMotion) e.classList.add("a11y-no-motion");
} catch (_) {}
`.trim();

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // קריאת ההגדרות השמורות. ה-DOM כבר עודכן על ידי סקריפט האתחול —
  // כאן רק מסנכרנים את ה-state של React כדי שהכפתורים יציגו את המצב הנכון.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(A11Y_STORAGE_KEY);
      if (saved) setState({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {
      /* localStorage חסום — נמשיך עם ברירות המחדל */
    }
  }, []);

  const update = useCallback((next: A11yState) => {
    setState(next);
    apply(next);
    try {
      localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* מצב גלישה פרטית — ההגדרה תחול לסשן הנוכחי בלבד */
    }
  }, []);

  const toggle = (key: Toggle) => update({ ...state, [key]: !state[key] });
  const setFont = (font: number) => update({ ...state, font });
  const reset = () => update(DEFAULTS);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Esc סוגר, ולחיצה מחוץ לתפריט סוגרת.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  // מיקוד הפריט הראשון בתפריט בעת הפתיחה.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open]);

  const activeCount =
    (state.font > 0 ? 1 : 0) + TOGGLES.filter(({ key }) => state[key]).length;

  return (
    <div className="a11y-root">
      <button
        ref={triggerRef}
        type="button"
        className="a11y-fab"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label={`תפריט נגישות${activeCount ? `, ${activeCount} הגדרות פעילות` : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <AccessibilityIcon />
        {activeCount > 0 && (
          <span className="a11y-fab__badge" aria-hidden="true">
            {activeCount}
          </span>
        )}
      </button>

      <div
        ref={panelRef}
        id="a11y-panel"
        className={`a11y-panel ${open ? "a11y-panel--open" : ""}`}
        role="dialog"
        aria-label="תפריט נגישות"
        hidden={!open}
      >
        <div className="a11y-panel__head">
          <h2 className="a11y-panel__title">נגישות</h2>
          <button type="button" className="a11y-close" onClick={close} aria-label="סגירת תפריט הנגישות">
            <CloseIcon />
          </button>
        </div>

        <div className="a11y-group" role="group" aria-label="גודל הטקסט">
          <span className="a11y-group__label">גודל טקסט</span>
          <div className="a11y-steps">
            {[0, 1, 2, 3].map((step) => (
              <button
                key={step}
                type="button"
                className="a11y-step"
                aria-pressed={state.font === step}
                onClick={() => setFont(step)}
              >
                {step === 0 ? "רגיל" : `+${step}`}
              </button>
            ))}
          </div>
        </div>

        <ul className="a11y-options">
          {TOGGLES.map(({ key, label, hint }) => (
            <li key={key}>
              <button
                type="button"
                className="a11y-option"
                aria-pressed={state[key]}
                onClick={() => toggle(key)}
              >
                <span className="a11y-option__text">
                  <span className="a11y-option__label">{label}</span>
                  <span className="a11y-option__hint">{hint}</span>
                </span>
                <span className="a11y-switch" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="a11y-reset" onClick={reset} disabled={activeCount === 0}>
          <ResetIcon />
          איפוס הגדרות
        </button>

        <Link href={ACCESSIBILITY.slug} className="a11y-statement" onClick={() => setOpen(false)}>
          להצהרת הנגישות המלאה
        </Link>
      </div>
    </div>
  );
}
