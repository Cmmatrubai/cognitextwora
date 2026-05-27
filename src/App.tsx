import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { TopBar } from "./components/TopBar";
import { FooterStrip } from "./components/FooterStrip";
import { SigninModal } from "./components/modals/SigninModal";
import { UpgradeModal } from "./components/modals/UpgradeModal";
import { OnboardingModal } from "./components/modals/OnboardingModal";
import { Icon } from "./components/Icon";
import { HomePage } from "./pages/HomePage";
import { PricingPage } from "./pages/PricingPage";
import { AccountPage } from "./pages/AccountPage";
import { SharedResultPage } from "./pages/SharedResultPage";
import { getMyPreferences, getRecentEvents, updateMyPreferences, updateMyOnboarding } from "./lib/api";
import "./App.css";

const DEMO_USER = { name: "Elena Marsh", email: "elena@studio.io", initials: "EM" };

interface ReadActivity {
  src: string;
  mode: "simplify" | "translate";
  words: number;
  when: string;
  kind: "type" | "capture" | "arrow-right";
}

function AppContent() {
  const navigate = useNavigate();

  /* —— Auth + plan —— */
  const [isAuthed, setIsAuthed] = useState(() => {
    return localStorage.getItem("cognitext-authed") === "true";
  });
  const [user, setUser] = useState<{ name: string; email: string; initials: string } | null>(() => {
    const saved = localStorage.getItem("cognitext-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentPlan, setCurrentPlan] = useState<string>(() => {
    return localStorage.getItem("cognitext-plan") || "free";
  });
  const [onboarded, setOnboarded] = useState(() => {
    return localStorage.getItem("cognitext-onboarded-web") === "true";
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [savedProfileToast, setSavedProfileToast] = useState(false);

  /* —— Theme + tweaks —— */
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("cognitext-theme") || "light";
  });
  const [maxFreeReads] = useState(3);
  const [alwaysFailUrl] = useState(false);

  /* —— Modals (cross-page) —— */
  const [signinOpen, setSigninOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string>("plus");

  const [reads, setReads] = useState<ReadActivity[]>([]);

  /* —— Scroll —— */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* —— Sync states to LocalStorage —— */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cognitext-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cognitext-authed", String(isAuthed));
    if (isAuthed && user) {
      localStorage.setItem("cognitext-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cognitext-user");
    }
  }, [isAuthed, user]);

  useEffect(() => {
    localStorage.setItem("cognitext-plan", currentPlan);
  }, [currentPlan]);

  useEffect(() => {
    localStorage.setItem("cognitext-onboarded-web", String(onboarded));
  }, [onboarded]);

  /* Boot bootstrapping */
  useEffect(() => {
    const token = localStorage.getItem("cognitext-token");
    if (token) {
      const loadUser = async () => {
        try {
          const profile = await getMyPreferences();
          setIsAuthed(true);
          const u = {
            name: profile.fullName || "User",
            email: profile.email,
            initials: profile.fullName ? profile.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "US"
          };
          setUser(u);
          setCurrentPlan((profile.plan || "FREE").toLowerCase());
          setOnboarded(profile.onboardingStep > 0);
          
          if (profile.preferences?.theme) {
            setTheme(profile.preferences.theme);
          }

          // Fetch usage events
          const events = await getRecentEvents(10);
          const mappedEvents = events.map((e: any) => ({
            src: e.actionType === "simplify_text" ? "AI Simplification" : e.actionType === "translate" ? "Translation" : "Image Transcription",
            mode: (e.actionType === "translate" ? "translate" : "simplify") as "simplify" | "translate",
            words: 64,
            when: new Date(e.createdAt).toLocaleDateString(),
            kind: (e.actionType === "translate" ? "arrow-right" : "type") as "type" | "capture" | "arrow-right"
          }));
          setReads(mappedEvents);
        } catch (err) {
          console.error("Failed to bootstrap user from token:", err);
        }
      };
      loadUser();
    }
  }, []);

  const handleToggleTheme = async () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (isAuthed) {
      try {
        await updateMyPreferences({ theme: nextTheme });
      } catch (err) {
        console.error("Failed to sync theme preference:", err);
      }
    }
  };

  const onSignin = () => setSigninOpen(true);
  const onSignedIn = async (token: string, userProfile: any) => {
    setSigninOpen(false);
    setIsAuthed(true);
    localStorage.setItem("cognitext-token", token);
    localStorage.setItem("cognitext-authed", "true");
    
    const u = {
      name: userProfile.fullName || "User",
      email: userProfile.email,
      initials: userProfile.fullName ? userProfile.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "US"
    };
    setUser(u);
    localStorage.setItem("cognitext-user", JSON.stringify(u));
    
    const plan = (userProfile.plan || "FREE").toLowerCase();
    setCurrentPlan(plan);
    localStorage.setItem("cognitext-plan", plan);
    
    const isOb = userProfile.onboardingStep > 0;
    setOnboarded(isOb);
    localStorage.setItem("cognitext-onboarded-web", String(isOb));
    
    if (!isOb) {
      setShowOnboarding(true);
    }
    
    try {
      const events = await getRecentEvents(10);
      const mappedEvents = events.map((e: any) => ({
        src: e.actionType === "simplify_text" ? "AI Simplification" : e.actionType === "translate" ? "Translation" : "Image Transcription",
        mode: (e.actionType === "translate" ? "translate" : "simplify") as "simplify" | "translate",
        words: 64,
        when: new Date(e.createdAt).toLocaleDateString(),
        kind: (e.actionType === "translate" ? "arrow-right" : "type") as "type" | "capture" | "arrow-right"
      }));
      setReads(mappedEvents);
    } catch (err) {
      console.error("Failed to load activity history on sign in:", err);
    }
  };

  const onSignOut = () => {
    setIsAuthed(false);
    setUser(null);
    setCurrentPlan("free");
    setOnboarded(false);
    setReads([]);
    localStorage.removeItem("cognitext-token");
    localStorage.removeItem("cognitext-authed");
    localStorage.removeItem("cognitext-user");
    localStorage.removeItem("cognitext-plan");
    localStorage.removeItem("cognitext-onboarded-web");
    navigate("/");
  };

  const onOnboardingDone = async () => {
    setShowOnboarding(false);
    setOnboarded(true);
    try {
      await updateMyOnboarding(1);
    } catch (err) {
      console.error("Failed to update onboarding step:", err);
    }
  };

  const onUpgrade = (plan = "plus") => {
    setPendingPlan(plan);
    setUpgradeOpen(true);
  };
  const onUpgradeConfirm = () => {
    setUpgradeOpen(false);
    if (!isAuthed) {
      setIsAuthed(true);
      setUser(DEMO_USER);
    }
    setCurrentPlan(pendingPlan || "plus");
  };

  const handleOpenShared = (id: string) => {
    navigate(`/r/${id}`);
  };

  const handleSaveProfile = () => {
    setSavedProfileToast(true);
    setTimeout(() => setSavedProfileToast(false), 2200);
  };

  return (
    <div
      data-theme={theme}
      id="scroll-root"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "var(--paper-100)",
        fontFamily: "Manrope, sans-serif",
        color: "var(--ink)",
      }}
    >
      {/* Background glow layers */}
      <div style={{ position: "fixed", top: -260, left: "10%", width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,154,0.30), transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: -200, right: "5%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,205,191,0.32), transparent 70%)", filter: "blur(14px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(rgba(24,57,45,0.04) 1px, transparent 1px)", backgroundSize: "3px 3px", opacity: 0.7, pointerEvents: "none" }} />

      <TopBar
        scrolled={scrolled}
        onSignin={onSignin}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        isAuthed={isAuthed}
        user={user}
        onSignOut={onSignOut}
        onUpgrade={onUpgrade}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              theme={theme}
              setTheme={setTheme}
              isAuthed={isAuthed}
              user={user}
              currentPlan={currentPlan}
              maxFreeReads={maxFreeReads}
              alwaysFailUrl={alwaysFailUrl}
              onSignin={onSignin}
              onUpgrade={onUpgrade}
              onOpenShared={handleOpenShared}
              onSaveProfile={handleSaveProfile}
            />
          }
        />
        <Route
          path="/pricing"
          element={
            <PricingPage
              isAuthed={isAuthed}
              currentPlan={currentPlan}
              onSignin={onSignin}
              onUpgrade={onUpgrade}
            />
          }
        />
        <Route
          path="/account"
          element={
            <AccountPage
              user={user || DEMO_USER}
              reads={reads}
              maxFreeReads={maxFreeReads}
              currentPlan={currentPlan}
              theme={theme}
              setTheme={setTheme}
              onUpgrade={onUpgrade}
              onSignOut={onSignOut}
            />
          }
        />
        <Route path="/r/:id" element={<SharedResultPage />} />
      </Routes>

      <FooterStrip onNavigate={(p) => navigate(p)} />

      {signinOpen && (
        <SigninModal onClose={() => setSigninOpen(false)} onSignedIn={onSignedIn} />
      )}
      {upgradeOpen && (
        <UpgradeModal
          onClose={() => setUpgradeOpen(false)}
          onConfirm={onUpgradeConfirm}
          pendingPlan={pendingPlan}
        />
      )}
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
          onDone={onOnboardingDone}
        />
      )}

      {savedProfileToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 99,
            background: "var(--forest-900)",
            color: "var(--paper-50)",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 20px 40px rgba(10,25,20,0.32)",
          }}
        >
          <Icon name="check" size={12} color="var(--paper-50)" stroke={2.4} />
          <span>Saved as a reading profile</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
