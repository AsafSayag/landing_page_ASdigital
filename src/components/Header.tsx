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
      <div className="container-x" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4.75rem" }}>
        <a href="#top" className="brand-logo" aria-label="AS digital — לדף הבית">
          <Image
            src="/images/as-logo.png"
            alt="AS Digital"
            width={2576}
            height={570}
            priority
            style={{ height: "clamp(1.9rem, 3.4vw, 2.4rem)", width: "auto" }}
          />
        </a>

        {/* ניווט דסקטופ */}
        <nav aria-label="ניווט ראשי" className="header-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* פעולות ימין */}
        <div className="header-actions">
          <a
            href={`tel:${BUSINESS.phoneDial}`}
            className="header-phone"
            aria-label={`חייגו ${BUSINESS.phoneDisplay}`}
          >
            <PhoneIcon width={18} height={18} />
            <span className="ltr">{BUSINESS.phoneDisplay}</span>
          </a>

          {/* כפתור וואטסאפ #1 — בהאדר */}
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn wa-btn header-wa"
          >
            <WhatsAppIcon className="glass-btn__icon" />
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

      {/* תפריט מובייל */}
      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <nav
            aria-label="ניווט מובייל"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "6rem 2rem 2rem" }}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1.5rem" }}>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-btn wa-btn"
                style={{ width: "100%" }}
                onClick={() => setOpen(false)}
              >
                <WhatsAppIcon className="glass-btn__icon" />
                שלחו הודעה בוואטסאפ
              </a>
              <a href={`tel:${BUSINESS.phoneDial}`} className="glass-btn" style={{ width: "100%" }}>
                <PhoneIcon width={18} height={18} />
                <span className="ltr">{BUSINESS.phoneDisplay}</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      <style>{`
        .brand-logo { display: inline-flex; align-items: center; }
        .header-nav { display: none; gap: 2rem; }
        .header-actions { display: flex; align-items: center; gap: 0.85rem; }
        .header-phone { display: none; align-items: center; gap: 0.45rem; font-weight: 600; color: var(--mist-200); transition: color .25s; }
        .header-phone:hover { color: #fff; }
        .header-wa { padding: 11px 20px; font-size: 0.95rem; }
        .menu-toggle { display: inline-flex; background: transparent; border: 0; color: #fff; cursor: pointer; padding: 0.35rem; }
        .mobile-link { font-family: var(--font-display); font-weight: 700; font-size: 1.6rem; color: #fff; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
        @media (min-width: 900px) {
          .header-nav { display: flex; }
          .header-phone { display: inline-flex; }
          .menu-toggle { display: none; }
        }
        @media (max-width: 480px) {
          .header-wa span { display: none; }
          .header-wa { padding: 11px; }
        }
      `}</style>
    </header>
  );
}
