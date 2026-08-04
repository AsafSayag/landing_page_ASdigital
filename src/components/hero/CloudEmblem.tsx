"use client";

import { forwardRef } from "react";
import { CLOUD_LABEL } from "@/lib/hero-diagnosis";

/* ענן "העסק שלך" — אמבלם קטן ומעודן. החלקיקים מתאספים סביבו. */
const CloudEmblem = forwardRef<HTMLDivElement>(function CloudEmblem(_props, ref) {
  return (
    <div className="cloud-emblem" ref={ref}>
      <svg className="cloud-emblem__svg" viewBox="0 0 220 132" role="presentation" aria-hidden="true">
        <defs>
          <linearGradient id="ceStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bfeaff" />
            <stop offset="55%" stopColor="#6cc8ff" />
            <stop offset="100%" stopColor="#8ea8ff" />
          </linearGradient>
          <linearGradient id="ceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(18,46,74,0.55)" />
            <stop offset="100%" stopColor="rgba(6,16,28,0.72)" />
          </linearGradient>
        </defs>
        <path
          d="M62 108c-21 0-38-16-38-36 0-18 13-33 31-36 5-21 24-36 47-36 21 0 39 12 46 30 4-1 8-2 12-2 22 0 40 17 40 39s-18 41-40 41H62z"
          fill="url(#ceFill)"
          stroke="url(#ceStroke)"
          strokeWidth="2.5"
        />
      </svg>
      <span className="cloud-emblem__label">{CLOUD_LABEL}</span>
    </div>
  );
});

export default CloudEmblem;
