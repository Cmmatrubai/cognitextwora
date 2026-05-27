import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { WebMark } from "./WebMark";
import { Icon } from "./Icon";

interface TopBarProps {
  scrolled: boolean;
  onSignin: () => void;
  onToggleTheme: () => void;
  theme: string;
  isAuthed: boolean;
  user: { name: string; email: string; initials: string } | null;
  onSignOut: () => void;
  onUpgrade: (plan?: string) => void;
}

export function TopBar({
  scrolled,
  onSignin,
  onToggleTheme,
  theme,
  isAuthed,
  user,
  onSignOut,
  onUpgrade,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPage = location.pathname;

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const navLink = (label: string, path: string) => {
    const active = currentPage === path;
    return (
      <Link
        to={path}
        style={{
          ...navS.link,
          color: active ? "var(--forest-900)" : "var(--ink-soft)",
          fontWeight: active ? 700 : 500,
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        background: scrolled ? "rgba(253,248,239,0.78)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--hairline)"
          : "1px solid transparent",
        transition: "all .25s ease",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textDecoration: "none",
        }}
      >
        <WebMark />
        <span
          className="font-display"
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--forest-900)",
            letterSpacing: "-0.02em",
          }}
        >
          Cognitext
        </span>
      </Link>
      <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {navLink("Pricing", "/pricing")}
        <Link to="/account?sec=desktop" style={navS.link}>
          Desktop app
        </Link>
        <span
          style={{
            width: 1,
            height: 16,
            background: "var(--hairline-strong)",
            margin: "0 8px",
          }}
        />
        <button
          onClick={onToggleTheme}
          style={navS.themeBtn}
          title="Toggle theme"
        >
          <Icon name="sparkle" size={14} />
        </button>

        {!isAuthed ? (
          <>
            <button
              onClick={onSignin}
              style={{ ...navS.link, background: "none", border: "none" }}
            >
              Sign in
            </button>
            <Link to="/account?sec=desktop" style={{ textDecoration: "none" }}>
              <button style={navS.primary}>Get the app</button>
            </Link>
          </>
        ) : (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen((o) => !o)} style={navS.avatarBtn}>
              <span style={navS.avatar}>{user?.initials || "EM"}</span>
              <Icon name="chevron" size={11} color="var(--ink-mute)" />
            </button>
            {menuOpen && (
              <div style={navS.menu}>
                <div style={navS.menuHead}>
                  <span style={navS.avatar}>{user?.initials || "EM"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      {user?.name || "You"}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                      {user?.email || ""}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 6 }}>
                  <Link
                    to="/account"
                    style={{ textDecoration: "none" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <button style={navS.menuItem}>
                      <Icon name="user" size={12} color="var(--ink-soft)" />
                      <span>Account</span>
                    </button>
                  </Link>
                  <Link
                    to="/account?sec=billing"
                    style={{ textDecoration: "none" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <button style={navS.menuItem}>
                      <Icon name="bolt" size={12} color="var(--ink-soft)" />
                      <span>Billing & plan</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      onUpgrade("plus");
                      setMenuOpen(false);
                    }}
                    style={{
                      ...navS.menuItem,
                      color: "var(--ember-500)",
                      fontWeight: 600,
                    }}
                  >
                    <Icon name="sparkle" size={12} color="var(--ember-500)" />
                    <span>Upgrade to Plus</span>
                  </button>
                </div>
                <div style={{ height: 1, background: "var(--hairline)" }} />
                <div style={{ padding: 6 }}>
                  <button
                    onClick={() => {
                      onSignOut();
                      setMenuOpen(false);
                    }}
                    style={{ ...navS.menuItem, color: "var(--ink-mute)" }}
                  >
                    <Icon name="lock" size={12} color="var(--ink-mute)" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

const navS = {
  link: {
    padding: "8px 12px",
    fontSize: "13.5px",
    fontWeight: 500,
    color: "var(--ink-soft)",
    textDecoration: "none",
    borderRadius: 8,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
  },
  themeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "transparent",
    border: "1px solid var(--hairline)",
    display: "inline-grid",
    placeItems: "center",
    color: "var(--ink-soft)",
    cursor: "pointer",
  },
  primary: {
    marginLeft: 6,
    padding: "8px 14px",
    borderRadius: 9,
    background: "var(--forest-900)",
    color: "var(--paper-50)",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 12px rgba(10,25,20,0.18)",
  },
  avatarBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "4px 10px 4px 4px",
    marginLeft: 6,
    borderRadius: 99,
    background: "transparent",
    border: "1px solid var(--hairline)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--forest-500), var(--forest-700))",
    color: "var(--paper-50)",
    display: "inline-grid",
    placeItems: "center",
    fontSize: "10.5px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    flexShrink: 0,
  },
  menu: {
    position: "absolute" as const,
    top: "calc(100% + 8px)",
    right: 0,
    minWidth: 240,
    background: "var(--paper-50)",
    border: "1px solid var(--hairline-strong)",
    borderRadius: 12,
    boxShadow: "0 20px 50px rgba(10,25,20,0.22)",
    overflow: "hidden",
    zIndex: 50,
  },
  menuHead: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderBottom: "1px solid var(--hairline)",
  },
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 8px",
    borderRadius: 7,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "12.5px",
    color: "var(--ink-soft)",
    fontWeight: 500,
    textAlign: "left" as const,
  },
};
