import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { getMyPreferences, updateMyPreferences, getUsage } from "../lib/api";

export interface AccountPageProps {
  user: { name: string; email: string; initials: string } | null;
  reads: Array<{
    src: string;
    mode: "simplify" | "translate" | string;
    words: number;
    when: string;
    kind: "type" | "capture" | "arrow-right" | string;
  }>;
  maxFreeReads: number;
  currentPlan: string;
  onUpgrade: (plan: string) => void;
  onSignOut: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export function AccountPage({
  user,
  reads,
  maxFreeReads,
  currentPlan,
  onUpgrade,
  onSignOut,
  theme,
  setTheme,
}: AccountPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const secParam = searchParams.get("sec");
  const [section, setSection] = useState(secParam || "usage");

  useEffect(() => {
    if (secParam) {
      setSection(secParam);
    }
  }, [secParam]);

  const handleSectionChange = (id: string) => {
    setSection(id);
    setSearchParams({ sec: id });
  };

  const sections = [
    { id: "account", label: "Account", icon: "user" },
    { id: "usage", label: "Usage", icon: "history" },
    { id: "billing", label: "Billing", icon: "bolt" },
    { id: "prefs", label: "Preferences", icon: "settings" },
    { id: "desktop", label: "Desktop app", icon: "capture" },
  ];

  return (
    <div style={accS.shell}>
      <aside style={accS.side}>
        <div style={accS.sideHead}>
          <div style={accS.avatar}>{user?.initials || "EM"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
              {user?.name || "You"}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-mute)", textOverflow: "ellipsis", overflow: "hidden" }}>
              {user?.email || "you@cognitext.com"}
            </div>
          </div>
          <span
            style={{
              ...accS.planBadge,
              background:
                currentPlan === "plus"
                  ? "var(--ember-100)"
                  : currentPlan === "pro"
                  ? "var(--forest-100)"
                  : "var(--hairline)",
              color:
                currentPlan === "plus"
                  ? "var(--ember-500)"
                  : currentPlan === "pro"
                  ? "var(--forest-700)"
                  : "var(--ink-soft)",
            }}
          >
            {currentPlan === "free"
              ? "Free"
              : currentPlan === "plus"
              ? "Plus"
              : "Pro"}
          </span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSectionChange(s.id)}
              style={{
                ...accS.navItem,
                background:
                  section === s.id ? "var(--surface-wash)" : "transparent",
                borderColor: section === s.id ? "var(--hairline)" : "transparent",
                color:
                  section === s.id ? "var(--forest-900)" : "var(--ink-soft)",
                fontWeight: section === s.id ? 600 : 500,
              }}
            >
              <Icon name={s.icon} size={13} color="currentColor" />
              <span>{s.label}</span>
              {section === s.id && (
                <Icon name="chevron" size={11} color="var(--ink-mute)" />
              )}
            </button>
          ))}
        </nav>
        {currentPlan === "free" && (
          <div style={accS.sideFoot}>
            <button onClick={() => onUpgrade("plus")} style={accS.upgradeBtn}>
              <Icon name="sparkle" size={12} color="var(--paper-50)" />
              <span>Upgrade to Plus</span>
            </button>
          </div>
        )}
      </aside>

      <section style={accS.content}>
        {section === "account" && (
          <AccountInfoSection user={user} onSignOut={onSignOut} />
        )}
        {section === "usage" && (
          <UsageSection
            reads={reads}
            maxFreeReads={maxFreeReads}
            currentPlan={currentPlan}
          />
        )}
        {section === "billing" && (
          <BillingSection currentPlan={currentPlan} onUpgrade={onUpgrade} />
        )}
        {section === "prefs" && (
          <PreferencesSection theme={theme} setTheme={setTheme} />
        )}
        {section === "desktop" && <DesktopSection />}
      </section>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <header style={{ marginBottom: 24 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h1 className="font-display" style={accS.h1}>
        {title}
      </h1>
      {sub && <p style={accS.sub}>{sub}</p>}
    </header>
  );
}

function UsageSection({
  reads,
  maxFreeReads,
  currentPlan,
}: {
  reads: AccountPageProps["reads"];
  maxFreeReads: number;
  currentPlan: string;
}) {
  const [usageSummary, setUsageSummary] = useState<any>(null);

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const usage = await getUsage();
        setUsageSummary(usage);
      } catch (err) {
        console.error("Failed to load usage summary:", err);
      }
    };
    loadUsage();
  }, []);

  const monthCap = usageSummary
    ? (usageSummary.dailyLimit || usageSummary.monthlyLimit || maxFreeReads)
    : (currentPlan === "free" ? maxFreeReads : Infinity);
  const monthUsed = usageSummary ? (usageSummary.dailyUsed || usageSummary.monthlyUsed) : (reads.length || 14);
  const pct = monthCap === Infinity ? 0 : monthUsed / monthCap;

  return (
    <>
      <SectionHead eyebrow="Account · Usage" title="This month at a glance" />

      <div style={accS.cardsRow}>
        <UsageCard
          label="Reads used"
          big={String(monthUsed)}
          small={monthCap === Infinity ? "of unlimited" : `of ${monthCap}`}
          pct={monthCap === Infinity ? null : pct}
        />
        <UsageCard
          label="PDF pages"
          big="42"
          small="this month"
          hint="Avg 9 / read"
        />
        <UsageCard label="Resets in" big="17" small="days" />
      </div>

      <div style={accS.usageCard}>
        <div style={accS.usageHeader}>
          <div>
            <h2 className="font-display" style={accS.h2}>
              Reads this month
            </h2>
            <p style={accS.ph}>
              Resets on the 1st of each month. Hover a bar for details.
            </p>
          </div>
          <div style={accS.legendRow}>
            <span style={accS.legend}>
              <span style={{ ...accS.legendDot, background: "var(--forest-500)" }} />{" "}
              Simplify
            </span>
            <span style={accS.legend}>
              <span style={{ ...accS.legendDot, background: "var(--ember-400)" }} />{" "}
              Translate
            </span>
          </div>
        </div>
        <Chart />
      </div>

      <div style={accS.activityCard}>
        <div style={accS.activityHead}>
          <h2 className="font-display" style={accS.h2}>
            Recent activity
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={accS.smallBtn}>
              <Icon name="search" size={11} />
              <span>Search</span>
            </button>
            <button style={accS.smallBtn}>
              <Icon name="arrow-right" size={11} />
              <span>Export</span>
            </button>
          </div>
        </div>
        <ActivityTable reads={reads} />
      </div>
    </>
  );
}

function Chart() {
  const [hover, setHover] = useState<number | null>(null);
  const days = Array.from({ length: 30 }, (_, i) => ({
    sim: i < 18 ? Math.max(0, Math.sin(i * 0.6) * 24 + 22) : 0,
    tra: i < 18 ? Math.max(0, Math.cos(i * 0.7) * 14 + 8) : 0,
  }));
  return (
    <div style={accS.chart}>
      {days.map((d, i) => {
        const today = i === 17;
        const isHover = hover === i;
        const total = Math.round(d.sim / 3 + d.tra / 3);
        return (
          <div
            key={i}
            style={accS.chartCol}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            {isHover && total > 0 && (
              <div style={accS.tooltip}>
                <span className="eyebrow" style={{ fontSize: 9 }}>
                  Day {i + 1}
                </span>
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 11.5,
                    color: "var(--forest-900)",
                    fontWeight: 700,
                  }}
                >
                  {total} reads
                </span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: 110,
                gap: 1,
                width: "100%",
                maxWidth: 18,
              }}
            >
              <span
                style={{
                  height: d.tra,
                  background: "var(--ember-400)",
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  opacity: isHover ? 1 : today ? 1 : 0.85,
                }}
              />
              <span
                style={{
                  height: d.sim,
                  background: "var(--forest-500)",
                  borderTopLeftRadius: d.tra ? 0 : 2,
                  borderTopRightRadius: d.tra ? 0 : 2,
                  opacity: isHover ? 1 : today ? 1 : 0.7,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 9,
                color: today
                  ? "var(--forest-900)"
                  : isHover
                  ? "var(--ink)"
                  : "var(--ink-faint)",
                fontWeight: today ? 700 : 500,
                fontFamily: "IBM Plex Mono, monospace",
                marginTop: 4,
              }}
            >
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityTable({ reads }: { reads: AccountPageProps["reads"] }) {
  // Use user reads or fallback to canned data if empty
  const defaultReads = [
    {
      src: "Pasted text · phenomenology",
      mode: "simplify",
      words: 64,
      when: "2m ago",
      kind: "type",
    },
    {
      src: "earnings.pdf · page 4",
      mode: "simplify",
      words: 142,
      when: "18m ago",
      kind: "capture",
    },
    {
      src: "nytimes.com/article/lease-history",
      mode: "translate",
      words: 88,
      when: "1h ago",
      kind: "arrow-right",
    },
    {
      src: "RFC 9110 — caching, §13",
      mode: "simplify",
      words: 210,
      when: "Yesterday",
      kind: "type",
    },
    {
      src: "Hegel preface, §1–4",
      mode: "translate",
      words: 56,
      when: "Yesterday",
      kind: "capture",
    },
  ];

  const data = reads.length > 0 ? reads : defaultReads;

  return (
    <table style={accS.activityTable}>
      <thead>
        <tr>
          <th style={accS.acTh}>Source</th>
          <th style={accS.acTh}>Mode</th>
          <th style={accS.acTh}>Words</th>
          <th style={accS.acTh}>When</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} style={{ borderTop: "1px solid var(--hairline)" }}>
            <td style={accS.acTd}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={accS.acIcon}>
                  <Icon name={r.kind} size={11} color="var(--ink-soft)" />
                </span>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {r.src}
                </span>
              </span>
            </td>
            <td style={accS.acTd}>
              <span
                style={{
                  ...accS.modeTag,
                  background:
                    r.mode === "translate"
                      ? "var(--ember-100)"
                      : "var(--forest-100)",
                  color:
                    r.mode === "translate"
                      ? "var(--ember-500)"
                      : "var(--forest-700)",
                }}
              >
                {r.mode}
              </span>
            </td>
            <td style={accS.acTd}>{r.words}</td>
            <td
              style={{
                ...accS.acTd,
                fontFamily: "IBM Plex Mono, monospace",
                color: "var(--ink-mute)",
                fontSize: 11.5,
              }}
            >
              {r.when}
            </td>
            <td style={accS.acTd}>
              <button style={accS.rowBtn}>
                <Icon name="arrow-right" size={11} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsageCard({
  label,
  big,
  small,
  pct,
  hint,
}: {
  label: string;
  big: string;
  small: string;
  pct?: number | null;
  hint?: string;
}) {
  return (
    <div style={accS.uCard}>
      <span className="eyebrow">{label}</span>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          marginTop: 8,
        }}
      >
        <span
          className="font-display"
          style={{
            fontSize: 38,
            fontWeight: 600,
            color: "var(--forest-900)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {big}
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-mute)" }}>{small}</span>
      </div>
      {pct != null && (
        <div
          style={{
            marginTop: 14,
            height: 4,
            background: "var(--hairline-strong)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background:
                "linear-gradient(90deg, var(--forest-500), var(--ember-300))",
              borderRadius: 99,
            }}
          />
        </div>
      )}
      {hint && (
        <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--ink-mute)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function AccountInfoSection({
  user,
  onSignOut,
}: {
  user: AccountPageProps["user"];
  onSignOut: () => void;
}) {
  const [name, setName] = useState(user?.name || "Elena Marsh");
  const [editing, setEditing] = useState(false);

  return (
    <>
      <SectionHead
        eyebrow="Account · Profile"
        title="Your account"
        sub="The basics. Changes save automatically."
      />
      <div style={accS.formCard}>
        <FormRow label="Name">
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={accS.input}
              onBlur={() => setEditing(false)}
              autoFocus
            />
          ) : (
            <button onClick={() => setEditing(true)} style={accS.fieldBtn}>
              <span>{name}</span>
              <Icon name="type" size={11} color="var(--ink-mute)" />
            </button>
          )}
        </FormRow>
        <FormRow label="Email">
          <span style={accS.fieldStatic}>{user?.email || "you@cognitext.com"}</span>
          <span style={accS.statusPill}>Verified</span>
        </FormRow>
        <FormRow label="Connected accounts">
          <div style={{ display: "flex", gap: 6 }}>
            <span style={accS.connBadge}>
              <Icon name="google" size={11} />
              Google
            </span>
          </div>
        </FormRow>
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Security</SectionLabel>
        <FormRow label="Sign-in sessions">
          <span style={accS.fieldStatic}>This browser · 2 hours ago</span>
        </FormRow>
        <button style={accS.dangerBtn}>
          <span>Sign out of all sessions</span>
        </button>
      </div>

      <div style={{ ...accS.formCard, borderColor: "rgba(216,100,31,0.20)" }}>
        <SectionLabel danger>Danger zone</SectionLabel>
        <FormRow label="Export your reads">
          <button style={accS.linkBtn}>Download as JSON ↓</button>
        </FormRow>
        <FormRow label="Delete account">
          <button onClick={onSignOut} style={accS.dangerBtn}>
            Delete permanently
          </button>
        </FormRow>
      </div>
    </>
  );
}

function BillingSection({
  currentPlan,
  onUpgrade,
}: {
  currentPlan: string;
  onUpgrade: (plan: string) => void;
}) {
  return (
    <>
      <SectionHead
        eyebrow="Account · Billing"
        title="Billing & invoices"
        sub="Manage your subscription, payment method, and download invoices."
      />

      <div style={accS.formCard}>
        <SectionLabel>Current plan</SectionLabel>
        <div style={accS.planRow}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                className="font-display"
                style={{ fontSize: 22, fontWeight: 600, color: "var(--forest-900)" }}
              >
                {currentPlan === "plus"
                  ? "Plus"
                  : currentPlan === "pro"
                  ? "Pro"
                  : "Free"}
              </span>
              <span
                style={{
                  ...accS.planBadge,
                  background: "var(--forest-100)",
                  color: "var(--forest-700)",
                }}
              >
                {currentPlan === "free" ? "FOREVER" : "ACTIVE"}
              </span>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--ink-soft)" }}>
              {currentPlan === "free"
                ? "30 reads / month · PDF up to 10 pages"
                : currentPlan === "plus"
                ? "Unlimited reads · billed yearly · next charge Jun 1, 2026"
                : "Pro features · billed yearly · next charge Jun 1, 2026"}
            </p>
          </div>
          {currentPlan === "free" ? (
            <button onClick={() => onUpgrade("plus")} style={accS.primaryBtn}>
              Upgrade to Plus
            </button>
          ) : (
            <button style={accS.fieldBtn}>Manage</button>
          )}
        </div>
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Payment method</SectionLabel>
        {currentPlan === "free" ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-mute)" }}>
            No card on file. Add one when you upgrade.
          </p>
        ) : (
          <div style={accS.cardRow}>
            <div style={accS.cardBrand}>VISA</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink)",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                •••• •••• •••• 4242
              </div>
              <div
                style={{ fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 }}
              >
                Expires 12 / 28
              </div>
            </div>
            <button style={accS.fieldBtn}>Update</button>
          </div>
        )}
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Invoices</SectionLabel>
        {currentPlan === "free" ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-mute)" }}>
            No invoices yet. Upgrade to see them appear here.
          </p>
        ) : (
          <table style={accS.activityTable}>
            <thead>
              <tr>
                <th style={accS.acTh}>Date</th>
                <th style={accS.acTh}>Description</th>
                <th style={accS.acTh}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Jun 1, 2026", "Plus · yearly", "$72.00"],
                ["Jun 1, 2025", "Plus · yearly", "$72.00"],
                ["Jun 1, 2024", "Plus · monthly", "$8.00"],
              ].map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--hairline)" }}>
                  <td
                    style={{
                      ...accS.acTd,
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11.5,
                      color: "var(--ink-mute)",
                    }}
                  >
                    {r[0]}
                  </td>
                  <td style={{ ...accS.acTd, fontWeight: 600, color: "var(--ink)" }}>
                    {r[1]}
                  </td>
                  <td
                    style={{
                      ...accS.acTd,
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    {r[2]}
                  </td>
                  <td style={accS.acTd}>
                    <button style={accS.linkBtn}>PDF ↓</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function PreferencesSection({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) {
  const [grade, setGrade] = useState(6);
  const [profile, setProfile] = useState("calm");
  const [voice, setVoice] = useState("aria");
  const [speed, setSpeed] = useState(1.0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const res = await getMyPreferences();
        if (res.preferences) {
          const p = res.preferences;
          setGrade(p.targetGradeLevel ?? 6);
          setProfile(p.outputStyle ?? "calm");
          setSpeed(p.ttsRate ?? 1.0);
          if (p.theme) setTheme(p.theme);
        }
        setLoaded(true);
      } catch (err) {
        console.error("Failed to load preferences:", err);
        setLoaded(true);
      }
    };
    loadPrefs();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(async () => {
      try {
        await updateMyPreferences({
          targetGradeLevel: grade,
          outputStyle: profile,
          ttsRate: speed,
        });
      } catch (err) {
        console.error("Failed to sync preferences:", err);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [grade, profile, speed, loaded]);

  return (
    <>
      <SectionHead
        eyebrow="Account · Preferences"
        title="How you like to read"
        sub="These defaults apply to every new read. You can still adjust them inline."
      />

      <div style={accS.formCard}>
        <SectionLabel>Reading defaults</SectionLabel>
        <FormRow label="Default grade level">
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
          >
            <input
              type="range"
              min={1}
              max={12}
              value={grade}
              onChange={(e) => setGrade(parseInt(e.target.value, 10))}
              style={accS.slider}
            />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--forest-900)",
                minWidth: 22,
              }}
            >
              {grade}
            </span>
            <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>
              · {grade <= 4 ? "Plain" : grade <= 9 ? "Calm" : "Studied"}
            </span>
          </div>
        </FormRow>
        <FormRow label="Default profile">
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["dyslexia", "adhd", "esl", "calm", "professional"].map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                style={{
                  padding: "5px 11px",
                  borderRadius: 99,
                  background: profile === p ? "var(--forest-900)" : "transparent",
                  color: profile === p ? "var(--paper-50)" : "var(--ink-soft)",
                  border: `1px solid ${
                    profile === p ? "var(--forest-900)" : "var(--hairline)"
                  }`,
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </FormRow>
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Voice & speech</SectionLabel>
        <FormRow label="Default voice">
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            style={accS.select}
          >
            <option value="aria">Aria · en-US (browser)</option>
            <option value="atlas">Atlas · en-US (premium)</option>
            <option value="iris">Iris · en-GB (premium)</option>
          </select>
        </FormRow>
        <FormRow label="Reading speed">
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}
          >
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={accS.slider}
            />
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--forest-900)",
                minWidth: 36,
              }}
            >
              {speed.toFixed(2)}×
            </span>
          </div>
        </FormRow>
        <FormRow label="Auto-play after result">
          <Toggle on={autoPlay} onChange={setAutoPlay} />
        </FormRow>
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Appearance & accessibility</SectionLabel>
        <FormRow label="Theme">
          <div style={accS.toggleSwitch}>
            {[
              { v: "light", label: "Light" },
              { v: "dark", label: "Dark" },
              { v: "system", label: "System" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setTheme(o.v === "system" ? "light" : o.v)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: theme === o.v ? "var(--forest-900)" : "transparent",
                  color: theme === o.v ? "var(--paper-50)" : "var(--ink-soft)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </FormRow>
        <FormRow label="Reduced motion">
          <Toggle on={reducedMotion} onChange={setReducedMotion} />
        </FormRow>
      </div>
    </>
  );
}

function DesktopSection() {
  const [downloadUrls, setDownloadUrls] = useState<Record<string, string>>({
    macOS: "https://github.com/TipTop-Tech/Cognitext-Releases/releases/download/v1.1.1/Cognitext-1.1.1-arm64.dmg",
    Windows: "https://github.com/TipTop-Tech/Cognitext-Releases/releases/download/v1.1.1/Cognitext-Setup-1.1.1.exe",
    Linux: "https://github.com/TipTop-Tech/Cognitext-Releases"
  });

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/TipTop-Tech/Cognitext-Releases/releases/latest");
        if (response.ok) {
          const data = await response.json();
          const assets = data.assets || [];
          const urls: Record<string, string> = {};
          
          const macAsset = assets.find((a: any) => a.name.endsWith(".dmg"));
          if (macAsset) {
            urls.macOS = macAsset.browser_download_url;
          }
          
          const winAsset = assets.find((a: any) => a.name.endsWith(".exe"));
          if (winAsset) {
            urls.Windows = winAsset.browser_download_url;
          }

          const linuxAsset = assets.find((a: any) => a.name.endsWith(".AppImage") || a.name.endsWith(".deb") || a.name.endsWith(".rpm"));
          if (linuxAsset) {
            urls.Linux = linuxAsset.browser_download_url;
          } else {
            urls.Linux = "https://github.com/TipTop-Tech/Cognitext-Releases";
          }

          setDownloadUrls((prev) => ({ ...prev, ...urls }));
        }
      } catch (err) {
        console.error("Failed to fetch latest release downloads from GitHub:", err);
      }
    };
    fetchLatestRelease();
  }, []);

  return (
    <>
      <SectionHead
        eyebrow="Account · Desktop app"
        title="Cognitext on your desktop"
        sub="Capture any text from any window. ⌘⇧C from anywhere — no copy-paste required."
      />

      <div style={accS.downloadGrid}>
        {[
          { os: "macOS", v: "Apple Silicon · Intel", ext: ".dmg", primary: true },
          { os: "Windows", v: "Windows 10 / 11", ext: ".exe" },
          { os: "Linux", v: "AppImage · .deb · .rpm", ext: ".AppImage" },
        ].map((d) => (
          <div
            key={d.os}
            style={{
              ...accS.dlCard,
              background: d.primary
                ? "var(--paper-50)"
                : "rgba(255,255,255,0.5)",
              borderColor: d.primary ? "var(--forest-700)" : "var(--hairline)",
            }}
          >
            <h3
              className="font-display"
              style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "var(--forest-900)" }}
            >
              {d.os}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-mute)" }}>
              {d.v}
            </p>
            <a
              href={downloadUrls[d.os]}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 18,
                padding: "10px 14px",
                borderRadius: 10,
                background: d.primary ? "var(--forest-900)" : "transparent",
                color: d.primary ? "var(--paper-50)" : "var(--forest-900)",
                border: d.primary ? "none" : "1px solid var(--hairline-strong)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none"
              }}
            >
              <Icon
                name="arrow-right"
                size={12}
                color={d.primary ? "var(--paper-50)" : "var(--forest-900)"}
              />
              <span>Download {d.ext}</span>
            </a>
          </div>
        ))}
      </div>

      <div style={accS.formCard}>
        <SectionLabel>Why the desktop app?</SectionLabel>
        <ul style={accS.dlBenefits}>
          {[
            [
              "capture",
              "Capture any region of any window — paywalls, native apps, image PDFs.",
            ],
            [
              "bolt",
              "Global shortcut: ⌘⇧C from anywhere, even with Cognitext closed.",
            ],
            [
              "history",
              "Sessions: keep separate reads organised by project or topic.",
            ],
            [
              "lock",
              "Local-first: OCR runs on your machine when possible.",
            ],
          ].map(([i, t]) => (
            <li key={i} style={accS.dlBenefit}>
              <span style={accS.dlBenIcon}>
                <Icon name={i} size={12} color="var(--forest-700)" />
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ——— small reusables ——— */
interface FormRowProps {
  label: string;
  children: React.ReactNode;
}
function FormRow({ label, children }: FormRowProps) {
  return (
    <div style={accS.formRow}>
      <span style={accS.formLabel}>{label}</span>
      <div style={accS.formField}>{children}</div>
    </div>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
  danger?: boolean;
}
function SectionLabel({ children, danger }: SectionLabelProps) {
  return (
    <div
      className="eyebrow"
      style={{ marginBottom: 14, color: danger ? "var(--ember-500)" : undefined }}
    >
      {children}
    </div>
  );
}

interface ToggleProps {
  on: boolean;
  onChange: (on: boolean) => void;
}
function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        position: "relative",
        width: 36,
        height: 20,
        borderRadius: 99,
        background: on ? "var(--forest-700)" : "var(--hairline-strong)",
        border: "none",
        cursor: "pointer",
        padding: 0,
        transition: "background .2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--paper-50)",
          transform: on ? "translateX(16px)" : "translateX(0)",
          transition: "transform .2s ease",
          boxShadow: "0 1px 3px rgba(10,25,20,0.18)",
        }}
      />
    </button>
  );
}

const accS: Record<string, React.CSSProperties> = {
  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "24px 40px 80px",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 32,
    alignItems: "start",
    position: "relative",
    zIndex: 1,
  },
  side: {
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 20,
    padding: 16,
    position: "sticky",
    top: 80,
  },
  sideHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 6px 14px",
    borderBottom: "1px solid var(--hairline)",
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background:
      "linear-gradient(135deg, var(--forest-500), var(--forest-700))",
    color: "var(--paper-50)",
    display: "grid",
    placeItems: "center",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    flexShrink: 0,
  },
  planBadge: {
    fontSize: 9.5,
    padding: "2px 8px",
    borderRadius: 5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    fontFamily: "IBM Plex Mono, monospace",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid",
    background: "transparent",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all .15s",
  },
  sideFoot: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid var(--hairline)",
  },
  upgradeBtn: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 10,
    background: "linear-gradient(180deg, var(--ember-400), var(--ember-500))",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 10px 20px rgba(216,100,31,0.30)",
  },
  content: { minWidth: 0 },
  h1: {
    margin: "8px 0 0",
    fontSize: 32,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.025em",
  },
  sub: { margin: "8px 0 0", fontSize: 14, color: "var(--ink-soft)", maxWidth: 560 },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
    marginBottom: 16,
  },
  uCard: {
    padding: "18px 20px 20px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 16,
  },
  usageCard: {
    padding: "22px 24px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 18,
    marginBottom: 16,
  },
  usageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  h2: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.01em",
  },
  ph: { margin: "4px 0 0", fontSize: 12.5, color: "var(--ink-mute)" },
  legendRow: { display: "flex", gap: 14 },
  legend: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-soft)" },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  chart: { display: "flex", alignItems: "flex-end", gap: 5, paddingTop: 18 },
  chartCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  tooltip: {
    position: "absolute" as const,
    bottom: 130,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "6px 10px",
    borderRadius: 8,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline-strong)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    boxShadow: "0 8px 18px rgba(16,37,29,0.12)",
    whiteSpace: "nowrap" as const,
    zIndex: 2,
  },
  activityCard: {
    padding: "22px 24px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 18,
  },
  activityHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  smallBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  activityTable: { width: "100%", borderCollapse: "collapse" },
  acTh: {
    textAlign: "left",
    padding: "8px 6px",
    fontSize: 10.5,
    color: "var(--ink-mute)",
    fontFamily: "Space Grotesk",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    fontWeight: 600,
  },
  acTd: { padding: "12px 6px", fontSize: 13, color: "var(--ink-soft)" },
  acIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    display: "inline-grid",
    placeItems: "center",
  },
  modeTag: {
    fontSize: 10,
    padding: "2px 7px",
    borderRadius: 5,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    fontFamily: "IBM Plex Mono, monospace",
  },
  rowBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    background: "transparent",
    border: "1px solid var(--hairline)",
    display: "inline-grid",
    placeItems: "center",
    cursor: "pointer",
    color: "var(--ink-soft)",
  },
  formCard: {
    padding: "22px 24px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 18,
    marginBottom: 14,
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    borderTop: "1px solid var(--hairline)",
  },
  formLabel: {
    fontSize: 12.5,
    color: "var(--ink-mute)",
    fontWeight: 600,
    minWidth: 180,
  },
  formField: { flex: 1, display: "flex", alignItems: "center", gap: 8 },
  fieldStatic: { fontSize: 13.5, color: "var(--ink)", fontWeight: 500 },
  fieldBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 9,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    borderRadius: 10,
    background: "linear-gradient(180deg, var(--ember-400), var(--ember-500))",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 10px 20px rgba(216,100,31,0.30)",
  },
  dangerBtn: {
    padding: "8px 12px",
    borderRadius: 9,
    background: "transparent",
    border: "1px solid rgba(216,100,31,0.30)",
    color: "var(--ember-500)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "var(--ember-500)",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 9,
    border: "1px solid var(--hairline-strong)",
    background: "var(--paper-50)",
    fontSize: 13.5,
    color: "var(--ink)",
    fontFamily: "inherit",
    outline: "none",
  },
  select: {
    padding: "8px 12px",
    borderRadius: 9,
    border: "1px solid var(--hairline)",
    background: "rgba(255, 255, 255, 0.6)",
    color: "var(--forest-700)",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  },
  slider: { flex: 1, height: 4, accentColor: "var(--forest-700)" },
  statusPill: {
    fontSize: 10,
    padding: "2px 8px",
    borderRadius: 5,
    background: "var(--forest-100)",
    color: "var(--forest-700)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    fontFamily: "IBM Plex Mono, monospace",
  },
  connBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 99,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink)",
  },
  toggleSwitch: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 9,
    background: "var(--hairline)",
  },
  planRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  cardRow: { display: "flex", alignItems: "center", gap: 14 },
  cardBrand: {
    width: 48,
    height: 30,
    borderRadius: 6,
    background: "var(--forest-900)",
    color: "var(--paper-50)",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    display: "grid",
    placeItems: "center",
    fontFamily: "Space Grotesk",
  },
  downloadGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 14,
    marginBottom: 16,
  },
  dlCard: { padding: "22px 22px 24px", border: "1.5px solid", borderRadius: 16 },
  dlBenefits: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  dlBenefit: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    fontSize: 13.5,
    color: "var(--ink)",
    lineHeight: 1.5,
  },
  dlBenIcon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
};
