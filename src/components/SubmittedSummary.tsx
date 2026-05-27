import React from "react";
import { Icon } from "./Icon";

interface SubmittedSummaryProps {
  inputMode: "paste" | "pdf" | "url";
  title: string;
  onEdit: () => void;
  onClear: () => void;
}

export function SubmittedSummary({
  inputMode,
  title,
  onEdit,
  onClear,
}: SubmittedSummaryProps) {
  const icon =
    inputMode === "pdf"
      ? "capture"
      : inputMode === "url"
      ? "arrow-right"
      : "type";

  return (
    <div style={ssS.wrap}>
      <span style={ssS.iconBox}>
        <Icon name={icon} size={13} color="var(--forest-700)" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="eyebrow" style={{ fontSize: "9.5px" }}>
          SUBMITTED
        </div>
        <div style={ssS.title}>{title}</div>
      </div>
      <button onClick={onEdit} style={ssS.btn}>
        <Icon name="type" size={12} />
        <span>Edit</span>
      </button>
      <button onClick={onClear} style={ssS.btn} title="Start over">
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}

const ssS = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    background: "rgba(255, 255, 255, 0.55)",
    border: "1px solid var(--hairline)",
    borderRadius: 14,
    marginBottom: 12,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "var(--surface-wash)",
    display: "grid",
    placeItems: "center",
  },
  title: {
    marginTop: 2,
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink)",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
