import React from "react";
import { Icon } from "./Icon";

export interface RecentReadsStripProps {
  onOpen: (view: string, id?: string) => void;
}

const FAKE_RECENT = [
  {
    id: "r-241",
    title: "Stanford Encyclopedia · phenomenology",
    when: "2m ago",
    mode: "simplify",
    icon: "type",
  },
  {
    id: "r-240",
    title: "earnings.pdf · page 4",
    when: "18m ago",
    mode: "simplify",
    icon: "capture",
  },
  {
    id: "r-239",
    title: "nytimes.com/article/lease-history",
    when: "1h ago",
    mode: "translate",
    icon: "arrow-right",
  },
  {
    id: "r-238",
    title: "RFC 9110 — §13 caching",
    when: "Yesterday",
    mode: "simplify",
    icon: "type",
  },
];

export function RecentReadsStrip({ onOpen }: RecentReadsStripProps) {
  return (
    <section style={rrS.shell}>
      <div style={rrS.head}>
        <span className="eyebrow">Recent reads</span>
        <button style={rrS.viewAll} onClick={() => onOpen("history")}>
          <span>View all</span>
          <Icon name="arrow-right" size={11} color="var(--ember-500)" />
        </button>
      </div>
      <div style={rrS.row}>
        {FAKE_RECENT.map((r) => (
          <button
            key={r.id}
            style={rrS.chip}
            onClick={() => onOpen("shared", r.id)}
          >
            <span style={rrS.chipIcon}>
              <Icon name={r.icon} size={11} color="var(--forest-700)" />
            </span>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={rrS.chipTitle}>{r.title}</div>
              <div style={rrS.chipMeta}>
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 6px",
                    borderRadius: 4,
                    background:
                      r.mode === "translate"
                        ? "var(--ember-100)"
                        : "var(--forest-100)",
                    color:
                      r.mode === "translate"
                        ? "var(--ember-500)"
                        : "var(--forest-700)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {r.mode}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {r.when}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

const rrS: Record<string, React.CSSProperties> = {
  shell: { marginTop: 24 },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAll: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid rgba(233,122,50,0.20)",
    fontSize: 11.5,
    fontWeight: 700,
    color: "var(--ember-500)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  row: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left" as const,
  },
  chipIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  chipTitle: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--ink)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chipMeta: { marginTop: 3, display: "flex", alignItems: "center", gap: 6 },
};
