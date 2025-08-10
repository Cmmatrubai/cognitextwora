import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Cognitext. Accessibility-first reading,
          powered by AI.
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#cta"
            className="text-muted-foreground hover:text-foreground"
          >
            Get Access
          </a>
        </nav>
      </div>
    </footer>
  );
}
