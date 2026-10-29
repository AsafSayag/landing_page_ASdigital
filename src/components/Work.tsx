import Image from "next/image";
import { WORK } from "@/lib/content";
import { ArrowIcon } from "./icons";

/* אולם התצוגה — כל פרויקט בוויטרינה משלו. התמונה "נושמת" לאט (Ken Burns)
   כדי שהגלריה תרגיש חיה בלי וידאו. */
export default function Work() {
  return (
    <section id="work" className="section surface-white">
      <div className="container-x">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{WORK.eyebrow}</p>
          <h2 className="h2">{WORK.title}</h2>
          <p className="lead">{WORK.intro}</p>
        </div>

        <div className="work-list">
          {WORK.projects.map((p, i) => (
            <article className="work-item" key={p.domain} data-reveal>
              <a
                className="work-frame"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`צפייה באתר ${p.name}`}
              >
                <div className="work-frame__bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span className="work-frame__url ltr">{p.domain}</span>
                </div>
                <div className="work-frame__screen">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 900px) 92vw, 56vw"
                    className="work-shot"
                    priority={i === 0}
                  />
                </div>
              </a>

              <div className="work-copy">
                <p className="work-name ltr">{p.name}</p>
                <h3 className="h3">{p.title}</h3>
                <p className="lead">{p.body}</p>
                <ul className="work-tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a
                  className="link-arrow"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  לצפייה באתר
                  <ArrowIcon width={16} height={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
