import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SAMPLES } from "../components/ResultCard";

export function SharedResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);

  // Fallback shared content based on the sample in ResultCard
  const text = SAMPLES.simplify.calm.text;
  const originalText = SAMPLES.source;

  return (
    <main style={srS.shell}>
      <header style={srS.header}>
        <span style={srS.eyebrow}>
          <Icon name="lock" size={11} color="var(--forest-500)" />
          <span>Shared via Cognitext · view-only</span>
        </span>
        <div style={srS.metaRow}>
          <span style={srS.ownerPill}>
            <span style={srS.ownerAvatar}>EM</span>
            <span>Shared by Elena Marsh</span>
          </span>
          <span style={srS.dot}>·</span>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>2,418 views</span>
          <span style={srS.dot}>·</span>
          <span style={{ fontSize: 12, color: "var(--ink-mute)", fontFamily: "IBM Plex Mono, monospace" }}>
            {id || "r-7HxN42p"}
          </span>
        </div>
      </header>

      <h1 className="font-display" style={srS.title}>The phenomenological reduction</h1>

      <article style={srS.article}>
        <div style={srS.tagRow}>
          <span style={srS.tag}>
            <Icon name="simplify" size={11} />
            <span>Simplified · grade 6</span>
          </span>
          <span style={srS.tag}>Source · plato.stanford.edu</span>
          <span style={srS.tag}>Profile · Calm</span>
        </div>

        <p style={srS.body}>{text}</p>

        <div style={srS.divider} />

        <details style={srS.originalDetails}>
          <summary style={srS.originalSummary}>
            <Icon name="chevron" size={11} />
            <span>Show original</span>
          </summary>
          <p style={srS.original}>{originalText}</p>
        </details>

        {/* Player */}
        <div style={srS.player}>
          <button onClick={() => setPlaying((p) => !p)} style={srS.playBtn}>
            <Icon name={playing ? "pause" : "play"} size={11} color="var(--paper-50)" />
          </button>
          <div style={srS.wave}>
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 3 + Math.abs(Math.sin(i * 0.5)) * 12,
                  background:
                    playing && i < 14 ? "var(--ember-300)" : "rgba(255,255,255,0.22)",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontSize: 11,
              fontFamily: "IBM Plex Mono, monospace",
              color: "rgba(253,248,239,0.65)",
            }}
          >
            0:22
          </span>
        </div>
      </article>

      <footer style={srS.foot}>
        <div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>
            Want to read your own texts like this?
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 13.5, color: "var(--ink-mute)" }}>
            3 free reads every day, no signup needed.
          </p>
        </div>
        <button onClick={() => navigate("/")} style={srS.tryCta}>
          <Icon name="sparkle" size={13} color="var(--paper-50)" />
          <span>Try Cognitext</span>
          <Icon name="arrow-right" size={12} color="var(--paper-50)" />
        </button>
      </footer>
    </main>
  );
}

const srS: Record<string, React.CSSProperties> = {
  shell: {
    position: "relative",
    zIndex: 1,
    maxWidth: 740,
    margin: "0 auto",
    padding: "32px 40px 60px",
  },
  header: { textAlign: "center", marginBottom: 22 },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 99,
    background: "rgba(45,90,71,0.08)",
    color: "var(--forest-700)",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  metaRow: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ownerPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12.5,
    color: "var(--ink)",
  },
  ownerAvatar: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, var(--forest-500), var(--forest-700))",
    color: "var(--paper-50)",
    display: "inline-grid",
    placeItems: "center",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  dot: { color: "var(--ink-faint)" },
  title: {
    margin: "0 0 22px",
    fontSize: 38,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
    textAlign: "center",
    textWrap: "balance" as const,
  },
  article: {
    padding: "32px 36px 0",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 22,
    overflow: "hidden",
    boxShadow:
      "0 24px 80px rgba(16,37,29,0.10), 0 1px 0 rgba(255,255,255,0.7) inset",
  },
  tagRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 99,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--forest-700)",
  },
  body: {
    margin: 0,
    fontSize: 19,
    lineHeight: 1.75,
    color: "var(--ink)",
    letterSpacing: "-0.005em",
    textWrap: "pretty" as const,
  },
  divider: { height: 1, background: "var(--hairline)", margin: "26px 0 16px" },
  originalDetails: { marginBottom: 26 },
  originalSummary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "6px 12px",
    borderRadius: 8,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    listStyle: "none",
  },
  original: {
    margin: "14px 0 0",
    fontSize: 13.5,
    lineHeight: 1.7,
    color: "var(--ink-soft)",
    fontStyle: "italic",
  },
  player: {
    marginTop: 18,
    marginLeft: -36,
    marginRight: -36,
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 36px",
    background: "linear-gradient(180deg, var(--forest-800), var(--forest-900))",
    borderTop: "1px solid var(--hairline-strong)",
  },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "var(--ember-400)",
    border: "none",
    display: "inline-grid",
    placeItems: "center",
    cursor: "pointer",
  },
  wave: { flex: 1, display: "flex", alignItems: "center", gap: 2, height: 20 },
  foot: {
    marginTop: 22,
    padding: "20px 24px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.5)",
    border: "1px solid var(--hairline)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  tryCta: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 16px",
    borderRadius: 11,
    background: "linear-gradient(180deg, var(--ember-400), var(--ember-500))",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 14px 30px rgba(216,100,31,0.32)",
  },
};
