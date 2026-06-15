import { ImageResponse } from "next/og";

// Next.js auto-discovers this file and emits <meta property="og:image"> + sizing.
export const runtime = "edge";
export const alt = "Camelify — The Creator-First Link-in-Bio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #F1F5EE 0%, #DDEBD8 50%, #A8E0BC 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: 80,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 24,
              border: "5px solid #0E1B2C",
              background: "#A8E0BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              boxShadow: "0 8px 24px rgba(14, 27, 44, 0.12)",
            }}
          >
            <span style={{ color: "#0E1B2C" }}>c</span>
            <span style={{ color: "#3FBF6F" }}>m</span>
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              color: "#0E1B2C",
              letterSpacing: "-0.03em",
            }}
          >
            Camelify
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#0E1B2C",
            textAlign: "center",
            maxWidth: 980,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          The link-in-bio creators actually deserve
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 24,
            fontSize: 28,
            fontWeight: 600,
            color: "#1F2A37",
          }}
        >
          <Pill>Custom domain</Pill>
          <Pill>Free analytics</Pill>
          <Pill>No surprises</Pill>
        </div>

        {/* URL ribbon */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            fontWeight: 700,
            color: "#0E1B2C",
            background: "white",
            borderRadius: 999,
            padding: "12px 24px",
            border: "2px solid #0E1B2C",
          }}
        >
          camelify.com
        </div>
      </div>
    ),
    { ...size },
  );
}

function Pill({ children }: { children: string }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 999,
        padding: "10px 20px",
        border: "2px solid #0E1B2C",
      }}
    >
      {children}
    </div>
  );
}
