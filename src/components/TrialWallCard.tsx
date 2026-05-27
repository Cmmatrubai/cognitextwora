import React from "react";
import { Icon } from "./Icon";

export interface TrialWallCardProps {
  onSignin: () => void;
  onMaybeLater: () => void;
  onUpgrade: () => void;
}

export function TrialWallCard({
  onSignin,
  onMaybeLater,
  onUpgrade,
}: TrialWallCardProps) {
  return (
    <div style={wallS.card}>
      <div style={wallS.left}>
        <span style={wallS.eyebrow}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--ember-400)",
            }}
          />
          <span>You hit today's free limit</span>
        </span>
        <h2 className="font-display" style={wallS.h2}>
          Loved it? Sign up to keep going.
        </h2>
        <p style={wallS.lede}>
          Your text is safe — we'll run it the moment you sign in. A free account
          unlocks{" "}
          <strong style={{ color: "var(--forest-900)" }}>
            30 reads a month
          </strong>{" "}
          and saves your history.
        </p>

        <div style={wallS.authStack}>
          <button onClick={onSignin} style={wallS.googleBtn}>
            <Icon name="google" size={16} />
            <span>Continue with Google</span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "var(--ink-mute)",
              }}
            >
              Fastest
            </span>
          </button>
          <button onClick={onSignin} style={wallS.emailBtn}>
            <Icon name="user" size={13} color="var(--ink-soft)" />
            <span>Continue with email</span>
          </button>
        </div>

        <div style={wallS.fineRow}>
          <button onClick={onMaybeLater} style={wallS.fineBtn}>
            Or come back tomorrow →
          </button>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
            resets at midnight
          </span>
        </div>
      </div>

      <div style={wallS.right}>
        <div className="eyebrow">What you'll get</div>
        {[
          { i: "sparkle", l: "30 reads / month, free" },
          { i: "history", l: "Reading history, searchable" },
          { i: "lock", l: "Private — content stays yours" },
          { i: "volume", l: "Custom voice + reading speed" },
          { i: "bolt", l: "Browser shortcut to Cognitext" },
        ].map((b) => (
          <div key={b.l} style={wallS.benefit}>
            <span style={wallS.benefitIcon}>
              <Icon name={b.i} size={11} color="var(--forest-700)" />
            </span>
            <span style={wallS.benefitLabel}>{b.l}</span>
          </div>
        ))}
        <button onClick={onUpgrade} style={wallS.upgradeLink}>
          <Icon name="sparkle" size={12} color="var(--ember-500)" />
          <span>Skip the free tier — go Plus →</span>
        </button>
      </div>
    </div>
  );
}

const wallS: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 24px 80px rgba(16,37,29,0.12)",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
  },
  left: { padding: "36px 36px 32px" },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "4px 10px",
    borderRadius: 99,
    background: "rgba(233,122,50,0.12)",
    color: "var(--ember-500)",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  h2: {
    margin: "16px 0 12px",
    fontSize: 32,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
  },
  lede: {
    margin: "0 0 28px",
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--ink-soft)",
    textWrap: "pretty",
  },
  authStack: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 18,
  },
  googleBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    height: 48,
    padding: "0 18px",
    borderRadius: 12,
    background: "#fff",
    border: "1px solid var(--hairline-strong)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ink)",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow:
      "0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 18px rgba(16,37,29,0.08)",
  },
  emailBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    padding: "0 18px",
    borderRadius: 12,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  fineRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingTop: 14,
    borderTop: "1px solid var(--hairline)",
  },
  fineBtn: {
    background: "none",
    border: "none",
    color: "var(--ember-500)",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },
  right: {
    padding: "36px 32px",
    background: "var(--surface-wash)",
    borderLeft: "1px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  benefit: { display: "flex", alignItems: "center", gap: 10 },
  benefitIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
  },
  benefitLabel: { fontSize: 13, color: "var(--ink)", fontWeight: 500 },
  upgradeLink: {
    marginTop: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 12px",
    borderRadius: 10,
    background: "rgba(233,122,50,0.10)",
    color: "var(--ember-500)",
    fontSize: 12.5,
    fontWeight: 700,
    border: "1px solid rgba(233,122,50,0.20)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
