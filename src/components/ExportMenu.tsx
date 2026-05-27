import React, { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";

interface ExportMenuProps {
  plan?: string;
  onAction?: (format: string) => void;
}

export function ExportMenu({ plan = "free", onAction }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const items = [
    {
      v: "txt",
      label: "Plain text",
      sub: "Just the result",
      i: "type",
      gated: false,
    },
    {
      v: "md",
      label: "Markdown",
      sub: "Result + metadata",
      i: "type",
      gated: false,
    },
    {
      v: "pdf",
      label: "Styled PDF",
      sub: "Reading-ready",
      i: "capture",
      gated: plan === "free",
    },
    {
      v: "side",
      label: "Side-by-side PDF",
      sub: "Original + simplified",
      i: "capture",
      gated: plan !== "pro",
    },
    {
      v: "link",
      label: "Shareable link",
      sub: "Anyone with the URL",
      i: "arrow-right",
      gated: plan !== "pro",
    },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} style={exS.trigger}>
        <Icon name="arrow-right" size={12} />
        <span>Export</span>
        <Icon name="chevron" size={10} />
      </button>
      {open && (
        <div style={exS.menu}>
          {items.map((item) => (
            <button
              key={item.v}
              disabled={item.gated}
              onClick={() => {
                setOpen(false);
                onAction?.(item.v);
              }}
              style={{
                ...exS.item,
                opacity: item.gated ? 0.55 : 1,
                cursor: item.gated ? "not-allowed" : "pointer",
              }}
            >
              <span style={exS.itemIcon}>
                <Icon name={item.i} size={11} color="var(--forest-700)" />
              </span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "10.5px",
                    color: "var(--ink-mute)",
                    marginTop: 1,
                  }}
                >
                  {item.sub}
                </div>
              </div>
              {item.gated && (
                <span style={exS.lockTag}>
                  {plan === "free" ? "Plus" : "Pro"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const exS = {
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 11px",
    borderRadius: 8,
    background: "rgba(255, 255, 255, 0.5)",
    border: "1px solid var(--hairline)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--forest-700)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  menu: {
    position: "absolute" as const,
    top: "calc(100% + 6px)",
    right: 0,
    minWidth: 240,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline-strong)",
    borderRadius: 12,
    boxShadow: "0 20px 50px rgba(10, 25, 20, 0.22)",
    overflow: "hidden",
    padding: 6,
    zIndex: 50,
  },
  item: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "none",
    fontFamily: "inherit",
    textAlign: "left" as const,
    transition: "background .1s",
  },
  itemIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    background: "var(--surface-wash)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  lockTag: {
    fontSize: "9.5px",
    padding: "2px 7px",
    borderRadius: 5,
    background: "var(--ember-100)",
    color: "var(--ember-500)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    fontFamily: "IBM Plex Mono, monospace",
  },
};
