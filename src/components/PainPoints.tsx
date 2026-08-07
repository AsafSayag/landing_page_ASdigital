"use client";

import { PAIN_POINTS } from "@/lib/content";
import { ArrowIcon } from "./icons";
import "./pain-points.css";

/* ---------------------------------------------------------------------------
   כרטיסי "כאב" שנכנסים לסירוגין מהצדדים. לחיצה מעבירה לטופס
   ומעבירה אליו את המשפט המתאים (דרך CustomEvent — בלי state גלובלי).
--------------------------------------------------------------------------- */

export type PainDetail = { label: string; answer: string };

export default function PainPoints() {
  const pick = (item: (typeof PAIN_POINTS.items)[number]) => {
    window.dispatchEvent(
      new CustomEvent<PainDetail>("as:pain", {
        detail: { label: item.label, answer: item.answer },
      })
    );
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="pain section surface-900" aria-labelledby="pain-title">
      <div className="container-x">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{PAIN_POINTS.eyebrow}</p>
          <h2 id="pain-title" className="h2 heading-accent">
            {PAIN_POINTS.title}
          </h2>
          <p className="lead" style={{ marginTop: "1.1rem" }}>
            {PAIN_POINTS.intro}
          </p>
        </div>

        <div className="pain-grid">
          {PAIN_POINTS.items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`pain-card pain-card--${item.tone} ${
                i % 2 === 0 ? "pain-card--from-start" : "pain-card--from-end"
              }`}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 2) * 0.1}s` }}
              onClick={() => pick(item)}
            >
              <span className="pain-card__label">{item.label}</span>
              <span className="pain-card__go">
                <ArrowIcon width={18} height={18} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
