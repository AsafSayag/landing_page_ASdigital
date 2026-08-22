"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import EnergyField from "./EnergyField";

export default function TwinCanvas({
  progress,
  focus,
  targetNdc,
}: {
  progress: number;
  focus: number;
  targetNdc: { x: number; y: number };
}) {
  /* נקבע פעם אחת ברינדור הלקוח הראשון (ssr:false).
     חשוב: quality/dpr שמשתנים אחרי ה-mount בונים מחדש את ה-renderer. */
  const [{ quality, scale, spin }] = useState<{
    quality: "high" | "low";
    scale: number;
    spin: number;
  }>(() => {
    const small =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return {
      quality: small || reduce ? "low" : "high",
      scale: small ? 0.84 : 1,
      /* סיבוב רציף ואיטי — סיבוב מלא בכ-100 שניות. נעצר לגמרי כשהמשתמש
         ביקש תנועה מופחתת. */
      spin: reduce ? 0 : 0.062,
    };
  });

  const dpr: [number, number] = quality === "low" ? [1, 1.4] : [1, 2];

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <EnergyField
        progress={progress}
        focus={focus}
        targetNdc={targetNdc}
        quality={quality}
        scale={scale}
        spin={spin}
      />
    </Canvas>
  );
}
