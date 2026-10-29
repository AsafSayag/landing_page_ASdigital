import Image from "next/image";
import { ABOUT, BUSINESS, STATS } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="section surface-sand">
      <div className="container-x about-grid">
        <div className="about-portrait" data-reveal>
          <Image
            src="/images/asaf-portrait.webp"
            alt={`${ABOUT.title} — מייסד ${BUSINESS.name}`}
            fill
            sizes="(min-width: 900px) 22rem, 72vw"
          />
        </div>

        <div className="about-copy" data-reveal>
          <p className="eyebrow">{ABOUT.eyebrow}</p>
          <h2 className="h2" style={{ marginBlockStart: "1rem" }}>
            {ABOUT.title}
          </h2>
          <div style={{ marginBlockStart: "1.4rem" }}>
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i} className="lead">
                {p}
              </p>
            ))}
          </div>

          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="about-stat__value ltr">{s.value}</div>
                <div className="about-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
