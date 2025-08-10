import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,_rgba(59,130,246,0.25),_transparent_40%),_radial-gradient(circle_at_80%_10%,_rgba(168,85,247,0.2),_transparent_35%)]" />
      <div className="container text-center">
        <Badge className="mb-6 bg-primary/20 text-primary border-primary/40">
          AI Accessibility
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Read any screen with clarity.
          <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Cognitext
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          One keystroke to capture, simplify, and narrate any on-screen
          text—across apps, PDFs, and images—personalized for how you read.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="group">
            Get Early Access
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="outline" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Cross-platform</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span>AI-powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span>Privacy-first</span>
          </div>
        </div>
      </div>
    </section>
  );
}
