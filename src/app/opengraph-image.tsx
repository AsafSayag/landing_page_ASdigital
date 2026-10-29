import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AS digital — בניית אתרים, קידום ושיווק ממומן";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* טקסט לטיני בלבד — הפונט המובנה של ImageResponse לא כולל גליפים עבריים */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f5f2",
          backgroundImage:
            "linear-gradient(135deg, #f6eaee 0%, #f8f5f2 48%, #efe8e2 100%)",
          color: "#16100f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 86, fontWeight: 800, letterSpacing: -3 }}>AS</span>
          <span style={{ fontSize: 86, fontWeight: 400, color: "#6a5a5f", letterSpacing: -3 }}>
            digital
          </span>
          <span style={{ fontSize: 86, fontWeight: 800, color: "#a51d46" }}>.</span>
        </div>

        <div style={{ marginTop: 26, fontSize: 34, color: "#3a2e31", letterSpacing: -0.5 }}>
          Websites · SEO · Google &amp; Meta Ads · AI Automation
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#6a5a5f",
          }}
        >
          <span>Asaf Sayag</span>
          <span style={{ color: "#a1908f" }}>|</span>
          <span>054-766-4809</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #6b1029, #a51d46, #d78ba3)",
          }}
        />
      </div>
    ),
    size
  );
}
