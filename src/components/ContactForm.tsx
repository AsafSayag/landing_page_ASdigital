"use client";

import { useEffect, useRef, useState } from "react";
import { BUSINESS, CONTACT } from "@/lib/content";
import { saveLead, updateLeadDraft } from "@/lib/save-lead";
import { PhoneIcon } from "./icons";
import SentModal from "./SentModal";
import type { PainDetail } from "./PainPoints";
import "./contact-form.css";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pain, setPain] = useState<PainDetail | null>(null);
  const [sentOpen, setSentOpen] = useState(false);

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

  /* מזינים את הטיוטה תוך כדי הקלדה — כדי שגם מי שימלא כאן ואז ילחץ על
     כפתור וואטסאפ אחר בעמוד, במקום על "שליחה", עדיין ייכנס לגיליון. */
  useEffect(() => {
    updateLeadDraft({ name, phone, message });
  }, [name, phone, message]);

  function buildMessage() {
    const lines = [
      "היי אסף, הגעתי מהאתר של AS digital 👋",
      name && `שם: ${name}`,
      phone && `טלפון: ${phone}`,
      message && `מעוניין/ת ב: ${message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  /* הפנייה נכתבת לגיליון בלבד — בלי מעבר לוואטסאפ. וכיוון שהמשתמש נשאר
     מול טופס מלא, לחיצה נוספת הייתה מוסיפה שורה זהה; שולחים רק כששם או
     טלפון באמת השתנו. */
  const submittedKey = useRef<string | null>(null);
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const key = `${name.trim()}|${phone.trim()}`;
    if (submittedKey.current !== key) {
      submittedKey.current = key;
      saveLead({ name, phone, message }, "טופס יצירת קשר");
    }
    setSentOpen(true);
  }

  const mailHref = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
    "פנייה מהאתר — AS digital"
  )}&body=${encodeURIComponent(buildMessage())}`;

  return (
    <>
    <form id="contact-form" onSubmit={onSubmit} className="glass cf">
      {pain && (
        <div className="pain-note" role="status">
          <span className="pain-note__label">מה שסימנת</span>
          <p className="pain-note__q">{pain.label}</p>
          <p className="pain-note__a">{pain.answer}</p>
        </div>
      )}

      {/* שם וטלפון זה לצד זה — חוסך שורה שלמה מגובה הטופס */}
      <div className="cf__row">
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
          {/* חובה: בלי המעבר לוואטסאפ, שליחה בלי טלפון הייתה כותבת שורה
              ריקה לגיליון ומציגה "אצור איתך קשר" שאי אפשר לקיים. */}
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
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-msg" className="field-label">
          {CONTACT.formMsgLabel}
        </label>
        <textarea
          id="cf-msg"
          className="field cf__msg"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={CONTACT.formMsgPlaceholder}
        />
      </div>

      <button type="submit" className="glass-btn glass-btn--primary cf__submit">
        {CONTACT.submit}
      </button>

      <div className="cf__alt">
        <a href={`tel:${BUSINESS.phoneDial}`} className="glass-btn">
          <PhoneIcon width={18} height={18} />
          <span className="ltr">{BUSINESS.phoneDisplay}</span>
        </a>
        <a href={mailHref} className="glass-btn">
          שליחת מייל
        </a>
      </div>

      <p className="caption cf__note">
        הפרטים נשמרים לצורך יצירת קשר בלבד ולא מועברים לגורמי שיווק חיצוניים.
      </p>
    </form>
    <SentModal open={sentOpen} onClose={() => setSentOpen(false)} />
    </>
  );
}
