import React from "react";
import { Icon } from "../Icon";
import { devAuth, googleAuth, setLocalApiMode, getLocalApiMode, setMockApiMode, getMockApiMode } from "../../lib/api";

export interface SigninModalProps {
  onClose: () => void;
  onSignedIn: (token: string, user: any) => void;
}

export function SigninModal({ onClose, onSignedIn }: SigninModalProps) {
  const [email, setEmail] = React.useState("");
  const [showEmailInput, setShowEmailInput] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const googleBtnRef = React.useRef<HTMLDivElement>(null);
  const [googleLoaded, setGoogleLoaded] = React.useState(false);

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const [localMode, setLocalMode] = React.useState(getLocalApiMode());
  const [mockMode, setMockMode] = React.useState(getMockApiMode());

  const handleToggleLocal = (val: boolean) => {
    setLocalMode(val);
    setLocalApiMode(val);
    if (val) {
      setMockMode(false);
      setMockApiMode(false);
    }
  };

  const handleToggleMock = (val: boolean) => {
    setMockMode(val);
    setMockApiMode(val);
    if (val) {
      setLocalMode(false);
      setLocalApiMode(false);
    }
  };

  React.useEffect(() => {
    const initializeGoogleSignIn = () => {
      const g = (window as any).google;
      if (g) {
        setGoogleLoaded(true);
        g.accounts.id.initialize({
          client_id: "466898773208-qb85mj88lpqlssrks2hhstr733k00ug0.apps.googleusercontent.com",
          callback: async (response: any) => {
            setLoading(true);
            setError("");
            try {
              const res = await googleAuth(response.credential);
              onSignedIn(res.token, res.user);
            } catch (err: any) {
              setError(err.message || "Failed to sign in with Google.");
            } finally {
              setLoading(false);
            }
          },
        });
      }
    };

    const scriptId = "google-gsi-client-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!(window as any).google) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      } else {
        script.addEventListener("load", initializeGoogleSignIn);
      }
    } else {
      initializeGoogleSignIn();
    }

    return () => {
      if (script) {
        script.removeEventListener("load", initializeGoogleSignIn);
      }
    };
  }, [onSignedIn]);

  React.useEffect(() => {
    const g = (window as any).google;
    if (googleLoaded && g && googleBtnRef.current) {
      g.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 348,
        text: "continue_with",
        shape: "rectangular",
      });
    }
  }, [googleLoaded]);

  const handleDevAuth = async (targetEmail: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await devAuth(targetEmail);
      onSignedIn(res.token, res.user);
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    handleDevAuth(email.trim());
  };

  return (
    <div style={modalS.scrim} onClick={onClose}>
      <div style={modalS.smallCard} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={modalS.closeBtn}>
          <Icon name="x" size={13} />
        </button>
        <div style={modalS.markWrap}>
          <div style={modalS.bigMark}>
            <span style={modalS.bigMarkDot} />
          </div>
        </div>
        <h2 className="font-display" style={modalS.title}>
          Sign in to Cognitext
        </h2>
        <p style={modalS.sub}>
          Save your reads, sync across devices, and unlock more reads each month.
        </p>

        <div style={{ minHeight: 46, width: "100%", display: "flex", justifyContent: "center", marginBottom: 6 }}>
          {googleLoaded ? (
            <div ref={googleBtnRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
          ) : (
            <button disabled style={modalS.googleBtn}>
              <Icon name="google" size={16} />
              <span>Loading Google Sign-in...</span>
            </button>
          )}
        </div>

        <div style={modalS.divider}>
          <span>or</span>
        </div>

        {showEmailInput ? (
          <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: "100%",
                height: 44,
                padding: "0 14px",
                borderRadius: 10,
                border: "1px solid var(--hairline-strong)",
                background: "rgba(255,255,255,0.8)",
                fontSize: 13.5,
                color: "var(--ink)",
                fontFamily: "inherit",
                outline: "none"
              }}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading} style={modalS.submitBtn}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button type="button" onClick={() => setShowEmailInput(false)} style={modalS.cancelLink}>
              Cancel
            </button>
          </form>
        ) : (
          <button onClick={() => setShowEmailInput(true)} style={modalS.emailBtn}>
            <Icon name="user" size={13} color="var(--ink-soft)" />
            <span>Continue with email</span>
          </button>
        )}

        {error && (
          <div style={{ color: "var(--ember-500)", fontSize: 12, marginTop: 12, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <p style={modalS.legal}>
          By continuing you agree to our{" "}
          <a href="#" style={modalS.legalLink}>
            Terms
          </a>{" "}
          and{" "}
          <a href="#" style={modalS.legalLink}>
            Privacy
          </a>
          . Reading content stays on your device by default.
        </p>

        {isLocalhost && (
          <div style={modalS.devPanel}>
            <div style={modalS.devTitle}>Developer Controls (Localhost)</div>
            <div style={modalS.devRow}>
              <label style={modalS.devLabel}>
                <input
                  type="checkbox"
                  checked={localMode}
                  onChange={(e) => handleToggleLocal(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                Local Backend API
              </label>
              <label style={modalS.devLabel}>
                <input
                  type="checkbox"
                  checked={mockMode}
                  onChange={(e) => handleToggleMock(e.target.checked)}
                  style={{ marginRight: 6 }}
                />
                Offline Mock Mode
              </label>
            </div>
            {(localMode || mockMode) && (
              <button
                type="button"
                onClick={() => handleDevAuth(email.trim() || "dev-bypass@cognitext.io")}
                disabled={loading}
                style={modalS.bypassBtn}
              >
                {loading ? "Bypassing..." : "Dev Bypass Login"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
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
  smallCard: {
    position: "relative",
    width: 420,
    padding: "44px 36px 32px",
    background: "var(--paper-50)",
    border: "1px solid var(--hairline)",
    borderRadius: 22,
    boxShadow:
      "0 30px 80px rgba(10,25,20,0.32), 0 1px 0 rgba(255,255,255,0.7) inset",
    textAlign: "center",
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
  markWrap: { display: "flex", justifyContent: "center", marginBottom: 18 },
  bigMark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: "linear-gradient(135deg, var(--forest-700), var(--forest-900))",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 32px rgba(10,25,20,0.32)",
  },
  bigMarkDot: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--ember-300), var(--ember-500))",
    boxShadow: "0 0 0 3px rgba(242,155,93,0.18)",
  },
  title: {
    margin: "0 0 8px",
    fontSize: 24,
    fontWeight: 600,
    color: "var(--forest-900)",
    letterSpacing: "-0.02em",
  },
  sub: {
    margin: "0 0 22px",
    fontSize: 13.5,
    color: "var(--ink-soft)",
    lineHeight: 1.55,
  },
  googleBtn: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 46,
    padding: "0 18px",
    borderRadius: 11,
    background: "#fff",
    border: "1px solid var(--hairline-strong)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ink)",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow:
      "0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 12px rgba(16,37,29,0.06)",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    margin: "14px 0",
    color: "var(--ink-faint)",
    fontSize: 11,
    letterSpacing: "0.06em",
  },
  emailBtn: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    padding: "0 18px",
    borderRadius: 11,
    background: "transparent",
    border: "1px solid var(--hairline)",
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  submitBtn: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    background: "var(--forest-900)",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 6px 14px rgba(10,25,20,0.18)"
  },
  cancelLink: {
    background: "transparent",
    border: "none",
    color: "var(--ink-mute)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
    marginTop: 4
  },
  legal: { marginTop: 18, fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.55 },
  legalLink: {
    color: "var(--forest-700)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },
  devPanel: {
    marginTop: 20,
    padding: "12px 14px",
    background: "var(--paper-100)",
    border: "1px dashed var(--hairline-strong)",
    borderRadius: 12,
    textAlign: "left",
  },
  devTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--forest-800)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 8,
  },
  devRow: {
    display: "flex",
    gap: 12,
    marginBottom: 10,
  },
  devLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    cursor: "pointer",
  },
  bypassBtn: {
    width: "100%",
    height: 32,
    borderRadius: 8,
    background: "var(--forest-800)",
    color: "#fff",
    border: "none",
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 2px 6px rgba(10,25,20,0.12)",
  },
};
