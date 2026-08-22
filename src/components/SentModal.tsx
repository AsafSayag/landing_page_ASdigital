"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SENT_MODAL } from "@/lib/hero-diagnosis";
import "./sent-modal.css";

/* אישור שליחה משותף לטופס ההירו ולטופס יצירת הקשר.
   מוגש דרך portal ל-body: לסקשנים באתר יש stacking contexts משלהם
   (למשל isolation:isolate בהירו), וחלון fixed שנשאר בתוכם היה נצבע
   מתחת להדר הקבוע. */
export default function SentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  /* Esc סוגר, והמיקוד עובר לכפתור הסגירה ברגע שהחלון נפתח */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="sent-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sent-modal-text"
      onClick={onClose}
    >
      <div className="sent-modal__card" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          className="sent-modal__close"
          onClick={onClose}
          aria-label={SENT_MODAL.close}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <p id="sent-modal-text" className="sent-modal__text">
          {SENT_MODAL.text}
        </p>
      </div>
    </div>,
    document.body
  );
}
