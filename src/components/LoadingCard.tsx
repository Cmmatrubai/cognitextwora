import React from "react";

export interface LoadingCardProps {
  op: "simplify" | "translate";
  progress: number;
  phase: "reading" | "thinking" | "polishing";
}

export function LoadingCard({ op, progress, phase }: LoadingCardProps) {
  const phaseLabel =
    {
      reading: "Reading text",
      thinking: op === "simplify" ? "Simplifying" : "Translating",
      polishing: "Polishing",
    }[phase] || "Working";

  return (
    <div style={rS.card}>
      <div style={rS.head}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              ...rS.dot,
              background: "var(--ember-400)",
              boxShadow: "0 0 0 4px rgba(233,122,50,0.18)",
            }}
          />
          <span className="eyebrow">{phaseLabel}</span>
        </div>
        <span className="eyebrow">{Math.round(progress)}%</span>
      </div>
      <div style={{ padding: "12px 26px 0" }}>
        <div style={rS.progressTrack}>
          <div style={{ ...rS.progressFill, width: `${progress}%` }} />
        </div>
      </div>
      <div
        style={{
          padding: "22px 28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[92, 86, 73, 48].map((w, i) => (
          <span
            key={i}
            className="skeleton-line"
            style={{ height: 18, width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

const rS: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow:
      "0 24px 80px rgba(16,37,29,0.10), 0 1px 0 rgba(255,255,255,0.7) inset",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 22px 14px",
    borderBottom: "1px solid var(--hairline)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  progressTrack: {
    height: 4,
    background: "var(--hairline-strong)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--forest-700), var(--ember-400))",
    borderRadius: 99,
    transition: "width .35s cubic-bezier(.25,.9,.3,1.1)",
  },
};
