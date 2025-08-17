import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Impact } from "./components/Impact";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { SetupPage } from "./pages/SetupPage";
import "./App.css";

function HomePage() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SetupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
