"use client";

import { useEffect, useState } from "react";
import { BUSINESS, CONTACT, whatsappHref } from "@/lib/content";
import { WhatsAppIcon, PhoneIcon } from "./icons";
import type { PainDetail } from "./PainPoints";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pain, setPain] = useState<PainDetail | null>(null);

  /* מגיע מכרטיסי "אם אתה מרגיש..." */
  useEffect(() => {
    const onPain = (e: Event) => {
      const d = (e as CustomEvent<PainDetail>).detail;
      if (!d) return;
      setPain(d);
      setMessage(d.label);
    };
    window.addEventListener("as:pain", onPain);
    return () => window.removeEventListener("as:pain", onPain);
  }, []);

  function buildMessage() {
    const lines = [
      "היי אסף, הגעתי מהאתר של AS digital 👋",
      name && `שם: ${name}`,
      phone && `טלפון: ${phone}`,
      message && `מעוניין/ת ב: ${message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.open(whatsappHref(buildMessage()), "_blank", "noopener,noreferrer");
  }

  const mailHref = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
    "פנייה מהאתר — AS digital"
  )}&body=${encodeURIComponent(buildMessage())}`;

  return (
    <form onSubmit={onSubmit} className="glass" style={{ borderRadius: 24, padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
      <div style={{ display: "grid", gap: "1.15rem" }}>
        {pain && (
          <div className="pain-note" role="status">
            <span className="pain-note__label">מה שסימנת</span>
            <p className="pain-note__q">{pain.label}</p>
            <p className="pain-note__a">{pain.answer}</p>
          </div>
        )}
        <div>
          <label htmlFor="cf-name" className="field-label">
            {CONTACT.formNameLabel}
          </label>
          <input
            id="cf-name"
            className="field"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="איך קוראים לך?"
          />
        </div>

        <div>
          <label htmlFor="cf-phone" className="field-label">
            {CONTACT.formPhoneLabel}
          </label>
          <input
            id="cf-phone"
            className="field ltr"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-0000000"
          />
        </div>

        <div>
          <label htmlFor="cf-msg" className="field-label">
            {CONTACT.formMsgLabel}
          </label>
          <textarea
            id="cf-msg"
            className="field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={CONTACT.formMsgPlaceholder}
          />
        </div>

        <button type="submit" className="glass-btn glass-btn--primary" style={{ width: "100%", padding: "16px" }}>
          <WhatsAppIcon className="glass-btn__icon" />
          {CONTACT.submit}
        </button>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a href={`tel:${BUSINESS.phoneDial}`} className="glass-btn" style={{ flex: "1 1 10rem" }}>
            <PhoneIcon width={18} height={18} />
            <span className="ltr">{BUSINESS.phoneDisplay}</span>
          </a>
          <a href={mailHref} className="glass-btn" style={{ flex: "1 1 10rem" }}>
            שליחת מייל
          </a>
        </div>

        <p className="caption" style={{ textAlign: "center", margin: 0 }}>
          פרטייך נשלחים ישירות אליי — ללא צד שלישי, ללא ספאם.
        </p>
      </div>
    </form>
  );
}
