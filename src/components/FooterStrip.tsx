import React from "react";
import { WebMark } from "./WebMark";

interface FooterStripProps {
  onNavigate?: (page: string) => void;
}

export function FooterStrip({ onNavigate }: FooterStripProps) {
  const link = (label: string, to?: string) => (
    <button
      onClick={() => (to && onNavigate ? onNavigate(to) : null)}
      style={{
        fontSize: 12,
        color: "var(--ink-mute)",
        textDecoration: "none",
        background: "none",
        border: "none",
        cursor: to ? "pointer" : "default",
        fontFamily: "inherit",
        padding: 0,
      }}
    >
      {label}
    </button>
  );

  return (
    <footer
      style={{
        position: "relative",
        padding: "30px 40px 36px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--hairline)",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <WebMark size={22} />
        <span
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--forest-900)",
          }}
        >
          Cognitext
        </span>
        <span style={{ fontSize: 11, color: "var(--ink-mute)", marginLeft: 4 }}>
          © 2026 · Built for readers
        </span>
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        {link("Pricing", "/pricing")}
        {link("Desktop", "/account?sec=desktop")}
        {link("Extension")}
        {link("Privacy")}
        {link("Terms")}
        {link("Status")}
      </div>
    </footer>
  );
}
