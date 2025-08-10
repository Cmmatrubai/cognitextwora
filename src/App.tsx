import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Impact } from "./components/Impact";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Impact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
