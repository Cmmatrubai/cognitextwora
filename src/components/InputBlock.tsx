import React, { useState } from "react";
import { Icon } from "./Icon";

export interface PdfFile {
  name: string;
  pages: number;
  size: string;
  text?: string;
}

export interface InputBlockProps {
  inputMode: "paste" | "pdf" | "url";
  setInputMode: (mode: "paste" | "pdf" | "url") => void;
  op: "simplify" | "translate";
  setOp: (op: "simplify" | "translate") => void;
  grade: number;
  setGrade: (grade: number) => void;
  lang: string;
  setLang: (lang: string) => void;
  profile: string;
  setProfile: (profile: string) => void;
  pasteText: string;
  setPasteText: (text: string) => void;
  urlText: string;
  setUrlText: (text: string) => void;
  pdfFile: PdfFile | null;
  setPdfFile: (file: PdfFile | null) => void;
  pdfStage?: "idle" | "parsing" | "picker" | "ready";
  onSubmit: () => void;
  canSubmit: boolean;
  disabledLabel?: string;
}

export const LANGS = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
];

export const PROFILES = [
  { v: "dyslexia", label: "Dyslexia" },
  { v: "adhd", label: "ADHD" },
  { v: "esl", label: "ESL" },
  { v: "calm", label: "Calm" },
  { v: "professional", label: "Professional" },
];

export const PDF_PARAGRAPHS = [
  {
    id: "p1",
    page: 4,
    words: 78,
    text: "§B6 — The transcendental deduction asks how pure concepts of the understanding can a priori relate to objects.",
  },
  {
    id: "p2",
    page: 4,
    words: 142,
    text: "What appears to us is not the thing in itself; rather, it is the synthesis our understanding performs upon the manifold given in intuition. The mind does not receive an object passively — it constitutes it.",
  },
  {
    id: "p3",
    page: 5,
    words: 96,
    text: "Without categories, intuitions are blind. Without intuitions, categories are empty. Knowledge requires both — a synthesis that is the activity of judgment.",
  },
  {
    id: "p4",
    page: 5,
    words: 64,
    text: "This is the central claim of the Critique: experience is not given, it is made. Made by us, but according to forms that are not chosen.",
  },
];

export function InputBlock({
  inputMode,
  setInputMode,
  op,
  setOp,
  grade,
  setGrade,
  lang,
  setLang,
  profile,
  setProfile,
  pasteText,
  setPasteText,
  urlText,
  setUrlText,
  pdfFile,
  setPdfFile,
  pdfStage = "idle",
  onSubmit,
  canSubmit,
  disabledLabel,
}: InputBlockProps) {
  return (
    <div style={inS.card}>
      <div style={inS.tabBar}>
        <div style={inS.tabs}>
          {[
            { v: "paste", label: "Paste text", i: "type" },
            { v: "pdf", label: "Upload PDF", i: "capture" },
            { v: "url", label: "Paste URL", i: "arrow-right" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setInputMode(t.v as "paste" | "pdf" | "url")}
              style={{
                ...inS.tab,
                background:
                  inputMode === t.v ? "var(--paper-50)" : "transparent",
                color:
                  inputMode === t.v ? "var(--forest-900)" : "var(--ink-soft)",
                boxShadow:
                  inputMode === t.v
                    ? "0 2px 6px rgba(16,37,29,0.06)"
                    : "none",
                borderColor:
                  inputMode === t.v ? "var(--hairline)" : "transparent",
              }}
            >
              <Icon name={t.i} size={13} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        {inputMode === "paste" && (
          <span style={inS.charCount}>
            {pasteText.length.toLocaleString()} / 10,000
          </span>
        )}
        {inputMode === "pdf" && pdfFile && (
          <button onClick={() => setPdfFile(null)} style={inS.clearBtn}>
            <Icon name="x" size={11} /> Clear file
          </button>
        )}
        {inputMode === "url" && urlText && (
          <button onClick={() => setUrlText("")} style={inS.clearBtn}>
            <Icon name="x" size={11} /> Clear
          </button>
        )}
      </div>

      <div style={inS.body}>
        {inputMode === "paste" && (
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value.slice(0, 10000))}
            placeholder="Paste anything you don't understand — a contract, a paper, a doctor's note, a paragraph that just won't sit still."
            style={inS.textarea}
            rows={6}
          />
        )}
        {inputMode === "pdf" && (
          <PdfBody
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            pdfStage={pdfStage}
          />
        )}
        {inputMode === "url" && (
          <UrlBody urlText={urlText} setUrlText={setUrlText} />
        )}
      </div>

      <div style={inS.controls}>
        <div style={inS.opSwitch}>
          {[
            { v: "simplify", label: "Simplify", icon: "simplify" },
            { v: "translate", label: "Translate", icon: "translate" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setOp(o.v as "simplify" | "translate")}
              style={{
                ...inS.opOpt,
                background: op === o.v ? "var(--forest-900)" : "transparent",
                color: op === o.v ? "var(--paper-50)" : "var(--forest-700)",
              }}
            >
              <Icon name={o.icon} size={12} />
              <span>{o.label}</span>
            </button>
          ))}
        </div>

        {op === "simplify" ? (
          <GradeSlider grade={grade} setGrade={setGrade} />
        ) : (
          <div style={inS.langGroup}>
            <span style={inS.miniLabel}>Translate to</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={inS.select}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={inS.chips}>
          {PROFILES.map((p) => (
            <button
              key={p.v}
              onClick={() => setProfile(p.v)}
              style={{
                ...inS.chip,
                background:
                  profile === p.v ? "var(--forest-900)" : "transparent",
                color:
                  profile === p.v ? "var(--paper-50)" : "var(--ink-soft)",
                borderColor:
                  profile === p.v ? "var(--forest-900)" : "var(--hairline)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={inS.ctaRow}>
        <span style={inS.usagePill}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--forest-500)",
            }}
          />
          <span>{disabledLabel || "3 free · No signup needed"}</span>
        </span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{
            ...inS.cta,
            opacity: canSubmit ? 1 : 0.45,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {canSubmit && <span style={inS.ctaPulse} />}
          <Icon name="sparkle" size={14} color="var(--paper-50)" />
          <span>
            {op === "simplify"
              ? "Simplify"
              : `Translate to ${
                  LANGS.find((l) => l.code === lang)?.label || ""
                }`}
          </span>
          <span style={inS.ctaKbd}>⏎</span>
        </button>
      </div>
    </div>
  );
}

function GradeSlider({
  grade,
  setGrade,
}: {
  grade: number;
  setGrade: (grade: number) => void;
}) {
  const pct = ((grade - 1) / 11) * 100;
  const label = grade <= 4 ? "Plain" : grade <= 9 ? "Calm" : "Studied";
  return (
    <div style={inS.sliderGroup}>
      <span style={inS.miniLabel}>Grade</span>
      <input
        type="range"
        min={1}
        max={12}
        value={grade}
        onChange={(e) => setGrade(parseInt(e.target.value, 10))}
        style={inS.sliderInput}
      />
      <div style={inS.sliderTrack}>
        <span style={{ ...inS.sliderFill, width: `${pct}%` }} />
        <span style={{ ...inS.sliderThumb, left: `calc(${pct}% - 8px)` }} />
      </div>
      <span style={inS.sliderVal}>{grade}</span>
      <span style={inS.sliderLabel}>· {label}</span>
    </div>
  );
}

function PdfBody({
  pdfFile,
  setPdfFile,
  pdfStage,
}: {
  pdfFile: PdfFile | null;
  setPdfFile: (file: PdfFile | null) => void;
  pdfStage: "idle" | "parsing" | "picker" | "ready";
}) {
  const onPickSample = () =>
    setPdfFile({ 
      name: "kant-critique.pdf", 
      pages: 12, 
      size: "1.2 MB",
      text: "The Critique of Pure Reason by Immanuel Kant. We must begin with the question: whether there exists any knowledge that is independent of experience and even of all impressions of the senses. Such knowledge is called a priori, and distinguished from empirical knowledge, which has its sources a posteriori." 
    });

  if (!pdfFile) {
    return (
      <div style={inS.dropZone}>
        <div style={inS.dropIcon}>
          <Icon name="capture" size={26} color="var(--forest-700)" />
        </div>
        <p style={inS.dropTitle}>Drop a PDF here</p>
        <p style={inS.dropSub}>
          Free supports up to 10 pages.{" "}
          <button onClick={onPickSample} style={inS.linkBtn}>
            Try a sample →
          </button>
        </p>
      </div>
    );
  }

  if (pdfStage === "parsing") {
    return (
      <div style={inS.pdfState}>
        <div style={inS.pdfHead}>
          <div style={{ ...inS.pdfIcon, background: "var(--ember-100)" }}>
            <Icon name="capture" size={16} color="var(--ember-500)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={inS.pdfName}>{pdfFile.name}</div>
            <div style={inS.pdfMeta}>
              {pdfFile.pages} pages · {pdfFile.size} · Parsing…
            </div>
          </div>
          <span className="eyebrow" style={{ color: "var(--ember-500)" }}>
            Extracting
          </span>
        </div>
        <div style={inS.parseList}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 4px",
              }}
            >
              <span
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 10.5,
                  color: "var(--ink-mute)",
                  minWidth: 30,
                }}
              >
                p.{i + 1}
              </span>
              <span
                className="skeleton-line"
                style={{ height: 12, flex: 1, width: `${60 + i * 8}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pdfStage === "picker") {
    return <PdfParagraphPicker pdfFile={pdfFile} />;
  }

  return (
    <div style={inS.pdfState}>
      <div style={inS.pdfHead}>
        <div style={{ ...inS.pdfIcon, background: "var(--forest-100)" }}>
          <Icon name="capture" size={16} color="var(--forest-700)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={inS.pdfName}>{pdfFile.name}</div>
          <div style={inS.pdfMeta}>
            {pdfFile.pages} pages · {pdfFile.size} · Ready
          </div>
        </div>
        <button style={inS.pdfBadge}>
          <Icon name="check" size={11} color="var(--paper-50)" stroke={2.4} />
          <span>Whole doc</span>
        </button>
      </div>
    </div>
  );
}

function PdfParagraphPicker({ pdfFile }: { pdfFile: PdfFile }) {
  const [picks, setPicks] = useState<Set<string>>(new Set(["p1", "p3"]));
  const toggle = (id: string) =>
    setPicks((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div style={inS.pdfState}>
      <div style={inS.pdfHead}>
        <div style={{ ...inS.pdfIcon, background: "var(--forest-100)" }}>
          <Icon name="capture" size={16} color="var(--forest-700)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={inS.pdfName}>{pdfFile.name}</div>
          <div style={inS.pdfMeta}>
            Pick the paragraphs to simplify · {picks.size} selected
          </div>
        </div>
        <button style={inS.smallBtn}>
          <Icon name="check" size={11} />
          <span>Select all</span>
        </button>
      </div>
      <div
        style={{ ...inS.parseList, maxHeight: 180, overflowY: "auto" }}
        className="smooth-scroll"
      >
        {PDF_PARAGRAPHS.map((p) => {
          const on = picks.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: on ? "var(--surface-wash)" : "transparent",
                border: `1px solid ${
                  on ? "var(--hairline-strong)" : "var(--hairline)"
                }`,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: on ? "var(--forest-900)" : "transparent",
                  border: `1.5px solid ${
                    on ? "var(--forest-900)" : "var(--hairline-strong)"
                  }`,
                  display: "inline-grid",
                  placeItems: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {on && (
                  <Icon
                    name="check"
                    size={10}
                    color="var(--paper-50)"
                    stroke={2.6}
                  />
                )}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 10,
                      color: "var(--ink-mute)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Page {p.page} · {p.words} words
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "var(--ink)",
                  }}
                >
                  {p.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UrlBody({
  urlText,
  setUrlText,
}: {
  urlText: string;
  setUrlText: (text: string) => void;
}) {
  return (
    <div style={inS.urlWrap}>
      <span style={inS.urlIcon}>
        <Icon name="arrow-right" size={14} color="var(--ink-mute)" />
      </span>
      <span style={inS.urlPrefix}>https://</span>
      <input
        value={urlText}
        onChange={(e) => setUrlText(e.target.value)}
        placeholder="nytimes.com/2026/05/the-lease-you-signed"
        style={inS.urlInput}
      />
    </div>
  );
}

const inS: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow:
      "0 24px 80px rgba(16,37,29,0.10), 0 1px 0 rgba(255,255,255,0.7) inset",
  },
  tabBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    background: "var(--surface-wash)",
    borderBottom: "1px solid var(--hairline)",
  },
  tabs: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 11,
    background: "var(--hairline)",
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "8px 14px",
    borderRadius: 9,
    border: "1px solid transparent",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s ease",
  },
  charCount: {
    fontSize: 11,
    color: "var(--ink-mute)",
    fontFamily: "IBM Plex Mono, monospace",
    letterSpacing: "0.04em",
    paddingRight: 8,
  },
  clearBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 7,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  body: { minHeight: 180, padding: "20px 28px" },
  textarea: {
    width: "100%",
    minHeight: 140,
    border: "none",
    outline: "none",
    resize: "vertical",
    background: "transparent",
    fontFamily: "Manrope, sans-serif",
    fontSize: 17,
    lineHeight: 1.6,
    color: "var(--ink)",
    padding: 0,
    textWrap: "pretty",
  },
  dropZone: {
    minHeight: 180,
    border: "1.5px dashed var(--hairline-strong)",
    borderRadius: 18,
    background: "var(--surface-wash)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
    textAlign: "center",
  },
  dropIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    marginBottom: 12,
    boxShadow: "0 6px 18px rgba(16,37,29,0.06)",
  },
  dropTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.01em",
  },
  dropSub: { margin: "6px 0 0", fontSize: 13, color: "var(--ink-soft)" },
  linkBtn: {
    background: "none",
    border: "none",
    color: "var(--ember-500)",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  pdfState: { display: "flex", flexDirection: "column", gap: 12 },
  pdfHead: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    background: "var(--surface-wash)",
    border: "1px solid var(--hairline)",
    borderRadius: 12,
  },
  pdfIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
  },
  pdfName: { fontSize: 13.5, fontWeight: 600, color: "var(--ink)" },
  pdfMeta: { fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 },
  pdfBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 99,
    background: "var(--forest-700)",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "inherit",
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
  parseList: { display: "flex", flexDirection: "column", gap: 4 },
  urlWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 180,
    padding: "20px 0",
  },
  urlIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid var(--hairline)",
    display: "inline-grid",
    placeItems: "center",
    background: "rgba(255, 255, 255, 0.6)",
  },
  urlPrefix: {
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 16,
    color: "var(--ink-mute)",
  },
  urlInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 16,
    color: "var(--ink)",
    padding: 0,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 22px",
    background: "var(--surface-wash)",
    borderTop: "1px solid var(--hairline)",
    borderBottom: "1px solid var(--hairline)",
    flexWrap: "wrap",
  },
  opSwitch: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 9,
    background: "var(--hairline)",
  },
  opOpt: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: 7,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    transition: "all .15s",
  },
  miniLabel: {
    fontSize: 11,
    color: "var(--ink-mute)",
    fontFamily: "Space Grotesk",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 600,
  },
  sliderGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  sliderInput: {
    position: "absolute",
    inset: 0,
    width: 140,
    height: 18,
    opacity: 0,
    cursor: "pointer",
    left: 50,
  },
  sliderTrack: {
    position: "relative",
    width: 140,
    height: 4,
    background: "var(--hairline-strong)",
    borderRadius: 99,
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    background:
      "linear-gradient(90deg, var(--forest-500), var(--ember-300))",
    borderRadius: 99,
  },
  sliderThumb: {
    position: "absolute",
    top: "50%",
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "var(--paper-50)",
    border: "1.5px solid var(--forest-900)",
    transform: "translateY(-50%)",
    boxShadow: "0 2px 6px rgba(10,25,20,0.18)",
    pointerEvents: "none",
  },
  sliderVal: {
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 12,
    color: "var(--forest-900)",
    fontWeight: 600,
    minWidth: 18,
  },
  sliderLabel: { fontSize: 11.5, color: "var(--ink-mute)", fontWeight: 500 },
  langGroup: { display: "flex", alignItems: "center", gap: 10 },
  select: {
    appearance: "none",
    padding: "6px 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 7,
    background: "rgba(255, 255, 255, 0.6)",
    color: "var(--forest-700)",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    outline: "none",
  },
  chips: { marginLeft: "auto", display: "inline-flex", gap: 6, flexWrap: "wrap" },
  chip: {
    padding: "6px 11px",
    borderRadius: 99,
    border: "1px solid",
    fontSize: 11.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  },
  ctaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 22px",
    background: "var(--paper-50)",
  },
  usagePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12,
    color: "var(--ink-soft)",
    fontWeight: 500,
  },
  cta: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 20px",
    borderRadius: 12,
    background: "linear-gradient(180deg, var(--ember-400), var(--ember-500))",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
    letterSpacing: "-0.005em",
    boxShadow:
      "0 14px 30px rgba(216,100,31,0.32), 0 1px 0 rgba(255,255,255,0.2) inset",
  },
  ctaPulse: {
    position: "absolute",
    inset: -2,
    borderRadius: 14,
    border: "2px solid var(--ember-300)",
    animation: "ct-pulse-ring 2s ease-out infinite",
    pointerEvents: "none",
  },
  ctaKbd: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 22,
    height: 22,
    padding: "0 6px",
    fontSize: 11,
    fontFamily: "IBM Plex Mono, monospace",
    background: "rgba(255, 255, 255, 0.18)",
    borderRadius: 5,
    border: "1px solid rgba(255, 255, 255, 0.3)",
  },
};
