import { SERVICES } from "@/lib/content";

/* רשימה אדיטוריאלית ולא גריד כרטיסים: פחות מסגרות על המסך, יותר אוויר,
   וקריאה שיורדת למטה במקום לקפוץ בין כרטיסים. */
export default function Services() {
  return (
    <section id="services" className="section surface-porcelain">
      <div className="container-x">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{SERVICES.eyebrow}</p>
          <h2 className="h2">{SERVICES.title}</h2>
          <p className="lead">{SERVICES.intro}</p>
        </div>

        <div className="svc-list">
          {SERVICES.items.map((item, i) => (
            <div
              className="svc-row"
              key={item.key}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }}
            >
              <span className="svc-row__num ltr" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="h3 svc-row__name">{item.name}</h3>
              <p className="svc-row__body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
