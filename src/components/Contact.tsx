import ContactForm from "./ContactForm";
import { BUSINESS, CONTACT, whatsappHref } from "@/lib/content";
import { WhatsAppIcon, PhoneIcon } from "./icons";

/* המשטח הכהה היחיד בדף — הניגוד הזה הוא מה שהופך את סקשן הפנייה לעצירה
   ולא לעוד מודול. אותן שכבות אור של ההירו, בגרסה כהה. */
export default function Contact() {
  return (
    <section id="contact" className="section surface-ink contact on-ink">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="grid-floor" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="container-x contact__inner">
        <div data-reveal>
          <p className="eyebrow">{CONTACT.eyebrow}</p>
          <h2 className="h2" style={{ marginBlockStart: "1rem" }}>
            {CONTACT.title}
          </h2>
          <p className="lead" style={{ marginBlockStart: "1.1rem" }}>
            {CONTACT.intro}
          </p>

          <div className="contact-direct">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-direct__row"
            >
              <span className="contact-direct__icon">
                <WhatsAppIcon width={20} height={20} />
              </span>
              <span>
                <strong>{CONTACT.whatsappCta}</strong>
                <span className="caption ltr">{BUSINESS.phoneDisplay}</span>
              </span>
            </a>

            <a href={`tel:${BUSINESS.phoneDial}`} className="contact-direct__row">
              <span className="contact-direct__icon">
                <PhoneIcon width={18} height={18} />
              </span>
              <span>
                <strong>{CONTACT.callCta}</strong>
                <span className="caption ltr">{BUSINESS.phoneDisplay}</span>
              </span>
            </a>

            <a href={`mailto:${BUSINESS.email}`} className="contact-direct__row">
              <span className="contact-direct__icon">@</span>
              <span>
                <strong>{CONTACT.mailCta}</strong>
                <span className="caption ltr">{BUSINESS.email}</span>
              </span>
            </a>
          </div>
        </div>

        <div data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
