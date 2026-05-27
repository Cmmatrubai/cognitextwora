import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "./Icon";
import { ExportMenu } from "./ExportMenu";
import { ReadingControls, READING_SIZES, READING_SPACINGS } from "./ReadingControls";

// Same SAMPLES data as prototype for self-contained robustness
export const SAMPLES = {
  source: `The phenomenological reduction, in its essence, is an epistemological procedure whereby the natural attitude—our pre-reflective acceptance of the world's existence—is bracketed or "suspended" so as to render perspicuous the constitutive activities of transcendental subjectivity. Husserl maintained that without this methodological abstention, philosophical inquiry remains entangled in unexamined ontological commitments.`,
  sourceMeta: { words: 64, grade: "16+", sentences: 3 },

  simplify: {
    plain: {
      text: "Husserl wanted philosophy to start fresh. Normally we just think the world is real. He said: pause that for a moment. Then look at how your mind builds the feeling of 'a world.' Without this pause, philosophy keeps repeating things we never really checked.",
      grade: "3",
      words: 52,
      sentences: 6,
    },
    calm: {
      text: "Husserl wanted philosophy to start fresh. Normally we just assume the world is real and get on with our day. He said: pause that assumption for a moment. When you do, you can finally see how your own mind builds the experience of \"a world.\" Without this pause, philosophy keeps repeating ideas we never actually checked.",
      grade: "6",
      words: 58,
      sentences: 5,
    },
    studied: {
      text: "Husserl proposed bracketing the natural attitude—our default, unreflective assumption that the world simply is. Suspending it lets us see how transcendental subjectivity constitutes our experience. Without this methodological step, he warned, philosophy keeps carrying ontological commitments it never examined.",
      grade: "12",
      words: 49,
      sentences: 3,
    },
  },

  translate: {
    es: {
      text: "Husserl quería que la filosofía empezara de cero. Normalmente damos por hecho que el mundo es real y seguimos adelante. Él decía: pausa ese supuesto por un momento. Cuando lo haces, puedes ver por fin cómo tu propia mente construye la experiencia de \"un mundo\".",
      words: 50,
      grade: "—",
      sentences: 3,
    },
    fr: {
      text: "Husserl voulait que la philosophie reparte de zéro. D'habitude, nous tenons pour acquis que le monde est réel et nous continuons. Il disait : mettons cette présupposition en suspens. Alors on voit enfin comment notre esprit construit l'expérience d'« un monde ».",
      words: 52,
      grade: "—",
      sentences: 3,
    },
    de: {
      text: "Husserl wollte, dass die Philosophie ganz neu anfaengt. Normalerweise gehen wir davon aus, dass die Welt wirklich ist. Er sagte: Halte diese Annahme kurz an. Dann siehst du endlich, wie der eigene Geist die Erfahrung von einer Welt aufbaut.",
      words: 46,
      grade: "—",
      sentences: 3,
    },
    pt: {
      text: "Husserl queria que a filosofia recomeçasse. Normalmente assumimos que o mundo é real e seguimos em frente. Ele disse: pause essa suposição por um momento. Aí você finalmente vê como sua própria mente constrói a experiencia de \"um mundo\".",
      words: 48,
      grade: "—",
      sentences: 3,
    },
    ja: {
      text: "フッサールは哲学をやり直したかった。私たちは普通、世界は実在すると思い込んで日々を過ごす。彼は言う——その思い込みを少し止めてみよう。そうすれば、自分の心が「ひとつの世界」という経験をどう作っているのかが、ようやく見えてくる。",
      words: 84,
      grade: "—",
      sentences: 3,
    },
  } as Record<string, { text: string; words: number; grade: string; sentences: number }>,
};

export const LANGS = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "ja", label: "Japanese" },
];

function gradeBucket(grade: number): "plain" | "calm" | "studied" {
  if (grade <= 4) return "plain";
  if (grade <= 9) return "calm";
  return "studied";
}

function useStream(text: string, run: boolean, restartKey: string) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!run) {
      setOut("");
      return;
    }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 8;
      if (i >= text.length) {
        setOut(text);
        clearInterval(id);
      } else {
        setOut(text.slice(0, i));
      }
    }, 24);
    return () => clearInterval(id);
  }, [text, run, restartKey]);
  return out;
}

export interface ResultCardProps {
  op: "simplify" | "translate";
  setOp: (op: "simplify" | "translate") => void;
  grade: number;
  setGrade: (grade: number) => void;
  lang: string;
  setLang: (lang: string) => void;
  profile: string;
  setProfile: (profile: string) => void;
  showOriginal: boolean;
  setShowOriginal: React.Dispatch<React.SetStateAction<boolean>>;
  sourceTitle: string;
  animKey: number;
  onCopy: () => void;
  copied: boolean;
  readingSize?: "s" | "m" | "l" | "xl";
  setReadingSize?: (size: "s" | "m" | "l" | "xl") => void;
  readingSpacing?: "compact" | "normal" | "roomy";
  setReadingSpacing?: (spacing: "compact" | "normal" | "roomy") => void;
  outputLength?: "short" | "standard" | "detailed";
  setOutputLength?: (length: "short" | "standard" | "detailed") => void;
  plan?: string;
  isAuthed?: boolean;
  onSaveProfile?: () => void;
  resultText?: string;
  resultStats?: {
    grade: string;
    words: number;
    sentences: number;
    time?: number;
  } | null;
  originalText?: string;
}

export function ResultCard({
  op,
  setOp,
  grade,
  setGrade,
  lang,
  setLang,
  profile,
  setProfile,
  showOriginal,
  setShowOriginal,
  sourceTitle,
  animKey,
  onCopy,
  copied,
  readingSize = "m",
  setReadingSize = () => {},
  readingSpacing = "normal",
  setReadingSpacing = () => {},
  outputLength = "standard",
  setOutputLength = () => {},
  plan = "free",
  isAuthed = false,
  onSaveProfile,
  resultText,
  resultStats,
  originalText,
}: ResultCardProps) {
  const bucket = gradeBucket(grade);
  
  const result = useMemo(() => {
    if (resultText) {
      return {
        text: resultText,
        grade: resultStats?.grade || String(grade),
        words: resultStats?.words || resultText.split(/\s+/).filter(Boolean).length,
        sentences: resultStats?.sentences || resultText.split(/[.!?]+/).filter(Boolean).length,
      };
    }

    const baseResult =
      op === "simplify"
        ? SAMPLES.simplify[bucket]
        : SAMPLES.translate[lang] || SAMPLES.translate.es;

    if (op !== "simplify" || outputLength === "standard") return baseResult;
    const sentences = baseResult.text.match(/[^.!?]+[.!?]+/g) || [
      baseResult.text,
    ];
    if (outputLength === "short") {
      const trimmed = sentences
        .slice(0, Math.max(2, Math.ceil(sentences.length * 0.5)))
        .join(" ")
        .trim();
      return {
        ...baseResult,
        text: trimmed,
        words: trimmed.split(/\s+/).length,
        sentences: Math.max(2, Math.ceil(sentences.length * 0.5)),
      };
    }
    if (outputLength === "detailed") {
      const extras = {
        plain:
          "  In other words, before judging the world as real, just notice how the experience of it shows up for you. That alone reveals a lot.",
        calm:
          "  In short, before deciding whether the world is real, just watch how the experience of it shows up. The act of noticing changes what you see.",
        studied:
          "  In short, the move is descriptive, not metaphysical: rather than assert what the world is, the inquiry attends to the structures by which it appears to consciousness.",
      };
      const extra = extras[bucket] || "";
      const fuller = baseResult.text + extra;
      return {
        ...baseResult,
        text: fuller,
        words: fuller.split(/\s+/).length,
        sentences: (baseResult.sentences || sentences.length) + 1,
      };
    }
    return baseResult;
  }, [resultText, resultStats, op, bucket, lang, outputLength, grade]);

  const streamed = useStream(
    result.text,
    true,
    `${op}-${bucket}-${lang}-${profile}-${outputLength}-${animKey}`
  );
  const done = streamed.length >= result.text.length;

  const [playing, setPlaying] = useState(false);
  const [playPos, setPlayPos] = useState(0);
  const totalSec = Math.round(result.text.split(" ").length / 200 * 60) || 15; // ~200wpm

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPlayPos((p) => {
        if (p >= totalSec) {
          setPlaying(false);
          return totalSec;
        }
        return p + 1;
      });
    }, 1000 / 6); // ~6x speed so the demo feels alive
    return () => clearInterval(id);
  }, [playing, totalSec]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const currentFontSize =
    READING_SIZES.find((s) => s.v === readingSize)?.fontSize || 18;
  const currentLineHeight =
    READING_SPACINGS.find((s) => s.v === readingSpacing)?.lineHeight || 1.7;

  return (
    <div style={rS.card}>
      <div style={rS.head}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <span style={rS.dot} />
          <span className="eyebrow" style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            {op === "simplify"
              ? `Simplified · grade ${result.grade} · ${
                  profile.charAt(0).toUpperCase() + profile.slice(1)
                }`
              : `Translated to ${
                  LANGS.find((l) => l.code === lang)?.label || lang
                }`}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setPlaying((p) => !p)} style={rS.headBtn}>
            <Icon name={playing ? "pause" : "volume"} size={12} />
            <span>{playing ? "Pause" : "Listen"}</span>
          </button>
          <button onClick={onCopy} style={rS.headBtn}>
            <Icon
              name={copied ? "check" : "copy"}
              size={12}
              color={copied ? "var(--forest-500)" : undefined}
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <ExportMenu plan={plan} onAction={() => {}} />
        </div>
      </div>

      <ReadingControls
        size={readingSize}
        setSize={setReadingSize}
        spacing={readingSpacing}
        setSpacing={setReadingSpacing}
        length={outputLength}
        setLength={setOutputLength}
        op={op}
      />

      <div style={rS.tabs}>
        <div style={rS.modeSwitch}>
          {[
            { v: "simplify", label: "Simplify", icon: "simplify" },
            { v: "translate", label: "Translate", icon: "translate" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setOp(o.v as "simplify" | "translate")}
              style={{
                ...rS.modeOpt,
                background: op === o.v ? "var(--forest-900)" : "transparent",
                color: op === o.v ? "var(--paper-50)" : "var(--forest-700)",
              }}
            >
              <Icon name={o.icon} size={12} />
              <span>{o.label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {op === "translate" && (
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={rS.langSelect}
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowOriginal((s) => !s)}
            style={rS.ghostChip}
          >
            {showOriginal ? "Hide original" : "Show original"}
          </button>
        </div>
      </div>

      <div style={rS.body}>
        {showOriginal && (
          <div style={rS.sourceBlock}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Original · {originalText ? originalText.split(/\s+/).filter(Boolean).length : SAMPLES.sourceMeta.words} words · {sourceTitle}
            </div>
            <p style={rS.sourceText}>{originalText || SAMPLES.source}</p>
          </div>
        )}
        <p
          style={{
            ...rS.bodyText,
            fontSize: currentFontSize,
            lineHeight: currentLineHeight,
          }}
        >
          {streamed}
          {!done && <span style={rS.caret} />}
        </p>

        {done && isAuthed && plan !== "free" && onSaveProfile && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button onClick={onSaveProfile} style={rS.saveProfileBtn}>
              <Icon name="plus" size={11} stroke={2.2} />
              <span>Save current settings as a profile</span>
            </button>
          </div>
        )}

        {done && (
          <div style={rS.statRow}>
            <Stat
              label="Reading grade"
              before={SAMPLES.sourceMeta.grade}
              after={String(result.grade)}
            />
            <Stat
              label="Sentences"
              before={String(SAMPLES.sourceMeta.sentences)}
              after={String(result.sentences || "—")}
            />
            <Stat
              label="Words"
              before={String(SAMPLES.sourceMeta.words)}
              after={String(result.words)}
            />
            <Stat label="Reading time" after={`${totalSec}s`} />
          </div>
        )}
      </div>

      {done && (
        <div style={rS.playerBar}>
          <button
            onClick={() => setPlaying((p) => !p)}
            style={{
              ...rS.playBtn,
              background: playing ? "var(--ember-500)" : "var(--ember-400)",
            }}
          >
            <Icon
              name={playing ? "pause" : "play"}
              size={11}
              color="var(--paper-50)"
            />
          </button>
          <div style={rS.wave}>
            {Array.from({ length: 48 }).map((_, i) => {
              const active = i < (playPos / totalSec) * 48;
              return (
                <span
                  key={i}
                  style={{
                    flex: 1,
                    height: 3 + Math.abs(Math.sin(i * 0.45)) * 12,
                    background: active
                      ? "var(--ember-300)"
                      : "rgba(255,255,255,0.22)",
                    borderRadius: 1,
                    transition: "background .12s",
                  }}
                />
              );
            })}
          </div>
          <span style={rS.playTime}>
            {fmt(playPos)} / {fmt(totalSec)}
          </span>
          <span style={rS.voicePill}>
            <Icon name="user" size={11} color="var(--ink-soft)" />
            <span>Aria · en-US</span>
          </span>
        </div>
      )}
    </div>
  );
}

interface StatProps {
  label: string;
  before?: string;
  after: string;
}

function Stat({ label, before, after }: StatProps) {
  return (
    <div>
      <div className="eyebrow" style={{ marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        {before && (
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-faint)",
              textDecoration: "line-through",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            {before}
          </span>
        )}
        {before && <Icon name="arrow-right" size={9} color="var(--ink-faint)" />}
        <span
          className="font-display"
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--forest-900)",
            letterSpacing: "-0.02em",
          }}
        >
          {after}
        </span>
      </div>
    </div>
  );
}

const rS: Record<string, React.CSSProperties> = {
  card: {
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow:
      "0 24px 80px rgba(16,37,29,0.10), 0 1px 0 rgba(255,255,255,0.7) inset",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 22px 14px",
    borderBottom: "1px solid var(--hairline)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "var(--forest-500)",
    boxShadow: "0 0 0 4px rgba(45,90,71,0.16)",
  },
  headBtn: {
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
  tabs: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 22px",
    background: "var(--surface-wash)",
    borderBottom: "1px solid var(--hairline)",
  },
  modeSwitch: {
    display: "inline-flex",
    padding: 3,
    borderRadius: 9,
    background: "var(--hairline)",
  },
  modeOpt: {
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
  langSelect: {
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
  ghostChip: {
    padding: "6px 11px",
    borderRadius: 8,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  body: { padding: "26px 30px 22px" },
  sourceBlock: {
    padding: "16px 18px",
    marginBottom: 22,
    background: "var(--surface-wash)",
    borderRadius: 12,
    border: "1px solid var(--hairline)",
  },
  sourceText: {
    margin: 0,
    fontSize: 13.5,
    lineHeight: 1.7,
    color: "var(--ink-soft)",
    fontStyle: "italic",
  },
  bodyText: {
    margin: 0,
    color: "var(--ink)",
    letterSpacing: "-0.005em",
    textWrap: "pretty",
  },
  caret: {
    display: "inline-block",
    width: 2,
    height: "1em",
    background: "var(--ember-400)",
    marginLeft: 2,
    verticalAlign: "text-bottom",
    animation: "ct-pulse-ring 1s steps(1) infinite",
  },
  statRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    marginTop: 26,
    paddingTop: 22,
    borderTop: "1px solid var(--hairline)",
  },
  saveProfileBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 11px",
    borderRadius: 8,
    background: "transparent",
    border: "1px dashed var(--hairline-strong)",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--forest-700)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  playerBar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 22px",
    background: "linear-gradient(180deg, var(--forest-800), var(--forest-900))",
    borderTop: "1px solid var(--hairline-strong)",
  },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    display: "inline-grid",
    placeItems: "center",
    cursor: "pointer",
  },
  wave: { flex: 1, display: "flex", alignItems: "center", gap: 2, height: 24 },
  playTime: {
    fontSize: 11,
    fontFamily: "IBM Plex Mono, monospace",
    color: "rgba(253, 248, 239, 0.65)",
    minWidth: 76,
  },
  voicePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 99,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 11,
    color: "rgba(253, 248, 239, 0.78)",
  },
};
