import Image from "next/image";
import Link from "next/link";
import { LEGAL_DOCS, LEGAL_UPDATED, type LegalBlock, type LegalDocument } from "@/lib/legal";
import { BUSINESS, FOOTER, whatsappHref } from "@/lib/content";
import { WhatsAppIcon } from "./icons";
import "./legal.css";

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        Array.isArray(block) ? (
          <ul key={i} className="legal-list">
            {block.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{block}</p>
        )
      )}
    </>
  );
}

/** פריסה משותפת לשלושת המסמכים המשפטיים. */
export default function LegalDoc({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <header className="legal-header">
        <div className="container-x legal-header__inner">
          <Link href="/" aria-label={`${BUSINESS.name} — לעמוד הבית`}>
            <Image
              src="/images/as-logo.png"
              alt={BUSINESS.name}
              width={2576}
              height={570}
              style={{ height: "2.2rem", width: "auto" }}
              priority
            />
          </Link>
          <Link href="/" className="legal-back">
            חזרה לאתר
          </Link>
        </div>
      </header>

      <main id="main" className="legal-main">
        <article className="container-x legal-doc">
          <h1 className="h2 heading-accent">{doc.title}</h1>
          <p className="caption legal-updated">עודכן לאחרונה: {LEGAL_UPDATED}</p>

          <div className="legal-intro">
            <Blocks blocks={doc.intro} />
          </div>

          {doc.sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>
              <Blocks blocks={section.body} />
            </section>
          ))}

          <nav className="legal-siblings" aria-label="מסמכים נוספים">
            {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
              <Link key={d.slug} href={d.slug} className="legal-sibling">
                {d.navLabel}
              </Link>
            ))}
          </nav>
        </article>
      </main>

      <footer className="surface-950 legal-footer">
        <div className="container-x legal-footer__inner">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn wa-btn"
          >
            <WhatsAppIcon className="glass-btn__icon" />
            דברו איתי בוואטסאפ
          </a>
          <p className="caption">{FOOTER.rights}</p>
        </div>
      </footer>
    </>
  );
}
