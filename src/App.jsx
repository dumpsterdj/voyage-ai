import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ItineraryPlanner from "./components/ItineraryPlanner";
import "./index.css";

// ─── Placeholder pages (you'll replace these from Lovable) ────────
function Home() {
  return (
    <div style={{ padding: "100px 24px", textAlign: "center" }}>
      <p className="hero-eyebrow" style={{ marginBottom: 16 }}>Welcome to</p>
      <h1 className="hero-title" style={{ fontSize: "clamp(52px, 8vw, 100px)", marginBottom: 20 }}>
        VOYAGE<em>AI</em>
      </h1>
      <p className="hero-sub" style={{ maxWidth: 480, margin: "0 auto 36px" }}>
        Your AI-powered travel companion. Discover destinations, chat with our
        concierge, and get a fully personalised trip itinerary in minutes.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="/chat"    className="btn-gold"  style={{ textDecoration: "none" }}>💬 Travel Chat</a>
        <a href="/planner" className="btn-ghost" style={{ textDecoration: "none" }}>🗺️ Plan My Trip</a>
      </div>
    </div>
  );
}

function Destinations() {
  return (
    <div style={{ padding: "80px 24px", textAlign: "center", opacity: 0.5 }}>
      <h2 className="hero-title" style={{ fontSize: 40 }}>Destinations</h2>
      <p className="hero-sub" style={{ marginTop: 16 }}>Coming from Lovable — drop your component here</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <div className="bg-layer" />
        <Navbar />
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/chat"         element={<Chatbot />} />
          <Route path="/planner"      element={<ItineraryPlanner />} />
          {/* Catch-all */}
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}