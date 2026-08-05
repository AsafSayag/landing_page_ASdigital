"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "./icons";
import "./expandable-card.css";

/* ---------------------------------------------------------------------------
   כרטיס שהגוף שלו סגור כברירת מחדל ונפתח בלחיצה על הכותרת.
   מקצר מאוד את הדף — בעיקר במובייל — בלי לוותר על התוכן.
   --------------------------------------------------------------------------- */

type Props = {
  title: string;
  body: string;
  /** שורת המשנה הצבעונית שמעל הגוף (בשירותים). */
  tagline?: string;
  /** אייקון עגול בראש הכרטיס (בשירותים). */
  icon?: ReactNode;
  /** השהיית אנימציית החשיפה, לפי מיקום בגריד. */
  revealDelay?: string;
};

export default function ExpandableCard({ title, body, tagline, icon, revealDelay }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `${id}-panel`;
  const headId = `${id}-head`;

  return (
    /* data-reveal יושב על עוטף שה-className שלו קבוע. ScrollReveal מוסיף
       .is-visible ישירות ל-DOM, ואם React היה מנהל את ה-className של אותו
       אלמנט — כל פתיחה של הכרטיס הייתה מוחקת את המחלקה והכרטיס היה נעלם. */
    <div
      className="xcard-wrap"
      data-reveal
      style={revealDelay ? ({ ["--reveal-delay" as string]: revealDelay }) : undefined}
    >
    <article className={`card xcard ${open ? "xcard--open" : ""}`}>
      <button
        type="button"
        id={headId}
        className="xcard__head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {icon && <span className="card-icon xcard__icon">{icon}</span>}
        <span className="xcard__titles">
          <span className="h3 xcard__title">{title}</span>
          {tagline && <span className="tagline-accent xcard__tagline">{tagline}</span>}
        </span>
        <ChevronIcon className="xcard__chev" />
      </button>

      {/* grid-template-rows 0fr↔1fr — אנימציית גובה חלקה בלי למדוד את התוכן ב-JS */}
      <div id={panelId} role="region" aria-labelledby={headId} className="xcard__panel">
        <div className="xcard__panelInner">
          <p className="xcard__body">{body}</p>
        </div>
      </div>
    </article>
    </div>
  );
}
