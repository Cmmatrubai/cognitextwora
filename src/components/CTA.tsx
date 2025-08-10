import { Button } from "./ui/button";
import { Mail, ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="cta" className="py-20">
      <div className="container">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 text-center">
          <h3 className="text-2xl font-semibold">
            Be the first to try Cognitext
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            We're building a private, cross-platform desktop app for better,
            accessible reading everywhere.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="lg" className="group">
              <Mail className="mr-2 h-4 w-4" />
              Join the Waitlist
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Early access coming Q1 2025 • No spam, just updates
          </p>
        </div>
      </div>
    </section>
  );
}
