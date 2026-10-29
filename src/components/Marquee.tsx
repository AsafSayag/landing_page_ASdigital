import { MARQUEE } from "@/lib/content";

/* פס הדיסציפלינות — הקבוצה מוכפלת פעמיים כדי שתזוזה של 50% תיסגר ללולאה
   רציפה בלי קפיצה. העותק השני דקורטיבי ומוסתר מקוראי מסך. */
function Group({ clone }: { clone?: boolean }) {
  return (
    <div className="marquee__group" aria-hidden={clone || undefined}>
      {MARQUEE.map((item) => (
        <span className="marquee__item" key={item}>
          <i className="marquee__dot" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-label="תחומי העשייה">
      <div className="marquee__track">
        <Group />
        <Group clone />
      </div>
    </div>
  );
}
