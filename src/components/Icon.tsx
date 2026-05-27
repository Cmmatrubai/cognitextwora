import React from "react";

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  color?: string;
  className?: string;
}

export function Icon({
  name,
  size = 16,
  stroke = 1.6,
  color = "currentColor",
  className = "",
}: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (name) {
    case "capture":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <circle cx="12" cy="12.5" r="3.5" />
          <path d="M8 6l1.5-2h5L16 6" />
        </svg>
      );
    case "simplify":
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h10M4 17h7" />
        </svg>
      );
    case "translate":
      return (
        <svg {...props}>
          <path d="M4 5h7M7.5 5v2c0 3-1.5 6-4 8" />
          <path d="M4 13c2 2 5 3 8 3" />
          <path d="M13 20l4-9 4 9M14.5 17h5" />
        </svg>
      );
    case "play":
      return (
        <svg {...props}>
          <path d="M7 5l12 7-12 7z" fill={color} />
        </svg>
      );
    case "pause":
      return (
        <svg {...props}>
          <path d="M8 5v14M16 5v14" />
        </svg>
      );
    case "history":
      return (
        <svg {...props}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
          <path d="M12 8v5l3 2" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
        </svg>
      );
    case "copy":
      return (
        <svg {...props}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...props}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...props}>
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
          <path d="M19 16l.7 1.8L21 18.5l-1.3.7L19 21l-.7-1.8L17 18.5l1.3-.7z" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case "chevron":
      return (
        <svg {...props}>
          <path d="M9 6l6 6-6 6" />
        </svg>
      );
    case "dot":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" fill={color} stroke="none" />
        </svg>
      );
    case "volume":
      return (
        <svg {...props}>
          <path d="M4 9v6h4l5 4V5L8 9z" />
          <path d="M16 8a5 5 0 0 1 0 8" />
        </svg>
      );
    case "check":
      return (
        <svg {...props}>
          <path d="M5 12l4 4 10-10" />
        </svg>
      );
    case "google":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6C4.6 19.7 8 22 12 22z"
          />
          <path
            fill="#FBBC05"
            d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3a10 10 0 0 0 0 9z"
          />
          <path
            fill="#EA4335"
            d="M12 6.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 3.4 14.7 2.5 12 2.5 8 2.5 4.6 4.8 3 7.5l3.4 2.6C7.2 7.6 9.4 6.4 12 6.4z"
          />
        </svg>
      );
    case "mic":
      return (
        <svg {...props}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      );
    case "eye":
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "type":
      return (
        <svg {...props}>
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      );
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...props}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
        </svg>
      );
    case "minus":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    default:
      return null;
  }
}
