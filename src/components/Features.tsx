import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AudioLines, ScanText, Sparkles, Type, Languages, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Instant Capture",
    desc: "One keystroke captures any text on screen—PDFs, websites, apps, even images.",
    icon: ScanText,
  },
  {
    title: "AI Simplification",
    desc: "Complex text becomes clear, concise, and tailored to your reading level.",
    icon: Sparkles,
  },
  {
    title: "Dyslexia-Friendly",
    desc: "Customizable fonts, spacing, and color overlays for optimal readability.",
    icon: Type,
  },
  {
    title: "Audio Readout",
    desc: "Natural text-to-speech with adjustable speed and voice preferences.",
    icon: AudioLines,
  },
  {
    title: "Smart Translation",
    desc: "Break language barriers with instant translations and explanations.",
    icon: Languages,
  },
  {
    title: "Privacy First",
    desc: "All processing happens locally—your text never leaves your device.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Built for accessible reading</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Cognitext works system-wide, in real time, so you can read better anywhere.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-primary/20 bg-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
