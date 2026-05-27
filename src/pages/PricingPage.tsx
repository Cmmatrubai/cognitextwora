import React, { useState } from "react";
import { Icon } from "../components/Icon";

export interface PricingPageProps {
  onUpgrade: (plan: string) => void;
  onSignin: () => void;
  isAuthed: boolean;
  currentPlan?: string;
}

export function PricingPage({
  onUpgrade,
  onSignin,
  isAuthed,
  currentPlan = "free",
}: PricingPageProps) {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tiers = [
    {
      v: "free",
      name: "Free",
      tag: "For curious readers",
      monthly: 0,
      yearly: 0,
      features: [
        "30 simplifications / month",
        "Paste, PDF (≤ 10 pages), URL",
        "All 7 languages",
        "5 built-in reading profiles",
        "TTS (browser voice)",
      ],
    },
    {
      v: "plus",
      name: "Plus",
      tag: "For daily readers",
      monthly: 8,
      yearly: 6,
      featured: true,
      features: [
        "Unlimited simplifications",
        "PDF unlimited pages",
        "Premium voices · 12",
        "Result history (90 days)",
        "Markdown + styled PDF export",
        "Priority support",
      ],
    },
    {
      v: "pro",
      name: "Pro",
      tag: "For professionals",
      monthly: 18,
      yearly: 14,
      features: [
        "Everything in Plus",
        "Desktop app — every platform",
        "Custom reading profiles",
        "Comparison + bundle exports",
        "API access · 10k calls/mo",
        "Shareable result links",
      ],
    },
  ];

  const compareRows = [
    ["Reads / month", "30", "Unlimited", "Unlimited"],
    ["PDF pages", "10", "Unlimited", "Unlimited"],
    ["Languages", "7", "7", "7 + custom"],
    ["History", "Last 5", "90 days", "Forever"],
    ["Voices", "Browser", "12 premium", "12 + clone"],
    ["Desktop app", "—", "—", "All platforms"],
    ["Custom profiles", "—", "—", "Yes"],
    ["API access", "—", "—", "10k / mo"],
    ["Shareable links", "—", "View only", "Public + private"],
  ];

  const faqs = [
    {
      q: "Can I switch between plans?",
      a: "Yes. Upgrade any time and the new tier kicks in immediately. Downgrades take effect at the end of your current billing period.",
    },
    {
      q: "Do you have a student discount?",
      a: "50% off Plus and Pro with a valid .edu email — verified at checkout. Renews each year as long as your .edu is active.",
    },
    {
      q: "What about teams or schools?",
      a: "We do per-seat licensing for orgs of 5+. Email team@cognitext.com with how many seats and we'll send a quote within a business day.",
    },
    {
      q: "Can I use my own OpenAI key?",
      a: "On Pro, yes — bring your own model. We support OpenAI, Anthropic, and any OpenAI-compatible endpoint.",
    },
    {
      q: "Is my reading content private?",
      a: "Yes. Content is processed transiently and never stored on our servers unless you explicitly save a read to your history (Plus + Pro).",
    },
  ];

  const ctaLabel = (v: string) => {
    if (currentPlan === v) return "Current plan";
    if (v === "free") return isAuthed ? "Downgrade" : "Get started";
    return "Start " + tiers.find((t) => t.v === v)?.name;
  };

  const handleCta = (v: string) => {
    if (currentPlan === v) return;
    if (v === "free") {
      if (!isAuthed) onSignin();
      return;
    }
    onUpgrade(v);
  };

  return (
    <div style={prgS.shell}>
      <div style={prgS.head}>
        <span className="eyebrow">Pricing</span>
        <h1 className="font-display" style={prgS.h1}>
          Pay for the second hour.
          <br />
          Not the first.
        </h1>
        <p style={prgS.lede}>
          Free covers most days. Plus unlocks heavy reading and longer PDFs. Pro
          adds the desktop app and pro-grade exports.
        </p>
        <div style={prgS.toggleWrap}>
          <div style={prgS.toggle}>
            <button
              onClick={() => setYearly(false)}
              style={{
                ...prgS.toggleOpt,
                background: !yearly ? "var(--forest-900)" : "transparent",
                color: !yearly ? "var(--paper-50)" : "var(--ink-soft)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              style={{
                ...prgS.toggleOpt,
                background: yearly ? "var(--forest-900)" : "transparent",
                color: yearly ? "var(--paper-50)" : "var(--ink-soft)",
              }}
            >
              Yearly
            </button>
          </div>
          <span style={prgS.saveTag}>Save up to 25% on yearly</span>
        </div>
      </div>

      <div style={prgS.grid}>
        {tiers.map((t) => {
          const price = yearly ? t.yearly : t.monthly;
          const isCurrent = currentPlan === t.v;
          return (
            <article
              key={t.v}
              style={{
                ...prgS.card,
                borderColor: t.featured ? "var(--ember-400)" : "var(--hairline)",
                background: t.featured
                  ? "var(--paper-50)"
                  : "rgba(255,255,255,0.5)",
                boxShadow: t.featured
                  ? "0 24px 60px rgba(216,100,31,0.18), 0 1px 0 rgba(255,255,255,0.7) inset"
                  : "0 12px 30px rgba(16,37,29,0.06)",
              }}
            >
              {t.featured && <span style={prgS.popular}>Most popular</span>}
              {isCurrent && <span style={prgS.currentTag}>Your plan</span>}
              <div style={prgS.tierHead}>
                <h2 className="font-display" style={prgS.tierName}>
                  {t.name}
                </h2>
                <p style={prgS.tierTag}>{t.tag}</p>
              </div>
              <div style={prgS.priceRow}>
                <span style={prgS.dollar}>$</span>
                <span className="font-display" style={prgS.priceN}>
                  {price}
                </span>
                <div style={prgS.priceMeta}>
                  <span style={prgS.priceUnit}>/ month</span>
                  {yearly && t.monthly > 0 && (
                    <span style={prgS.priceStrike}>${t.monthly}</span>
                  )}
                </div>
              </div>
              {yearly && t.monthly > 0 && (
                <span style={prgS.priceNote}>
                  billed annually · ${t.yearly * 12}/yr
                </span>
              )}
              {t.v === "free" && <span style={prgS.priceNote}>forever · no card</span>}

              <button
                onClick={() => handleCta(t.v)}
                disabled={isCurrent}
                style={{
                  ...prgS.cta,
                  cursor: isCurrent ? "default" : "pointer",
                  opacity: isCurrent ? 0.55 : 1,
                  background: isCurrent
                    ? "var(--surface-wash)"
                    : t.featured
                    ? "linear-gradient(180deg, var(--ember-400), var(--ember-500))"
                    : t.v === "free"
                    ? "transparent"
                    : "var(--forest-900)",
                  color: isCurrent
                    ? "var(--ink-soft)"
                    : t.v === "free"
                    ? "var(--ink)"
                    : "var(--paper-50)",
                  border:
                    t.v === "free" && !isCurrent
                      ? "1px solid var(--hairline-strong)"
                      : "none",
                  boxShadow:
                    t.featured && !isCurrent
                      ? "0 14px 30px rgba(216,100,31,0.32)"
                      : "none",
                }}
              >
                <span>{ctaLabel(t.v)}</span>
                {!isCurrent && (
                  <Icon
                    name="arrow-right"
                    size={13}
                    color={t.v === "free" ? "var(--ink)" : "var(--paper-50)"}
                  />
                )}
                {isCurrent && <Icon name="check" size={12} stroke={2.4} />}
              </button>

              <ul style={prgS.feats}>
                {t.features.map((f, i) => (
                  <li key={i} style={prgS.feat}>
                    <span style={prgS.check}>
                      <Icon
                        name="check"
                        size={9}
                        color="var(--paper-50)"
                        stroke={2.6}
                      />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <section style={prgS.matrix}>
        <div style={prgS.matrixHead}>
          <span className="eyebrow">Compare plans</span>
          <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            Yearly pricing shown above
          </span>
        </div>
        <table style={prgS.table}>
          <thead>
            <tr>
              <th style={prgS.thFeature}>Feature</th>
              <th style={prgS.th}>Free</th>
              <th style={{ ...prgS.th, color: "var(--ember-500)" }}>Plus</th>
              <th style={prgS.th}>Pro</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--hairline)" }}>
                <td style={prgS.tdFeature}>{r[0]}</td>
                <td style={prgS.td}>{r[1]}</td>
                <td
                  style={{
                    ...prgS.td,
                    color: "var(--forest-900)",
                    fontWeight: 600,
                  }}
                >
                  {r[2]}
                </td>
                <td style={prgS.td}>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={prgS.faq}>
          <h3
            className="font-display"
            style={{
              margin: "0 0 18px",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--forest-900)",
              letterSpacing: "-0.02em",
            }}
          >
            Questions a real human might ask
          </h3>
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div
                key={f.q}
                style={{
                  ...prgS.faqItem,
                  borderColor: open ? "var(--hairline-strong)" : "var(--hairline)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={prgS.faqQ}
                >
                  <span>{f.q}</span>
                  <span
                    style={{
                      ...prgS.faqIconWrap,
                      transform: open ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    <Icon
                      name="plus"
                      size={13}
                      color="var(--ink-mute)"
                      stroke={2.2}
                    />
                  </span>
                </button>
                {open && <p style={prgS.faqA}>{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const prgS: Record<string, React.CSSProperties> = {
  shell: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: "20px 40px 60px",
    position: "relative",
    zIndex: 1,
  },
  head: { textAlign: "center", marginBottom: 44, paddingTop: 24 },
  h1: {
    margin: "10px 0 14px",
    fontSize: 48,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.03em",
    lineHeight: 1.05,
  },
  lede: {
    margin: "0 auto",
    fontSize: 16,
    lineHeight: 1.6,
    color: "var(--ink-soft)",
    maxWidth: 540,
    textWrap: "pretty",
  },
  toggleWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: 28,
  },
  toggle: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 11,
    background: "var(--hairline)",
    border: "1px solid var(--hairline-strong)",
  },
  toggleOpt: {
    padding: "8px 16px",
    borderRadius: 9,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  },
  saveTag: {
    fontSize: 11,
    color: "var(--ember-500)",
    background: "rgba(233,122,50,0.10)",
    border: "1px solid rgba(233,122,50,0.20)",
    padding: "4px 10px",
    borderRadius: 99,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    alignItems: "stretch",
  },
  card: {
    position: "relative",
    padding: "28px 28px 30px",
    borderRadius: 24,
    border: "1px solid",
    display: "flex",
    flexDirection: "column",
  },
  popular: {
    position: "absolute",
    top: -12,
    right: 20,
    padding: "4px 12px",
    borderRadius: 99,
    background: "var(--ember-400)",
    color: "var(--paper-50)",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    boxShadow: "0 6px 16px rgba(216,100,31,0.25)",
  },
  currentTag: {
    position: "absolute",
    top: -12,
    left: 20,
    padding: "4px 12px",
    borderRadius: 99,
    background: "var(--forest-700)",
    color: "var(--paper-50)",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  tierHead: { paddingBottom: 16, borderBottom: "1px solid var(--hairline)" },
  tierName: {
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.02em",
  },
  tierTag: { margin: "4px 0 0", fontSize: 13, color: "var(--ink-mute)" },
  priceRow: { display: "flex", alignItems: "flex-start", gap: 4, marginTop: 22 },
  dollar: { marginTop: 8, fontSize: 18, fontWeight: 600, color: "var(--forest-900)" },
  priceN: {
    fontSize: 54,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.03em",
    lineHeight: 0.95,
  },
  priceMeta: { display: "flex", flexDirection: "column", marginTop: 14 },
  priceUnit: { fontSize: 13, color: "var(--ink-mute)" },
  priceStrike: {
    fontSize: 12,
    color: "var(--ink-faint)",
    textDecoration: "line-through",
    fontFamily: "IBM Plex Mono, monospace",
  },
  priceNote: {
    display: "block",
    marginTop: 4,
    fontSize: 11,
    color: "var(--ink-mute)",
    letterSpacing: "0.02em",
  },
  cta: {
    marginTop: 22,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    borderRadius: 11,
    fontSize: 13.5,
    fontWeight: 700,
    fontFamily: "inherit",
    transition: "transform .15s ease",
  },
  feats: {
    listStyle: "none",
    padding: 0,
    margin: "22px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  feat: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    fontSize: 13.5,
    color: "var(--ink)",
    lineHeight: 1.4,
  },
  check: {
    width: 16,
    height: 16,
    borderRadius: 5,
    background: "var(--forest-700)",
    display: "inline-grid",
    placeItems: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  matrix: {
    marginTop: 60,
    padding: "28px 32px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 20,
  },
  matrixHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thFeature: {
    textAlign: "left",
    padding: "10px 0",
    fontSize: 11,
    color: "var(--ink-mute)",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontFamily: "Space Grotesk",
  },
  th: {
    textAlign: "center",
    padding: "10px 8px",
    fontSize: 11,
    color: "var(--ink-mute)",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontFamily: "Space Grotesk",
  },
  tdFeature: { padding: "12px 0", fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 },
  td: { textAlign: "center" as const, padding: "12px 8px", fontSize: 13, color: "var(--ink-soft)" },
  faq: { marginTop: 50 },
  faqItem: { padding: "16px 0", borderTop: "1px solid" },
  faqQ: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    fontSize: 14.5,
    fontWeight: 600,
    color: "var(--ink)",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "inherit",
    textAlign: "left",
  },
  faqIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "var(--surface-wash)",
    display: "inline-grid",
    placeItems: "center",
    transition: "transform .2s ease",
  },
  faqA: {
    margin: "12px 0 0",
    fontSize: 13.5,
    color: "var(--ink-soft)",
    lineHeight: 1.6,
    maxWidth: 680,
  },
};
