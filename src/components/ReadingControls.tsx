import React from "react";
import { Icon } from "./Icon";

export const READING_SIZES = [
  { v: "s", label: "S", fontSize: 15, name: "Small" },
  { v: "m", label: "M", fontSize: 18, name: "Medium" },
  { v: "l", label: "L", fontSize: 21, name: "Large" },
  { v: "xl", label: "XL", fontSize: 25, name: "Extra large" },
];

export const READING_SPACINGS = [
  { v: "compact", icon: "minus", lineHeight: 1.45, name: "Compact" },
  { v: "normal", icon: "type", lineHeight: 1.7, name: "Normal" },
  { v: "roomy", icon: "plus", lineHeight: 1.95, name: "Roomy" },
];

export const OUTPUT_LENGTHS = [
  { v: "short", label: "Short" },
  { v: "standard", label: "Standard" },
  { v: "detailed", label: "Detailed" },
];

interface ReadingControlsProps {
  size: "s" | "m" | "l" | "xl";
  setSize: (size: "s" | "m" | "l" | "xl") => void;
  spacing: "compact" | "normal" | "roomy";
  setSpacing: (spacing: "compact" | "normal" | "roomy") => void;
  length: "short" | "standard" | "detailed";
  setLength: (length: "short" | "standard" | "detailed") => void;
  op: "simplify" | "translate";
}

export function ReadingControls({
  size,
  setSize,
  spacing,
  setSpacing,
  length,
  setLength,
  op,
}: ReadingControlsProps) {
  return (
    <div style={rcS.bar}>
      <div style={rcS.group}>
        <span style={rcS.label}>Size</span>
        <div style={rcS.segment}>
          {READING_SIZES.map((s) => (
            <button
              key={s.v}
              title={s.name}
              onClick={() => setSize(s.v as "s" | "m" | "l" | "xl")}
              style={{
                ...rcS.seg,
                background: size === s.v ? "var(--paper-50)" : "transparent",
                color: size === s.v ? "var(--forest-900)" : "var(--ink-soft)",
                boxShadow:
                  size === s.v ? "0 1px 3px rgba(16,37,29,0.08)" : "none",
                fontSize:
                  11 +
                  (s.v === "xl" ? 2 : s.v === "l" ? 1 : s.v === "s" ? -1 : 0),
                fontWeight: 700,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={rcS.group}>
        <span style={rcS.label}>Spacing</span>
        <div style={rcS.segment}>
          {READING_SPACINGS.map((s) => (
            <button
              key={s.v}
              title={s.name}
              onClick={() => setSpacing(s.v as "compact" | "normal" | "roomy")}
              style={{
                ...rcS.seg,
                padding: "6px 9px",
                background:
                  spacing === s.v ? "var(--paper-50)" : "transparent",
                color:
                  spacing === s.v ? "var(--forest-900)" : "var(--ink-soft)",
                boxShadow:
                  spacing === s.v ? "0 1px 3px rgba(16,37,29,0.08)" : "none",
              }}
            >
              <Icon name={s.icon} size={11} color="currentColor" stroke={2.2} />
            </button>
          ))}
        </div>
      </div>

      {op === "simplify" && (
        <div style={{ ...rcS.group, marginLeft: "auto" }}>
          <span style={rcS.label}>Length</span>
          <div style={rcS.segment}>
            {OUTPUT_LENGTHS.map((o) => (
              <button
                key={o.v}
                onClick={() =>
                  setLength(o.v as "short" | "standard" | "detailed")
                }
                style={{
                  ...rcS.seg,
                  background:
                    length === o.v ? "var(--paper-50)" : "transparent",
                  color:
                    length === o.v ? "var(--forest-900)" : "var(--ink-soft)",
                  boxShadow:
                    length === o.v ? "0 1px 3px rgba(16,37,29,0.08)" : "none",
                  fontWeight: 600,
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const rcS = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 22,
    padding: "10px 22px",
    background: "var(--surface-wash)",
    borderBottom: "1px solid var(--hairline)",
  },
  group: { display: "inline-flex", alignItems: "center", gap: 8 },
  label: {
    fontSize: 10,
    color: "var(--ink-mute)",
    fontFamily: "Space Grotesk",
    letterSpacing: "0.10em",
    textTransform: "uppercase" as const,
    fontWeight: 600,
  },
  segment: {
    display: "inline-flex",
    padding: 2,
    borderRadius: 8,
    background: "var(--hairline)",
  },
  seg: {
    padding: "6px 11px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
    transition: "all .12s",
  },
};
