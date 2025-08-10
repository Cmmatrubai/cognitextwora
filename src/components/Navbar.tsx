import { BrainCircuit, Github } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary animate-glow" />
          <span className="font-mono text-sm tracking-wider">Cognitext</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#impact"
            className="text-muted-foreground hover:text-foreground"
          >
            Impact
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <a href="#cta">
            <Button>Get Early Access</Button>
          </a>
        </div>
      </div>
    </header>
  );
}
