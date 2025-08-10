import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, GraduationCap, Globe } from "lucide-react";

const audiences = [
  {
    title: "Students with Learning Differences",
    desc: "From elementary to university, students can access complex materials with confidence.",
    stat: "40% improvement in reading comprehension",
    icon: GraduationCap,
  },
  {
    title: "Professionals & Workers",
    desc: "Navigate dense reports, technical docs, and multilingual content efficiently.",
    stat: "3x faster document processing",
    icon: Users,
  },
  {
    title: "Multilingual Communities",
    desc: "Break language barriers with instant translations and cultural context.",
    stat: "Support for 50+ languages",
    icon: Globe,
  },
];

export function Impact() {
  return (
    <section id="impact" className="py-16">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Real impact for real readers
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Designed with accessibility at the core—useful for dyslexia, ADHD, and
          multilingual contexts.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <Card key={a.title} className="border-primary/20 bg-card">
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{a.desc}</p>
                <p className="mt-4 font-mono text-sm text-primary">{a.stat}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
