import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations.js";
import { worldDestinations } from "../data/worldDestinations.js";
import "./Home.css";

const Globe = lazy(() => import("./Globe.jsx"));

// ─── Animated number counter ──────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setN(v);
      if (v >= target) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [target]);
  return <>{n}{suffix}</>;
}

// ─── Feature card ─────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, href, cta }) {
  const navigate = useNavigate();
  return (
    <div className="hf-card" onClick={() => navigate(href)}>
      <div className="hf-icon">{icon}</div>
      <h3 className="hf-title">{title}</h3>
      <p className="hf-desc">{desc}</p>
      <span className="hf-cta">{cta} →</span>
    </div>
  );
}

// ─── World suggestion card ────────────────────────────────────────
function WorldCard({ dest, onClick }) {
  return (
    <div className="hw-card" onClick={() => onClick(dest.name)}>
      <span className="hw-emoji">{dest.emoji}</span>
      <div className="hw-info">
        <div className="hw-name">{dest.name}</div>
        <div className="hw-tag">{dest.tag}</div>
      </div>
      <span className="hw-cat">{dest.category}</span>
    </div>
  );
}

// ─── Blog preview card ────────────────────────────────────────────
function BlogCard({ dest, onClick }) {
  return (
    <div className="hb-card" onClick={() => onClick(dest.blogFile.replace(".txt", ""))}>
      <div className="hb-img-wrap">
        <img src={dest.image} alt={dest.name} className="hb-img" loading="lazy" />
        <div className="hb-overlay" />
        <span className="hb-cat">{dest.category}</span>
      </div>
      <div className="hb-body">
        <div className="hb-location">{dest.region}, {dest.country}</div>
        <h3 className="hb-title">{dest.name}</h3>
        <p className="hb-tagline">{dest.tagline}</p>
        <span className="hb-read">Read Story →</span>
      </div>
    </div>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────
export default function Home() {
  const navigate        = useNavigate();
  const [blogsCount,    setBlogsCount]    = useState(0);
  const [globeLoaded,   setGlobeLoaded]   = useState(false);
  const [globeVisible,  setGlobeVisible]  = useState(false);
  const [worldFilter,   setWorldFilter]   = useState("All");
  const globeRef        = useRef(null);

  const countries = [...new Set(destinations.map(d => d.country))].length;

  // Fetch real blog count
  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(d => d.success && setBlogsCount(d.blogs.length))
      .catch(() => setBlogsCount(destinations.filter(d => d.blogFile).length));
  }, []);

  // Mount Globe only when section is near viewport
  useEffect(() => {
    const el = globeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setGlobeVisible(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const worldCats  = ["All", ...new Set(worldDestinations.map(d => d.category))];
  const filteredWorld = worldFilter === "All"
    ? worldDestinations
    : worldDestinations.filter(d => d.category === worldFilter);

  return (
    <div className="hp-root">

      {/* ══════════════════════════════════════════════
          HERO — Full-screen interactive globe
      ══════════════════════════════════════════════ */}
      <section className="hp-hero" ref={globeRef}>

        {/* Overlay text — top left */}
        <div className={`hp-overlay ${globeLoaded ? "hp-overlay-visible" : ""}`}>
          <p className="hp-eyebrow">AI-Powered Travel</p>
          <h1 className="hp-headline">
            Explore the<br /><em>World</em>
          </h1>
          <p className="hp-sub">
            Real travel stories from my journeys. Click any pin to read the blog or plan your trip with AI.
          </p>
          <div className="hp-hero-btns">
            <button className="btn-gold hp-btn" onClick={() => navigate("/destinations")}>
              🌍 My Destinations
            </button>
            <button className="btn-ghost hp-btn" onClick={() => navigate("/planner")}>
              ✨ Plan a Trip
            </button>
          </div>

          {/* Stats strip */}
          <div className="hp-stats">
            <div className="hp-stat">
              <span className="hp-stat-n">{globeLoaded ? <Counter target={destinations.length} /> : destinations.length}</span>
              <span className="hp-stat-l">Places</span>
            </div>
            <div className="hp-stat-sep" />
            <div className="hp-stat">
              <span className="hp-stat-n">{globeLoaded ? <Counter target={blogsCount} /> : blogsCount}</span>
              <span className="hp-stat-l">Blogs</span>
            </div>
            <div className="hp-stat-sep" />
            <div className="hp-stat">
              <span className="hp-stat-n">{globeLoaded ? <Counter target={countries} /> : countries}</span>
              <span className="hp-stat-l">Countries</span>
            </div>
            <div className="hp-stat-sep" />
            <div className="hp-stat">
              <span className="hp-stat-n">{worldDestinations.length}+</span>
              <span className="hp-stat-l">World Picks</span>
            </div>
          </div>
        </div>

        {/* The Globe — takes full section */}
        {globeVisible ? (
          <Suspense fallback={<div className="hp-globe-fallback"><div className="hp-spinner" /></div>}>
            <Globe onLoad={() => setGlobeLoaded(true)} />
          </Suspense>
        ) : (
          <div className="hp-globe-fallback"><div className="hp-spinner" /></div>
        )}

        {/* Scroll down indicator */}
        <div className="hp-scroll-hint" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}>
          <div className="hp-scroll-arrow" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════ */}
      <section className="hp-section container">
        <div className="hp-sec-header">
          <p className="hp-sec-eye">What You Can Do</p>
          <h2 className="hp-sec-title">Your Complete <em>Travel Companion</em></h2>
        </div>
        <div className="hp-features">
          <FeatureCard icon="📖" title="Travel Stories"     desc="First-hand accounts from the road. Honest tips, hidden spots, things that went wrong."    href="/blog"         cta="Read blogs" />
          <FeatureCard icon="🗺️" title="AI Trip Planner"    desc="Enter destination, budget, dates — get a full day-by-day itinerary in 30 seconds."        href="/planner"      cta="Plan a trip" />
          <FeatureCard icon="💬" title="Travel Concierge"   desc="Ask anything — visas, best time, packing lists, safety tips. Instant answers 24/7."        href="/chat"         cta="Start chatting" />
          <FeatureCard icon="📍" title="Destinations"       desc="Every place I've visited with photos, tips and a direct link to the travel blog."            href="/destinations" cta="Explore places" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WORLD SUGGESTIONS
      ══════════════════════════════════════════════ */}
      <section className="hp-section container">
        <div className="hp-sec-header">
          <p className="hp-sec-eye">Global Inspiration</p>
          <h2 className="hp-sec-title">{worldDestinations.length}+ Places <em>Worth Visiting</em></h2>
          <p className="hp-sec-sub">Click any destination to start planning with AI instantly.</p>
        </div>

        {/* Category pills */}
        <div className="hp-pills">
          {worldCats.map(c => (
            <button key={c}
              className={`hp-pill ${worldFilter === c ? "hp-pill-active" : ""}`}
              onClick={() => setWorldFilter(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="hp-world-grid">
          {filteredWorld.slice(0, 12).map((d, i) => (
            <WorldCard key={i} dest={d}
              onClick={name => navigate(`/planner?destination=${encodeURIComponent(name)}`)} />
          ))}
        </div>

        <div className="hp-center-btn">
          <button className="btn-ghost" onClick={() => navigate("/planner")}>
            ✨ Plan Any Destination with AI →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RECENT BLOGS
      ══════════════════════════════════════════════ */}
      <section className="hp-section container">
        <div className="hp-sec-header">
          <p className="hp-sec-eye">Latest From The Road</p>
          <h2 className="hp-sec-title">Recent <em>Travel Stories</em></h2>
        </div>
        <div className="hp-blogs-grid">
          {destinations.filter(d => d.blogFile).slice(0, 3).map(d => (
            <BlogCard key={d.id} dest={d}
              onClick={slug => navigate(`/blog/${slug}`)} />
          ))}
        </div>
        <div className="hp-center-btn">
          <button className="btn-ghost" onClick={() => navigate("/blog")}>
            View All Travel Stories →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="hp-section container">
        <div className="hp-cta">
          <div className="hp-cta-glow" />
          <p className="hp-sec-eye">Ready to Go?</p>
          <h2 className="hp-cta-title">Tell me where.<br /><em>I'll plan the rest.</em></h2>
          <p className="hp-cta-sub">
            Drop a destination into our AI planner and get a full day-by-day itinerary
            tailored to your budget and travel style — in under a minute.
          </p>
          <button className="btn-gold hp-cta-btn" onClick={() => navigate("/planner")}>
            ✨ Start Planning For Free
          </button>
        </div>
      </section>

    </div>
  );
}