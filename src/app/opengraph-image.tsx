import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic OpenGraph card in the site's ink/paper/accent system. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0b0b0c",
          color: "#f3f2ee",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#8b8a85" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="30" height="30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="41" fill="none" stroke="#8b8a85" strokeWidth="4" />
              <ellipse cx="50" cy="50" rx="46" ry="17.5" fill="none" stroke="#f3f2ee" strokeWidth="4.5" transform="rotate(-22 50 50)" />
              <circle cx="50" cy="50" r="15" fill="#ff4a1c" />
            </svg>
            <span style={{ color: "#f3f2ee" }}>AISON LABS</span>
          </div>
          <span>
            <span style={{ color: "#ff4a1c" }}>PRODUCTS</span> / ENGINEERING / RESEARCH
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 700, letterSpacing: -5, lineHeight: 0.92 }}>
          <span>We build</span>
          <span>technology for</span>
          <span>what comes next.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#8b8a85" }}>
          <span>SMALL TEAM. LARGE HORIZON.</span>
          <span>INDIA</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
