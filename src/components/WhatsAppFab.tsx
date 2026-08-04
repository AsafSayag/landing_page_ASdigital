"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/content";
import { WhatsAppIcon } from "./icons";

/** כפתור וואטסאפ #2 — דינמי: מופיע אחרי גלילה מעבר להירו. */
export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-fab ${visible ? "wa-fab--visible" : ""}`}
      aria-label="שליחת הודעה בוואטסאפ"
    >
      <WhatsAppIcon />
      <span className="wa-fab__label">דברו איתי</span>
    </a>
  );
}
