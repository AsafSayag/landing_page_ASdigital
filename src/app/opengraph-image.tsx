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
          backgroundColor: "#050505",
          backgroundImage:
            "linear-gradient(135deg, #2a0713 0%, #050505 45%, #08202f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 86, fontWeight: 800, letterSpacing: -3 }}>AS</span>
          <span style={{ fontSize: 86, fontWeight: 400, color: "#b9c6d2", letterSpacing: -3 }}>
            digital
          </span>
          <span style={{ fontSize: 86, fontWeight: 800, color: "#d8577f" }}>.</span>
        </div>

        <div style={{ marginTop: 26, fontSize: 34, color: "#dfe9f2", letterSpacing: -0.5 }}>
          Websites · SEO · Google &amp; Meta Ads · AI Automation
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#9fb3c4",
          }}
        >
          <span>Asaf Sayag</span>
          <span style={{ color: "#3e4a55" }}>|</span>
          <span>054-766-4809</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #6cbdf5, #a51d46)",
          }}
        />
      </div>
    ),
    size
  );
}
