import Image from "next/image";
import Link from "next/link";
import { BUSINESS, FOOTER, NAV, whatsappHref } from "@/lib/content";
import { LEGAL_DOCS } from "@/lib/legal";
import { WhatsAppIcon } from "./icons";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-x">
        <div className="footer-grid">
          <div className="footer-col">
            <Image
              src="/images/as-logo-light.png"
              alt={BUSINESS.name}
              width={2576}
              height={570}
              sizes="188px"
              style={{ height: "2.4rem", width: "auto" }}
            />
            <p className="caption" style={{ maxWidth: "32ch", marginBlockStart: "0.5rem" }}>
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
            <a href={`tel:${BUSINESS.phoneDial}`} className="footer-link ltr">
              {BUSINESS.phoneDisplay}
            </a>
            <a href={`mailto:${BUSINESS.email}`} className="footer-link ltr">
              {BUSINESS.email}
            </a>
            <span className="footer-link" style={{ cursor: "default" }}>
              {BUSINESS.address}
            </span>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ marginBlockStart: "0.75rem", alignSelf: "flex-start" }}
            >
              <WhatsAppIcon className="btn__icon" />
              וואטסאפ
            </a>
          </div>
        </div>

        <div className="footer-bottom caption">
          <p>{FOOTER.rights}</p>
          <p className="ltr">{BUSINESS.name}</p>
        </div>
      </div>
    </footer>
  );
}
