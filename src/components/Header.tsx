"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BUSINESS, NAV, whatsappHref } from "@/lib/content";
import { WhatsAppIcon, MenuIcon, CloseIcon, PhoneIcon } from "./icons";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="container-x header-bar">
        <a href="#top" className="brand-logo" aria-label="AS digital — לדף הבית">
          <Image
            src="/images/as-logo-light.png"
            alt="AS Digital"
            width={2576}
            height={570}
            priority
            /* בלי sizes, next/image מזמין את הווריאנט של 3840px עבור לוגו
               שמוצג ב-174px — וזה גם מה שנטען ב-preload. */
            sizes="174px"
            style={{ height: "clamp(1.8rem, 3.2vw, 2.2rem)", width: "auto" }}
          />
        </a>

        <nav aria-label="ניווט ראשי" className="header-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            href={`tel:${BUSINESS.phoneDial}`}
            className="header-phone"
            aria-label={`חייגו ${BUSINESS.phoneDisplay}`}
          >
            <PhoneIcon width={17} height={17} />
            <span className="ltr">{BUSINESS.phoneDisplay}</span>
          </a>

          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn header-wa"
          >
            <WhatsAppIcon className="btn__icon" />
            <span>וואטסאפ</span>
          </a>

          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon width={26} height={26} /> : <MenuIcon width={26} height={26} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <nav
            aria-label="ניווט מובייל"
            className="mobile-nav"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-link rise"
                style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mobile-actions">
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
                onClick={() => setOpen(false)}
              >
                <WhatsAppIcon className="btn__icon" />
                שלחו הודעה בוואטסאפ
              </a>
              <a href={`tel:${BUSINESS.phoneDial}`} className="btn">
                <PhoneIcon width={18} height={18} />
                <span className="ltr">{BUSINESS.phoneDisplay}</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .header-bar { display: flex; align-items: center; justify-content: space-between; height: 4.75rem; }
        .brand-logo { display: inline-flex; align-items: center; }
        .header-nav { display: none; gap: 2.25rem; }
        .header-actions { display: flex; align-items: center; gap: 0.85rem; }
        .header-phone { display: none; align-items: center; gap: 0.45rem; font-weight: 500; font-size: 0.95rem; color: var(--ink-500); transition: color .25s; }
        .header-phone:hover { color: var(--ink-900); }
        .header-wa { padding: 10px 20px; font-size: 0.92rem; }
        .menu-toggle { display: inline-flex; background: transparent; border: 0; color: var(--ink-900); cursor: pointer; padding: 0.35rem; }
        .mobile-nav { display: flex; flex-direction: column; gap: 0.25rem; padding: 6rem 2rem 2rem; }
        .mobile-link {
          font-family: var(--font-display); font-weight: 500; font-size: 1.75rem;
          color: var(--ink-900); padding: 0.6rem 0;
          border-bottom: 1px solid rgba(22,16,15,0.08);
        }
        .mobile-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }
        @media (min-width: 900px) {
          .header-nav { display: flex; }
          .header-phone { display: inline-flex; }
          .menu-toggle { display: none; }
        }
        @media (max-width: 480px) {
          .header-wa span { display: none; }
          .header-wa { padding: 10px; }
        }
      `}</style>
    </header>
  );
}
