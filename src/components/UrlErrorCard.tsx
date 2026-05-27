import React from "react";
import { Icon } from "./Icon";

export interface UrlErrorCardProps {
  url: string;
  onPaste: () => void;
  onRetry: () => void;
}

export function UrlErrorCard({ url, onPaste, onRetry }: UrlErrorCardProps) {
  return (
    <div style={errS.card}>
      <div style={errS.iconWrap}>
        <Icon name="x" size={20} color="var(--ember-500)" />
      </div>
      <h3 className="font-display" style={errS.title}>
        This page didn't want to be read.
      </h3>
      <p style={errS.lede}>
        We couldn't extract the article from{" "}
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            color: "var(--forest-700)",
          }}
        >
          {url || "that URL"}
        </span>
        . The site blocked us, or the article is behind a login.
      </p>

      <div style={errS.options}>
        <button onClick={onPaste} style={errS.option}>
          <span style={errS.optionIcon}>
            <Icon name="type" size={14} color="var(--forest-700)" />
          </span>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={errS.optionTitle}>Paste it as text instead</div>
            <div style={errS.optionDesc}>Open the article, select all, paste here.</div>
          </div>
          <Icon name="arrow-right" size={13} color="var(--ink-mute)" />
        </button>
        <button style={errS.option}>
          <span style={errS.optionIcon}>
            <Icon name="capture" size={14} color="var(--forest-700)" />
          </span>
          <div style={{ textAlign: "left", flex: 1 }}>
            <div style={errS.optionTitle}>Use the desktop app</div>
            <div style={errS.optionDesc}>
              Capture any region of any window — paywalls included.
            </div>
          </div>
          <Icon name="arrow-right" size={13} color="var(--ink-mute)" />
        </button>
      </div>

      <div style={errS.diag}>
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10.5,
            color: "var(--ink-mute)",
            letterSpacing: "0.04em",
          }}
        >
          ERROR · 403 · readability_no_main_content
        </span>
        <button
          onClick={onRetry}
          style={{
            fontSize: 11,
            color: "var(--ember-500)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          Try again →
        </button>
      </div>
    </div>
  );
}

const errS: Record<string, React.CSSProperties> = {
  card: {
    padding: "36px 36px 28px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 22,
    textAlign: "center",
    boxShadow: "0 24px 80px rgba(16,37,29,0.08)",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    margin: "0 auto 16px",
    background: "rgba(233,122,50,0.12)",
    border: "1px solid rgba(233,122,50,0.25)",
    display: "grid",
    placeItems: "center",
  },
  title: {
    margin: "0 0 8px",
    fontSize: 22,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.02em",
  },
  lede: {
    margin: "0 0 22px",
    fontSize: 14,
    color: "var(--ink-soft)",
    lineHeight: 1.55,
    maxWidth: 420,
    marginLeft: "auto",
    marginRight: "auto",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 420,
    margin: "0 auto 22px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 12,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
  },
  optionTitle: { fontSize: 13.5, fontWeight: 600, color: "var(--ink)" },
  optionDesc: { marginTop: 2, fontSize: 12, color: "var(--ink-mute)" },
  diag: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: 8,
    background: "var(--surface-wash)",
    border: "1px dashed var(--hairline-strong)",
    maxWidth: 420,
    margin: "0 auto",
  },
};
