import React from "react";

interface WebMarkProps {
  size?: number;
}

export function WebMark({ size = 28 }: WebMarkProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background:
          "linear-gradient(135deg, var(--forest-700), var(--forest-900))",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 6px 14px rgba(10, 25, 20, 0.22)",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--ember-300), var(--ember-500))",
        }}
      />
    </div>
  );
}
