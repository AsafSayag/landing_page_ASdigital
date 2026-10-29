import { HERO, type HeroVariant } from "@/lib/content";
import LiveHeadline from "./LiveHeadline";
import { ArrowIcon } from "./icons";

/* ההירו. הכותרת נמצאת ב-DOM מהפריים הראשון ועולה באנימציית CSS טהורה —
   בלי להמתין ל-JS, כדי לא לפגוע ב-LCP. כל שכבות האור הן רקע בלבד. */
export default function Hero({ variant = "site" }: { variant?: HeroVariant }) {
  const c = HERO[variant];

  return (
    <section id="top" className="hero stage">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="grid-floor" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="container-x hero__inner">
        <p className="eyebrow hero__eyebrow rise rise-1">{c.eyebrow}</p>

        <LiveHeadline lead={c.titleLead} accent={c.titleAccent} />

        <p className="hero__sub rise rise-3">{c.sub}</p>

        <div className="hero__actions rise rise-4">
          <a href="#contact" className="btn btn--primary">
            {c.primaryCta}
            <ArrowIcon width={18} height={18} />
          </a>
          <a href="#work" className="btn">
            {c.secondaryCta}
          </a>
        </div>

        <div className="hero__trust rise rise-5">
          {c.trust.map((t) => (
            <span key={t.strong}>
              <b>{t.strong}</b> {t.rest}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-hint rise rise-6" aria-hidden="true">
        <i />
      </div>
    </section>
  );
}
