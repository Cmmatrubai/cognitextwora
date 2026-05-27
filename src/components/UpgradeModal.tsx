import React, { useState } from "react";
import { Icon } from "./Icon";

export interface UpgradeModalProps {
  onClose: () => void;
  onConfirm: (plan: "plus" | "pro") => void;
  pendingPlan?: "free" | "plus" | "pro" | string;
}

export function UpgradeModal({
  onClose,
  onConfirm,
  pendingPlan = "plus",
}: UpgradeModalProps) {
  const [yearly, setYearly] = useState(true);
  const [selected, setSelected] = useState<"plus" | "pro">(
    pendingPlan === "pro" ? "pro" : "plus"
  );

  return (
    <div style={modalS.scrim} onClick={onClose}>
      <div style={modalS.largeCard} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={modalS.closeBtn}>
          <Icon name="x" size={13} />
        </button>

        <span style={modalS.upgradeEyebrow}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--ember-400)",
            }}
          />
          <span>30 of 30 used this month</span>
        </span>

        <h2 className="font-display" style={modalS.upgradeTitle}>
          You're loving Cognitext.
        </h2>
        <p style={modalS.upgradeSub}>
          Plus removes the limit, unlocks premium voices, and lets you read PDFs
          of any length. Cancel any time.
        </p>

        <button onClick={() => setYearly((y) => !y)} style={modalS.upToggle}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: yearly ? "var(--ink-soft)" : "var(--forest-900)",
            }}
          >
            Monthly
          </span>
          <span style={modalS.upSwitch}>
            <span
              style={{
                ...modalS.upSwitchDot,
                transform: yearly ? "translateX(14px)" : "translateX(0)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: yearly ? "var(--forest-900)" : "var(--ink-soft)",
            }}
          >
            Yearly <span style={{ color: "var(--ember-500)" }}>· save 25%</span>
          </span>
        </button>

        <div style={modalS.upPlans}>
          <button
            onClick={() => setSelected("plus")}
            style={{
              ...modalS.upPlan,
              borderColor:
                selected === "plus" ? "var(--ember-400)" : "var(--hairline)",
              background:
                selected === "plus"
                  ? "var(--paper-50)"
                  : "rgba(255,255,255,0.5)",
              boxShadow:
                selected === "plus" ? "0 16px 40px rgba(216,100,31,0.16)" : "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <div style={modalS.upPlanHead}>
              <h3 className="font-display" style={modalS.upPlanName}>
                Plus
              </h3>
              <span
                style={{
                  ...modalS.popularSmall,
                  background: "var(--ember-400)",
                }}
              >
                Most popular
              </span>
            </div>
            <div style={modalS.upPriceRow}>
              <span style={modalS.upDollar}>$</span>
              <span className="font-display" style={modalS.upPrice}>
                {yearly ? 6 : 8}
              </span>
              <div style={{ marginLeft: 4 }}>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                  / month
                </div>
                {yearly && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-faint)",
                      textDecoration: "line-through",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    $8
                  </div>
                )}
              </div>
            </div>
            <ul style={modalS.upFeats}>
              <li style={modalS.upFeat}>
                <Check /> Unlimited reads
              </li>
              <li style={modalS.upFeat}>
                <Check /> Premium voices · 12
              </li>
              <li style={modalS.upFeat}>
                <Check /> PDF unlimited pages
              </li>
              <li style={modalS.upFeat}>
                <Check /> 90-day history
              </li>
            </ul>
          </button>

          <button
            onClick={() => setSelected("pro")}
            style={{
              ...modalS.upPlan,
              borderColor:
                selected === "pro" ? "var(--forest-700)" : "var(--hairline)",
              background:
                selected === "pro" ? "var(--paper-50)" : "rgba(255,255,255,0.5)",
              boxShadow:
                selected === "pro" ? "0 16px 40px rgba(16,37,29,0.18)" : "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <div style={modalS.upPlanHead}>
              <h3
                className="font-display"
                style={{ ...modalS.upPlanName, color: "var(--forest-700)" }}
              >
                Pro
              </h3>
              <span
                style={{
                  ...modalS.popularSmall,
                  background: "var(--forest-700)",
                  color: "var(--paper-50)",
                }}
              >
                Power
              </span>
            </div>
            <div style={modalS.upPriceRow}>
              <span style={modalS.upDollar}>$</span>
              <span className="font-display" style={modalS.upPrice}>
                {yearly ? 14 : 18}
              </span>
              <div style={{ marginLeft: 4 }}>
                <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>
                  / month
                </div>
                {yearly && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--ink-faint)",
                      textDecoration: "line-through",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    $18
                  </div>
                )}
              </div>
            </div>
            <ul style={modalS.upFeats}>
              <li style={modalS.upFeat}>
                <Check /> Everything in Plus
              </li>
              <li style={modalS.upFeat}>
                <Check /> Desktop app · all OSes
              </li>
              <li style={modalS.upFeat}>
                <Check /> Custom reading profiles
              </li>
              <li style={modalS.upFeat}>
                <Check /> API · 10k calls/mo
              </li>
            </ul>
          </button>
        </div>

        <div style={modalS.upActions}>
          <button
            onClick={() => onConfirm(selected)}
            style={modalS.upPrimary}
          >
            <span>Continue to {selected === "pro" ? "Pro" : "Plus"} checkout</span>
            <Icon name="arrow-right" size={13} color="var(--paper-50)" />
          </button>
          <button onClick={onClose} style={modalS.upSecondary}>
            Maybe later
          </button>
        </div>

        <div style={modalS.upTrust}>
          <Icon name="lock" size={11} color="var(--ink-mute)" />
          <span>
            Secure checkout via Stripe. Cancel any time. Money back within 14 days.
          </span>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: 4,
        background: "var(--forest-700)",
        display: "inline-grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Icon name="check" size={8} color="var(--paper-50)" stroke={2.8} />
    </span>
  );
}

const modalS: Record<string, React.CSSProperties> = {
  scrim: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(10,25,20,0.42)",
    backdropFilter: "blur(8px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
    animation: "ct-fade-in 0.2s ease-out",
  },
  largeCard: {
    position: "relative",
    width: 620,
    padding: "40px 44px 32px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 26,
    boxShadow:
      "0 30px 80px rgba(10,25,20,0.32), 0 1px 0 rgba(255,255,255,0.7) inset",
    animation: "ct-blur-in 0.3s ease-out",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "transparent",
    border: "1px solid var(--hairline)",
    display: "inline-grid",
    placeItems: "center",
    cursor: "pointer",
    color: "var(--ink-mute)",
  },
  upgradeEyebrow: {
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
  upgradeTitle: {
    margin: "14px 0 8px",
    fontSize: 32,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
  },
  upgradeSub: {
    margin: "0 0 22px",
    fontSize: 14.5,
    color: "var(--ink-soft)",
    lineHeight: 1.6,
    maxWidth: 440,
    textWrap: "pretty",
  },
  upToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "6px 12px",
    borderRadius: 99,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    marginBottom: 20,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  upSwitch: {
    position: "relative",
    width: 30,
    height: 16,
    borderRadius: 99,
    background: "var(--forest-700)",
  },
  upSwitchDot: {
    position: "absolute",
    top: 1,
    left: 1,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "var(--paper-50)",
    transition: "transform .2s ease",
  },
  upPlans: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 22,
  },
  upPlan: {
    padding: "20px 22px 22px",
    borderRadius: 16,
    border: "1.5px solid var(--hairline)",
  },
  upPlanHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  upPlanName: { margin: 0, fontSize: 20, fontWeight: 700, color: "var(--ember-500)" },
  popularSmall: {
    fontSize: 9.5,
    padding: "2px 7px",
    borderRadius: 5,
    color: "var(--paper-50)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    fontFamily: "IBM Plex Mono, monospace",
  },
  upPriceRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 2,
    marginBottom: 14,
  },
  upDollar: { marginTop: 6, fontSize: 16, fontWeight: 600, color: "var(--forest-900)" },
  upPrice: {
    fontSize: 42,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },
  upFeats: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  upFeat: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink)" },
  upActions: { display: "flex", gap: 10 },
  upPrimary: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "14px 16px",
    borderRadius: 12,
    background: "linear-gradient(180deg, var(--ember-400), var(--ember-500))",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 14px 30px rgba(216,100,31,0.32)",
  },
  upSecondary: {
    padding: "14px 18px",
    borderRadius: 12,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  upTrust: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 16,
    fontSize: 11,
    color: "var(--ink-mute)",
  },
};
