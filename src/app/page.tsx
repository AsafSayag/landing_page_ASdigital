import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import HeroExperience from "@/components/hero/HeroExperience";
import ProcessScroll from "@/components/ProcessScroll";
import PainPoints from "@/components/PainPoints";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import ExpandableCard from "@/components/ExpandableCard";
import { SERVICE_ICONS, WhatsAppIcon, PhoneIcon, ArrowIcon } from "@/components/icons";
import {
  BUSINESS,
  STATS,
  SERVICES,
  PROCESS,
  RESULTS,
  CASE,
  ABOUT,
  CONTACT,
  FINAL_CTA,
  PROCESS_CTA,
  FOOTER,
  NAV,
  whatsappHref,
} from "@/lib/content";
import { LEGAL_DOCS } from "@/lib/legal";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        {/* ================= HERO — מערכת אבחון (Digital Twin) ================= */}
        <HeroExperience />

        {/* ============ וידאו נגלל — השירותים ============ */}
        <ProcessScroll />

        {/* ============ CTA אחרי הווידאו ============ */}
        <section className="surface-950 process-cta" aria-label={PROCESS_CTA.label}>
          <div className="container-x process-cta__inner" data-reveal>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn glass-btn--primary process-cta__btn"
            >
              <WhatsAppIcon className="glass-btn__icon" />
              {PROCESS_CTA.label}
            </a>
            <p className="caption process-cta__note">{PROCESS_CTA.note}</p>
          </div>
        </section>

        {/* ============ "אם אתה מרגיש אחד מהדברים הבאים" ============ */}
        <PainPoints />

        {/* ================= STATS ================= */}
        <section className="surface-900 stats-band" aria-label="נתוני מפתח">
          <div className="container-x stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-item" data-reveal>
                <div className="stat-value ltr">{s.value}</div>
                <div className="caption stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

{/* ================= RESULTS + CASE ================= */}
        <section id="results" className="section surface-950">
          <div className="ambient-glow" style={{ opacity: 0.55 }} />
          <div className="container-x" style={{ position: "relative" }}>
            <div className="section-head" data-reveal>
              <p className="eyebrow">{RESULTS.eyebrow}</p>
              <h2 className="h2 heading-accent">{RESULTS.title}</h2>
              <p className="lead" style={{ marginTop: "1.25rem" }}>
                {RESULTS.intro}
              </p>
            </div>

            <div className="results-grid">
              {RESULTS.cards.map((c, i) => (
                <ExpandableCard
                  key={c.title}
                  title={c.title}
                  body={c.body}
                  revealDelay={`${(i % 3) * 0.08}s`}
                />
              ))}
            </div>

            {/* כרטיס פרויקט לדוגמה — print3d.co.il */}
            <div className="case-card" data-reveal>
              <div className="case-body">
                <p className="eyebrow">{CASE.eyebrow}</p>
                <h3 className="case-title ltr">{CASE.title}</h3>
                <p className="caption" style={{ margin: "0.25rem 0 1rem" }}>
                  {CASE.category}
                </p>
                <p style={{ color: "var(--mist-200)", marginTop: 0 }}>{CASE.body}</p>
                <ul className="case-bullets">
                  {CASE.bullets.map((b) => (
                    <li key={b}>
                      <span className="case-check" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={CASE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-btn"
                  style={{ marginTop: "0.5rem" }}
                >
                  {CASE.cta}
                  <ArrowIcon width={18} height={18} />
                </a>
              </div>
              <div className="case-visual">
                <a
                  className="case-browser"
                  href={CASE.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${CASE.cta} — ${CASE.title}`}
                >
                  <div className="case-browser__bar" aria-hidden="true">
                    <span /><span /><span />
                    <div className="case-browser__url ltr">print3d.co.il</div>
                  </div>
                  <div className="case-browser__screen">
                    <Image
                      src="/images/print3d-home.webp"
                      alt="דף הבית של print3d.co.il — אתר מודלים אדריכליים שבניתי וקידמתי בגוגל"
                      fill
                      sizes="(max-width: 900px) 92vw, 42vw"
                      className="case-shot"
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

{/* ================= FINAL CTA ================= */}
        <section className="section surface-900 final-cta">
          <div className="ambient-glow" />
          <div className="ambient-grid" />
          <div className="container-x final-cta__inner" data-reveal>
            <h2 className="h2" style={{ maxWidth: "20ch", marginInline: "auto" }}>
              {FINAL_CTA.title}
            </h2>
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap" }}>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn glass-btn--primary"
              >
                <WhatsAppIcon className="glass-btn__icon" />
                {FINAL_CTA.cta}
              </a>
              <a href={`tel:${BUSINESS.phoneDial}`} className="glass-btn">
                <PhoneIcon width={18} height={18} />
                <span className="ltr">{BUSINESS.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ============ נעים להכיר — המודול היחיד בתמה בהירה ============ */}
        <div className="light-zone on-light">
        {/* ================= ABOUT ================= */}
        <section id="about" className="section surface-900">
          <div className="container-x about-grid">
            <div className="about-portrait" data-reveal>
              <Image
                src="/images/asaf-portrait.webp"
                alt={`${ABOUT.title} — מייסד ${BUSINESS.name}`}
                fill
                sizes="(min-width: 900px) 22rem, 70vw"
                className="about-portrait__img"
              />
              <div className="about-portrait__glow" />
            </div>
            <div className="about-copy" data-reveal>
              <div className="section-head">
                <p className="eyebrow">{ABOUT.eyebrow}</p>
                <h2 className="h2 heading-accent">{ABOUT.title}</h2>
              </div>
              <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.1rem" }}>
                {ABOUT.paragraphs.map((p, i) => (
                  <p key={i} className="lead" style={{ margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
        </div>{/* light-zone end — רק נעים להכיר בהיר */}

        {/* ================= SERVICES ================= */}
        <section id="services" className="section surface-950">
          <div className="ambient-glow" style={{ opacity: 0.5 }} />
          <div className="container-x" style={{ position: "relative" }}>
            <div className="section-head" data-reveal>
              <p className="eyebrow">{SERVICES.eyebrow}</p>
              <h2 className="h2 heading-accent">{SERVICES.title}</h2>
              <p className="lead" style={{ marginTop: "1.25rem" }}>
                {SERVICES.intro}
              </p>
            </div>

            <div className="services-grid">
              {SERVICES.items.map((item, i) => {
                const Icon = SERVICE_ICONS[item.key];
                return (
                  <ExpandableCard
                    key={item.key}
                    title={item.name}
                    tagline={item.tagline}
                    body={item.body}
                    icon={Icon ? <Icon /> : null}
                    revealDelay={`${(i % 3) * 0.08}s`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= PROCESS ================= */}
        <section id="process" className="section surface-900">
          <div className="container-x">
            <div className="section-head" data-reveal>
              <p className="eyebrow">{PROCESS.eyebrow}</p>
              <h2 className="h2 heading-accent">{PROCESS.title}</h2>
              <p className="lead" style={{ marginTop: "1.25rem" }}>
                {PROCESS.intro}
              </p>
            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section id="contact" className="section surface-900">
          <div className="ambient-glow" style={{ opacity: 0.6 }} />
          <div className="container-x contact-grid" style={{ position: "relative" }}>
            <div className="contact-copy" data-reveal>
              <div className="section-head">
                <h2 className="h2 heading-accent">{CONTACT.title}</h2>
                <p className="lead" style={{ marginTop: "1.25rem" }}>
                  {CONTACT.intro}
                </p>
              </div>

              <div className="contact-direct">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-direct__row"
                >
                  <span className="contact-direct__icon wa"><WhatsAppIcon width={22} height={22} /></span>
                  <span>
                    <strong>{CONTACT.whatsappCta}</strong>
                    <span className="caption ltr" style={{ display: "block" }}>{BUSINESS.phoneDisplay}</span>
                  </span>
                </a>
                <a href={`tel:${BUSINESS.phoneDial}`} className="contact-direct__row">
                  <span className="contact-direct__icon"><PhoneIcon width={20} height={20} /></span>
                  <span>
                    <strong>{CONTACT.callCta}</strong>
                    <span className="caption ltr" style={{ display: "block" }}>{BUSINESS.phoneDisplay}</span>
                  </span>
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="contact-direct__row">
                  <span className="contact-direct__icon">@</span>
                  <span>
                    <strong>מייל</strong>
                    <span className="caption ltr" style={{ display: "block" }}>{BUSINESS.email}</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="contact-form-wrap" data-reveal>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="surface-950 site-footer">
        <hr className="seam" />
        <div className="container-x footer-grid">
          <div className="footer-brand">
            <Image
              src="/images/as-logo.png"
              alt="AS Digital"
              width={2576}
              height={570}
              sizes="188px"
              style={{ height: "2.6rem", width: "auto" }}
            />
            <p style={{ color: "var(--mist-200)", maxWidth: "34ch", marginTop: "0.85rem" }}>
              {FOOTER.tagline}
            </p>
          </div>

          <nav className="footer-col" aria-label="קישורי ניווט">
            <h3 className="footer-col__title">ניווט</h3>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="footer-link">
                {item.label}
              </a>
            ))}
          </nav>

          <nav className="footer-col" aria-label="מידע משפטי">
            <h3 className="footer-col__title">מידע משפטי</h3>
            {LEGAL_DOCS.map((doc) => (
              <Link key={doc.slug} href={doc.slug} className="footer-link">
                {doc.navLabel}
              </Link>
            ))}
          </nav>

          <div className="footer-col">
            <h3 className="footer-col__title">יצירת קשר</h3>
            <a href={`tel:${BUSINESS.phoneDial}`} className="footer-link ltr">{BUSINESS.phoneDisplay}</a>
            <a href={`mailto:${BUSINESS.email}`} className="footer-link ltr">{BUSINESS.email}</a>
            <span className="footer-link" style={{ cursor: "default" }}>{BUSINESS.address}</span>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-btn wa-btn"
              style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}
            >
              <WhatsAppIcon className="glass-btn__icon" />
              וואטסאפ
            </a>
          </div>
        </div>
        <div className="container-x footer-bottom caption">{FOOTER.rights}</div>
      </footer>

      <WhatsAppFab />
      <ScrollReveal />
    </>
  );
}
