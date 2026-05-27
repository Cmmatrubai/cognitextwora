import React, { useState, useEffect, useMemo } from "react";
import { InputBlock, PdfFile } from "../components/InputBlock";
import { LoadingCard } from "../components/LoadingCard";
import { ResultCard, SAMPLES } from "../components/ResultCard";
import { TrialWallCard } from "../components/TrialWallCard";
import { UrlErrorCard } from "../components/UrlErrorCard";
import { RecentReadsStrip } from "../components/RecentReadsStrip";
import { SubmittedSummary } from "../components/SubmittedSummary";
import { Icon } from "../components/Icon";
import { simplifyText, translateText, getUsage } from "../lib/api";

export interface HomePageProps {
  theme: string;
  setTheme: (theme: string) => void;
  isAuthed: boolean;
  user: { name: string; email: string; initials: string } | null;
  currentPlan: string;
  maxFreeReads: number;
  alwaysFailUrl?: boolean;
  onSignin: () => void;
  onUpgrade: (plan: string) => void;
  onOpenShared?: (id: string) => void;
  onSaveProfile?: () => void;
}

export function HomePage({
  theme,
  setTheme,
  isAuthed,
  user,
  currentPlan,
  maxFreeReads,
  alwaysFailUrl = false,
  onSignin,
  onUpgrade,
  onOpenShared,
  onSaveProfile,
}: HomePageProps) {
  /* Input state */
  const [inputMode, setInputMode] = useState<"paste" | "pdf" | "url">("paste");
  const [op, setOp] = useState<"simplify" | "translate">("simplify");
  const [grade, setGrade] = useState(6);
  const [lang, setLang] = useState("es");
  const [profile, setProfile] = useState("calm");
  const [pasteText, setPasteText] = useState(SAMPLES.source);
  const [urlText, setUrlText] = useState("");
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [pdfStage, setPdfStage] = useState<"idle" | "parsing" | "picker" | "ready">("idle");

  /* Reading-surface controls */
  const [readingSize, setReadingSize] = useState<"s" | "m" | "l" | "xl">("m");
  const [readingSpacing, setReadingSpacing] = useState<"compact" | "normal" | "roomy">("normal");
  const [outputLength, setOutputLength] = useState<"short" | "standard" | "detailed">("standard");

  /* Flow state */
  const [stage, setStage] = useState<"idle" | "loading" | "result" | "wall" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"reading" | "thinking" | "polishing">("reading");
  const [reads, setReads] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [resultText, setResultText] = useState("");
  const [resultStats, setResultStats] = useState<{
    grade: string;
    words: number;
    sentences: number;
    time?: number;
  } | null>(null);

  /* PDF parsing → picker */
  useEffect(() => {
    if (inputMode !== "pdf" || !pdfFile) return;
    if (pdfStage === "idle") {
      setPdfStage("parsing");
      const t = setTimeout(() => setPdfStage("picker"), 1400);
      return () => clearTimeout(t);
    }
  }, [inputMode, pdfFile, pdfStage]);

  /* Effective limit: paid plans are effectively unlimited for the demo */
  const effectiveLimit = useMemo(
    () => (currentPlan === "free" ? maxFreeReads : 999),
    [currentPlan, maxFreeReads]
  );

  const canSubmit = useMemo(() => {
    if (stage === "loading") return false;
    if (inputMode === "paste") return pasteText.trim().length > 0;
    if (inputMode === "pdf") return !!pdfFile && (pdfStage === "picker" || pdfStage === "ready");
    if (inputMode === "url") return urlText.trim().length > 2;
    return false;
  }, [inputMode, pasteText, pdfFile, pdfStage, urlText, stage]);

  const wouldFail = inputMode === "url" && alwaysFailUrl;

  const submit = async () => {
    if (!canSubmit) return;

    if (isAuthed) {
      try {
        const usage = await getUsage();
        if (usage.dailyLimit && usage.dailyUsed >= usage.dailyLimit && currentPlan === "free") {
          setStage("wall");
          return;
        }
      } catch (err) {
        console.warn("Failed to check backend quotas:", err);
      }
    } else {
      if (reads >= effectiveLimit && currentPlan === "free") {
        setStage("wall");
        return;
      }
    }

    const title =
      inputMode === "paste"
        ? `Pasted text · ${pasteText.split(/\s+/).filter(Boolean).length} words`
        : inputMode === "pdf"
        ? `${pdfFile?.name} · ${pdfFile?.pages} pages`
        : `https://${urlText || "example.com"}`;
    setSubmittedTitle(title);

    setReads((r) => r + 1);
    setShowOriginal(false);
    setStage("loading");
    setProgress(0);
    setPhase("reading");

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p < 30) {
          setPhase("reading");
          return p + 2;
        } else if (p < 75) {
          setPhase("thinking");
          return p + 1.5;
        } else if (p < 95) {
          setPhase("polishing");
          return p + 0.5;
        }
        return p;
      });
    }, 150);

    const startTime = Date.now();

    try {
      let finalSimplified = "";
      let finalGrade = String(grade);
      
      let textToProcess = pasteText;
      if (inputMode === "url") {
        if (wouldFail) {
          throw new Error("Failed to extract URL content");
        }
        textToProcess = `Extracted article text from URL ${urlText}. Here is a simulated page block about text simplification technology.`;
      } else if (inputMode === "pdf") {
        textToProcess = pdfFile?.text || "Simulated PDF page text content.";
      }

      if (op === "simplify") {
        const res = await simplifyText({
          text: textToProcess,
          gradeLevel: grade,
          outputStyle: profile,
          outputLength: outputLength,
        });
        
        if (res.status === "limit_exceeded") {
          setStage("wall");
          clearInterval(progressInterval);
          return;
        }
        
        finalSimplified = res.simplifiedText || "";
        finalGrade = String(res.gradeLevel);
      } else {
        const res = await translateText({
          text: textToProcess,
          targetLanguage: lang,
        });
        
        if (res.status === "limit_exceeded") {
          setStage("wall");
          clearInterval(progressInterval);
          return;
        }
        
        finalSimplified = res.translatedText || "";
        finalGrade = "—";
      }

      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      const wordCount = finalSimplified.split(/\s+/).filter(Boolean).length;
      const sentenceCount = finalSimplified.split(/[.!?]+/).filter(Boolean).length;

      setResultText(finalSimplified);
      setResultStats({
        grade: finalGrade,
        words: wordCount,
        sentences: sentenceCount,
        time: elapsedSeconds || 1,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setStage("result");
        setAnimKey((k) => k + 1);
      }, 200);

    } catch (err: any) {
      console.error("API error during submit:", err);
      clearInterval(progressInterval);
      setStage("error");
    }
  };

  const reset = () => {
    setStage("idle");
    setShowOriginal(false);
    setPdfStage(pdfFile ? "ready" : "idle");
  };

  const startOver = () => {
    reset();
    setPasteText(SAMPLES.source);
    setUrlText("");
    setPdfFile(null);
    setPdfStage("idle");
  };

  useEffect(() => {
    if (stage === "result") setAnimKey((k) => k + 1);
  }, [grade, profile, lang, op, stage]);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const usageLabel = useMemo(() => {
    if (currentPlan !== "free") return "Unlimited reads on your plan";
    const left = Math.max(0, maxFreeReads - reads);
    if (left === 0) return `${maxFreeReads} of ${maxFreeReads} used · sign up for more`;
    return `${reads} of ${maxFreeReads} free reads used today`;
  }, [reads, maxFreeReads, currentPlan]);

  const showHero = stage === "idle";
  const showSummary = stage !== "idle";

  return (
    <main style={shellApp.main} id="top">
      {showHero && (
        <div style={shellApp.hero}>
          <span className="eyebrow" style={{ marginBottom: 18 }}>
            For anyone, anything, in plain English
          </span>
          <h1 className="font-display" style={shellApp.h1}>
            Make any text
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--ember-400)",
              }}
            >
              plain English.
            </em>
          </h1>
          <p style={shellApp.lede}>
            Paste anything. Upload a PDF. Drop a link.
            <br />
            Get clarity in seconds — at the reading level you choose.
          </p>
        </div>
      )}

      {showSummary && (
        <SubmittedSummary
          inputMode={inputMode}
          title={submittedTitle}
          onEdit={reset}
          onClear={startOver}
        />
      )}

      {showHero && (
        <div style={shellApp.inputWrap}>
          <InputBlock
            inputMode={inputMode}
            setInputMode={setInputMode}
            op={op}
            setOp={setOp}
            grade={grade}
            setGrade={setGrade}
            lang={lang}
            setLang={setLang}
            profile={profile}
            setProfile={setProfile}
            pasteText={pasteText}
            setPasteText={setPasteText}
            urlText={urlText}
            setUrlText={setUrlText}
            pdfFile={pdfFile}
            setPdfFile={setPdfFile}
            pdfStage={pdfStage}
            onSubmit={submit}
            canSubmit={canSubmit}
            disabledLabel={usageLabel}
          />
        </div>
      )}

      {stage === "loading" && (
        <LoadingCard op={op} progress={progress} phase={phase} />
      )}
      {stage === "result" && (
        <ResultCard
          op={op}
          setOp={setOp}
          grade={grade}
          setGrade={setGrade}
          lang={lang}
          setLang={setLang}
          profile={profile}
          setProfile={setProfile}
          showOriginal={showOriginal}
          setShowOriginal={setShowOriginal}
          sourceTitle={submittedTitle}
          animKey={animKey}
          onCopy={onCopy}
          copied={copied}
          readingSize={readingSize}
          setReadingSize={setReadingSize}
          readingSpacing={readingSpacing}
          setReadingSpacing={setReadingSpacing}
          outputLength={outputLength}
          setOutputLength={setOutputLength}
          plan={currentPlan}
          isAuthed={isAuthed}
          resultText={resultText}
          resultStats={resultStats}
          originalText={pasteText}
          onSaveProfile={
            isAuthed && currentPlan !== "free" ? onSaveProfile : undefined
          }
        />
      )}
      {stage === "wall" && (
        <TrialWallCard
          onSignin={onSignin}
          onUpgrade={() => onUpgrade("plus")}
          onMaybeLater={() => setStage("idle")}
        />
      )}
      {stage === "error" && (
        <UrlErrorCard
          url={urlText}
          onPaste={() => {
            setInputMode("paste");
            setStage("idle");
          }}
          onRetry={submit}
        />
      )}

      {showHero && (
        <>
          {/* Recent reads strip — only when authed and on home idle */}
          {isAuthed && (
            <RecentReadsStrip
              onOpen={(kind, id) => {
                if (kind === "shared" && onOpenShared && id) {
                  onOpenShared(id);
                } else if (kind === "history") {
                  // Direct to history section on account page
                  window.location.href = "/account?sec=usage";
                }
              }}
            />
          )}

          <div style={shellApp.trustRow}>
            <span style={shellApp.trustItem}>
              <Icon name="lock" size={12} color="var(--ink-mute)" />
              <span>Content stays on your device by default</span>
            </span>
            <span style={shellApp.trustDot} />
            <span style={shellApp.trustItem}>WCAG 2.2 AA</span>
            <span style={shellApp.trustDot} />
            <span style={shellApp.trustItem}>{usageLabel}</span>
          </div>

          {!isAuthed && (
            <>
              <HowItWorks />
              <Testimonials />
            </>
          )}
        </>
      )}

      {(stage === "result" || stage === "wall" || stage === "error") && (
        <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
          <button onClick={startOver} style={shellApp.newReadBtn}>
            <Icon name="plus" size={12} color="var(--paper-50)" stroke={2.2} />
            <span>New read</span>
          </button>
        </div>
      )}
    </main>
  );
}

function HowItWorks() {
  const items = [
    {
      n: "01",
      title: "Paste, drop, link",
      desc: "Three inputs — text, PDF, or URL.",
      icon: "type",
    },
    {
      n: "02",
      title: "Pick a level",
      desc: "Grade 1–12 or a built-in reading profile.",
      icon: "settings",
    },
    {
      n: "03",
      title: "Read or listen",
      desc: "Result in place. Web Speech reads it aloud.",
      icon: "volume",
    },
  ];
  return (
    <section style={howSApp.shell}>
      <div style={howSApp.head}>
        <span className="eyebrow">How it works</span>
        <h2 className="font-display" style={howSApp.h2}>
          Three keys, one habit.
        </h2>
      </div>
      <div style={howSApp.grid}>
        {items.map((i) => (
          <div key={i.n} style={howSApp.card}>
            <div style={howSApp.cardHead}>
              <span style={howSApp.cardN}>{i.n}</span>
              <span style={howSApp.cardIcon}>
                <Icon name={i.icon} size={14} color="var(--forest-700)" />
              </span>
            </div>
            <h3 style={howSApp.cardTitle}>{i.title}</h3>
            <p style={howSApp.cardDesc}>{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const howSApp: Record<string, React.CSSProperties> = {
  shell: { position: "relative", padding: "80px 0 40px" },
  head: { textAlign: "center", marginBottom: 36 },
  h2: {
    margin: "8px 0 0",
    fontSize: 30,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.02em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    padding: "22px 22px 24px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 18,
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  cardN: {
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "var(--ink-mute)",
  },
  cardIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "var(--surface-wash)",
    display: "grid",
    placeItems: "center",
  },
  cardTitle: {
    margin: "0 0 6px",
    fontFamily: "Space Grotesk",
    fontSize: 17,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.01em",
  },
  cardDesc: { margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.55 },
};

function Testimonials() {
  const quotes = [
    {
      q: "I finally read my own lease. I'd been hiding from it for two months.",
      who: "Maya · Brooklyn renter",
      tag: "ESL · paste text",
    },
    {
      q: "I keep it open in a tab next to PubMed. It's faster than asking my prof.",
      who: "Adam · grad student",
      tag: "PDF · highlight",
    },
    {
      q: "ADHD-friendly is real. Short sentences, no walls of text.",
      who: "Riya · designer",
      tag: "Profile · ADHD",
    },
  ];
  return (
    <section style={testSApp.shell}>
      {quotes.map((t, i) => (
        <figure key={i} style={testSApp.card}>
          <span style={testSApp.mark}>"</span>
          <p style={testSApp.q}>{t.q}</p>
          <figcaption style={testSApp.cap}>
            <span style={testSApp.who}>{t.who}</span>
            <span style={testSApp.tag}>{t.tag}</span>
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

const testSApp: Record<string, React.CSSProperties> = {
  shell: {
    padding: "40px 0 60px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    padding: "24px 24px 22px",
    background: "rgba(255,255,255,0.5)",
    border: "1px solid var(--hairline)",
    borderRadius: 16,
    position: "relative",
  },
  mark: {
    position: "absolute",
    top: -16,
    left: 18,
    fontFamily: "Space Grotesk",
    fontSize: 70,
    color: "var(--ember-300)",
    lineHeight: 1,
  },
  q: {
    margin: "16px 0 18px",
    fontSize: 15.5,
    lineHeight: 1.55,
    color: "var(--ink)",
    textWrap: "pretty" as const,
  },
  cap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTop: "1px solid var(--hairline)",
  },
  who: { fontSize: 12.5, fontWeight: 600, color: "var(--forest-900)" },
  tag: {
    fontSize: 10,
    color: "var(--ember-500)",
    background: "var(--ember-100)",
    padding: "2px 7px",
    borderRadius: 5,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
};

const shellApp: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "36px 20px 80px",
    position: "relative",
    zIndex: 1,
  },
  hero: { textAlign: "center", marginBottom: 36, paddingTop: 20 },
  h1: {
    margin: "10px 0 12px",
    fontSize: 54,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.035em",
    lineHeight: 1,
  },
  lede: {
    margin: "0 auto",
    fontSize: 16,
    lineHeight: 1.6,
    color: "var(--ink-soft)",
    maxWidth: 480,
    textWrap: "pretty" as const,
  },
  inputWrap: { marginBottom: 28 },
  trustRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 26,
    paddingTop: 22,
    borderTop: "1px solid var(--hairline)",
  },
  trustItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12,
    color: "var(--ink-mute)",
    fontWeight: 500,
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: "50%",
    background: "var(--ink-faint)",
  },
  newReadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 14px",
    borderRadius: 10,
    background: "var(--forest-900)",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 18px rgba(10,25,20,0.18)",
  },
};
