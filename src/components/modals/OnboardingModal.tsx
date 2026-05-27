import React, { useState } from "react";
import { Icon } from "../Icon";
import { WebMark } from "../WebMark";

export interface OnboardingModalProps {
  onClose: () => void;
  onDone: (data: { profile: string; emailDigest: boolean }) => void;
  defaultProfile?: string;
}

export const ONBOARD_PROFILES = [
  {
    v: "plain",
    label: "Plain English",
    sub: "Simple words, short sentences. Grade ~4.",
    built: "esl-learner",
  },
  {
    v: "calm",
    label: "Calm reading",
    sub: "Balanced grade 6. Best default.",
    built: "grade-level",
  },
  {
    v: "studied",
    label: "Studied & precise",
    sub: "Keeps nuance. Grade ~9–12.",
    built: "professional-plain-english",
  },
];

export function OnboardingModal({
  onClose,
  onDone,
  defaultProfile = "calm",
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [profileChoice, setProfileChoice] = useState(defaultProfile);
  const [emailDigest, setEmailDigest] = useState(true);

  const steps = ["Welcome", "How you read", "You're set"];
  const finish = () => {
    onDone?.({ profile: profileChoice, emailDigest });
  };

  return (
    <div style={obS.scrim}>
      <div style={obS.card}>
        <header style={obS.head}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WebMark size={24} />
            <span
              className="font-display"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--forest-900)",
              }}
            >
              Cognitext
            </span>
          </div>
          <button onClick={onClose} style={obS.skip}>
            Skip
          </button>
        </header>

        <div style={obS.progress}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                ...obS.step,
                color: i <= step ? "var(--forest-900)" : "var(--ink-mute)",
              }}
            >
              <span
                style={{
                  ...obS.stepDot,
                  background:
                    i < step
                      ? "var(--forest-500)"
                      : i === step
                      ? "var(--ember-400)"
                      : "var(--hairline-strong)",
                }}
              />
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div style={obS.body}>
          {step === 0 && (
            <>
              <h2 className="font-display" style={obS.h2}>
                Welcome to Cognitext.
              </h2>
              <p style={obS.lede}>
                A few seconds of setup so the first read feels like yours. You
                can change everything later in Preferences.
              </p>
              <div style={obS.bullets}>
                {[
                  ["sparkle", "Unlimited reads while you're signed in this month"],
                  ["history", "Reading history is saved (90 days on Plus)"],
                  ["lock", "Content stays private unless you share a result"],
                ].map(([i, t]) => (
                  <div key={t} style={obS.bullet}>
                    <span style={obS.bulletIcon}>
                      <Icon name={i} size={11} color="var(--forest-700)" />
                    </span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display" style={obS.h2}>
                How would you like text rewritten?
              </h2>
              <p style={obS.lede}>
                Pick a reading profile. You can switch any time with the chips
                on a result.
              </p>
              <div style={obS.profileGrid}>
                {ONBOARD_PROFILES.map((p) => (
                  <button
                    key={p.v}
                    onClick={() => setProfileChoice(p.v)}
                    style={{
                      ...obS.profileCard,
                      borderColor:
                        profileChoice === p.v
                          ? "var(--forest-700)"
                          : "var(--hairline)",
                      background:
                        profileChoice === p.v
                          ? "var(--paper-50)"
                          : "rgba(255,255,255,0.5)",
                      boxShadow:
                        profileChoice === p.v
                          ? "0 12px 24px rgba(16,37,29,0.10)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        className="font-display"
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--forest-900)",
                        }}
                      >
                        {p.label}
                      </span>
                      {profileChoice === p.v && (
                        <span style={obS.checkBubble}>
                          <Icon
                            name="check"
                            size={10}
                            color="var(--paper-50)"
                            stroke={2.6}
                          />
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        lineHeight: 1.5,
                      }}
                    >
                      {p.sub}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={obS.celebrate}>
                <span style={obS.celebrateMark}>
                  <Icon
                    name="check"
                    size={22}
                    color="var(--paper-50)"
                    stroke={2.4}
                  />
                </span>
              </div>
              <h2
                className="font-display"
                style={{ ...obS.h2, textAlign: "center" }}
              >
                You're set, Elena.
              </h2>
              <p style={{ ...obS.lede, textAlign: "center" }}>
                Profile:{" "}
                <strong style={{ color: "var(--forest-900)" }}>
                  {ONBOARD_PROFILES.find((p) => p.v === profileChoice)?.label}
                </strong>
                . Adjust anything later in Preferences.
              </p>
              <label style={obS.checkRow}>
                <span
                  style={{
                    position: "relative",
                    width: 18,
                    height: 18,
                    marginRight: 10,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: 0,
                      opacity: 0,
                    }}
                  />
                  <span
                    style={{
                      ...obS.checkBox,
                      background: emailDigest ? "var(--forest-900)" : "transparent",
                      borderColor: emailDigest
                        ? "var(--forest-900)"
                        : "var(--hairline-strong)",
                    }}
                  >
                    {emailDigest && (
                      <Icon
                        name="check"
                        size={10}
                        color="var(--paper-50)"
                        stroke={2.6}
                      />
                    )}
                  </span>
                </span>
                <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  Send me a weekly digest of reading tips & product updates
                </span>
              </label>
            </>
          )}
        </div>

        <footer style={obS.foot}>
          <button
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            style={obS.backBtn}
          >
            <span>{step === 0 ? "Skip onboarding" : "Back"}</span>
          </button>
          <button
            onClick={() => (step === 2 ? finish() : setStep((s) => s + 1))}
            style={obS.nextBtn}
          >
            <span>{step === 2 ? "Start reading" : "Continue"}</span>
            <Icon name="arrow-right" size={13} color="var(--paper-50)" />
          </button>
        </footer>
      </div>
    </div>
  );
}

const obS: Record<string, React.CSSProperties> = {
  scrim: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    background: "rgba(10,25,20,0.42)",
    backdropFilter: "blur(8px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  card: {
    width: 540,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 22,
    boxShadow:
      "0 30px 80px rgba(10,25,20,0.32), 0 1px 0 rgba(255,255,255,0.7) inset",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    borderBottom: "1px solid var(--hairline)",
  },
  skip: {
    background: "transparent",
    border: "none",
    fontSize: 12,
    color: "var(--ink-mute)",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
    gap: 22,
    padding: "14px 24px",
    background: "var(--surface-wash)",
    borderBottom: "1px solid var(--hairline)",
  },
  step: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 600 },
  stepDot: { width: 8, height: 8, borderRadius: "50%" },
  body: { padding: "32px 32px 24px", minHeight: 320 },
  h2: {
    margin: "0 0 10px",
    fontSize: 24,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.02em",
  },
  lede: { margin: "0 0 24px", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 },
  bullets: { display: "flex", flexDirection: "column", gap: 12 },
  bullet: { display: "flex", alignItems: "center", gap: 12, fontSize: 13.5, color: "var(--ink)" },
  bulletIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
  },
  profileGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
  profileCard: {
    padding: "16px 18px",
    border: "1.5px solid",
    borderRadius: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all .15s",
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "var(--forest-700)",
    display: "grid",
    placeItems: "center",
  },
  celebrate: { display: "flex", justifyContent: "center", marginBottom: 18 },
  celebrateMark: {
    width: 60,
    height: 60,
    borderRadius: 18,
    background: "linear-gradient(135deg, var(--forest-500), var(--forest-700))",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 16px 32px rgba(45,90,71,0.30)",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: 12,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    cursor: "pointer",
    marginTop: 18,
  },
  checkBox: {
    display: "grid",
    placeItems: "center",
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "1.5px solid",
  },
  foot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "var(--surface-wash)",
    borderTop: "1px solid var(--hairline)",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: "6px 12px",
  },
  nextBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 10,
    background: "var(--forest-900)",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 20px rgba(10,25,20,0.22)",
  },
};
