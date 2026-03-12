import { useEffect, useRef, useState, useCallback, useMemo, Component } from "react";
import { useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations.js";
import { worldDestinations } from "../data/worldDestinations.js";
import "./Globe.css";

// ─── Error Boundary ───────────────────────────────────────────────
class GlobeErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.warn("Globe error:", err.message); }
  render() {
    if (this.state.hasError) return this.props.fallback || null;
    return this.props.children;
  }
}

// ─── Simple spinner while globe initialises ───────────────────────
function GlobeSpinner() {
  return (
    <div className="g-spinner-wrap">
      <div className="g-stars" />
      <div className="g-spinner-inner">
        <div className="g-spin-ring" />
        <span className="g-spin-label">Rendering Earth…</span>
      </div>
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────
function Tooltip({ point, onClose, onAction }) {
  if (!point) return null;
  const isMine = point.type === "mine";
  return (
    <div className={`g-tooltip ${isMine ? "g-tt-mine" : "g-tt-world"}`}
      style={{ left: point.x, top: point.y }}>
      <button className="g-tt-close" onClick={onClose}>✕</button>
      {isMine && point.image && (
        <img src={point.image} alt={point.name} className="g-tt-img" loading="lazy" />
      )}
      <div className="g-tt-body">
        <div className="g-tt-badge">
          {isMine ? "✦ My Blog" : `${point.emoji || "📍"} World Pick`}
        </div>
        <div className="g-tt-name">{point.name}</div>
        {isMine  && <div className="g-tt-sub">{point.tagline}</div>}
        {!isMine && <div className="g-tt-sub">{point.tag}</div>}
        {isMine && (
          <div className="g-tt-meta">
            <span>📅 {point.bestTime}</span>
            <span>⏱ {point.duration}</span>
            <span>💰 {point.budget}</span>
          </div>
        )}
        <div className="g-tt-btns">
          {isMine && point.blogFile && (
            <button className="g-btn-gold"
              onClick={() => onAction("blog", point)}>📖 Read Blog</button>
          )}
          <button className="g-btn-plan"
            onClick={() => onAction("plan", point)}>✨ Plan Trip</button>
          {isMine && (
            <button className="g-btn-ghost"
              onClick={() => onAction("dest", point)}>Destinations →</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Globe inner ──────────────────────────────────────────────────
function GlobeInner({ onLoad }) {
  const mountRef  = useRef(null);
  const globeRef  = useRef(null);
  const isMounted = useRef(true);
  const navigate  = useNavigate();

  const [tooltip, setTooltip] = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // ── Point data ──────────────────────────────────────────────────
  const myPoints = useMemo(() => destinations.map(d => ({
    ...d, type: "mine", color: "#c9a84c",
  })), []);

  const worldPoints = useMemo(() => worldDestinations.map(d => ({
    ...d, type: "world", color: "rgba(255,255,255,0.9)",
  })), []);

  const arcs = useMemo(() => destinations.slice(0, -1).map((d, i) => ({
    startLat: d.lat, startLng: d.lng,
    endLat: destinations[i+1].lat, endLng: destinations[i+1].lng,
    color: ["rgba(201,168,76,0.9)", "rgba(201,168,76,0.05)"],
  })), []);

  const visiblePoints = useMemo(() =>
    filter === "mine"  ? myPoints  :
    filter === "world" ? worldPoints :
    [...myPoints, ...worldPoints],
  [filter, myPoints, worldPoints]);

  // ── Click handler ────────────────────────────────────────────────
  const handlePointClick = useCallback((point, event) => {
    if (!event || !mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    let x = event.clientX - rect.left + 16;
    let y = event.clientY - rect.top  - 20;
    if (x + 280 > rect.width)  x = event.clientX - rect.left - 292;
    if (y + 320 > rect.height) y = event.clientY - rect.top  - 330;
    setTooltip({ ...point, x, y });
  }, []);

  const handleAction = useCallback((action, point) => {
    setTooltip(null);
    if (action === "blog") navigate(`/blog/${point.blogFile.replace(".txt", "")}`);
    if (action === "plan") navigate(`/planner?destination=${encodeURIComponent(point.name)}`);
    if (action === "dest") navigate("/destinations");
  }, [navigate]);

  // ── Init globe using window.Globe (loaded from CDN in index.html) ─
  useEffect(() => {
    if (!mountRef.current || globeRef.current) return;

    // window.Globe is loaded via CDN script tag in index.html — always available
    const GlobeConstructor = window.Globe;
    if (!GlobeConstructor) {
      console.warn("globe.gl CDN not loaded yet");
      return;
    }

    const el = mountRef.current;
    const w  = el.clientWidth  || window.innerWidth;
    const h  = el.clientHeight || window.innerHeight;

    try {
      const globe = GlobeConstructor({ animateIn: false })(el)
        .width(w)
        .height(h)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .atmosphereColor("rgba(100,160,255,0.9)")
        .atmosphereAltitude(0.18)
        // Points
        .pointsData(visiblePoints)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(d => d.type === "mine" ? "#c9a84c" : "rgba(255,255,255,0.85)")
        .pointAltitude(d => d.type === "mine" ? 0.02 : 0.008)
        .pointRadius(d => d.type === "mine" ? 0.6 : 0.32)
        .pointResolution(16)
        .pointsMerge(false)
        .pointLabel(d => `
          <div style="
            background:rgba(4,6,18,0.96);
            border:1px solid ${d.type==="mine" ? "#c9a84c" : "rgba(255,255,255,0.35)"};
            border-radius:10px; padding:10px 14px;
            font-family:'Outfit',sans-serif; font-size:13px;
            color:#f0e8d5; pointer-events:none; white-space:nowrap;
            box-shadow:0 8px 32px rgba(0,0,0,0.7)${d.type==="mine" ? ",0 0 20px rgba(201,168,76,0.25)" : ""};
          ">
            <div style="font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;
              color:${d.type==="mine" ? "#c9a84c" : "rgba(255,255,255,0.45)"};margin-bottom:5px;">
              ${d.type==="mine" ? "✦ My Blog" : (d.emoji||"📍")+" World Pick"}
            </div>
            <strong style="font-size:14px;">${d.name}</strong>
            <div style="font-size:11px;color:rgba(240,232,213,0.55);margin-top:3px;">
              ${d.type==="mine" ? d.tagline : d.tag}
            </div>
          </div>`)
        .onPointClick(handlePointClick)
        // Arcs
        .arcsData(arcs)
        .arcStartLat("startLat").arcStartLng("startLng")
        .arcEndLat("endLat").arcEndLng("endLng")
        .arcColor("color")
        .arcDashLength(0.5).arcDashGap(0.2)
        .arcDashAnimateTime(4500)
        .arcAltitudeAutoScale(0.35)
        .arcStroke(0.5)
        .enablePointerInteraction(true);

      // Controls
      const ctrl = globe.controls();
      ctrl.autoRotate      = true;
      ctrl.autoRotateSpeed = 0.5;
      ctrl.enableZoom      = true;
      ctrl.minDistance     = 210;
      ctrl.maxDistance     = 560;
      ctrl.enableDamping   = true;
      ctrl.dampingFactor   = 0.08;

      globe.pointOfView({ lat: 20, lng: 78, altitude: 2.0 }, 0);

      // Pause rotate while dragging
      el.addEventListener("mousedown",  () => { ctrl.autoRotate = false; });
      el.addEventListener("mouseup",    () => { ctrl.autoRotate = true; });
      el.addEventListener("touchstart", () => { ctrl.autoRotate = false; }, { passive: true });
      el.addEventListener("touchend",   () => { ctrl.autoRotate = true;  }, { passive: true });

      globeRef.current = globe;

      // Show globe as soon as textures paint (globe.gl fires onGlobeReady)
      globe.onGlobeReady(() => {
        if (isMounted.current) {
          setReady(true);
          onLoad?.();
        }
      });

    } catch (err) {
      console.warn("Globe init error:", err);
    }

    // Resize
    const onResize = () => {
      if (!mountRef.current || !globeRef.current) return;
      try {
        globeRef.current
          .width(mountRef.current.clientWidth)
          .height(mountRef.current.clientHeight);
      } catch (_) {}
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      try {
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = false;
          globeRef.current.pauseAnimation?.();
          globeRef.current = null;
        }
      } catch (_) {}
    };
  }, []); // eslint-disable-line

  // ── Filter update ────────────────────────────────────────────────
  useEffect(() => {
    if (!globeRef.current) return;
    try {
      globeRef.current
        .pointsData(visiblePoints)
        .arcsData(filter !== "world" ? arcs : []);
    } catch (_) {}
  }, [filter, visiblePoints, arcs]);

  return (
    <div className="g-root">
      <div className="g-stars" />

      {!ready && <GlobeSpinner />}

      <div
        ref={mountRef}
        className={`g-canvas ${ready ? "g-visible" : ""}`}
        onClick={() => tooltip && setTooltip(null)}
      />

      {/* Filter buttons */}
      {ready && (
        <div className="g-filter-bar">
          <button
            className={`g-filter-btn ${filter !== "world" ? "g-fb-gold" : ""}`}
            onClick={() => setFilter(f => f === "mine" ? "all" : "mine")}>
            <span className="g-dot g-dot-gold" />
            My Travels ({myPoints.length})
          </button>
          <button
            className={`g-filter-btn ${filter !== "mine" ? "g-fb-white" : ""}`}
            onClick={() => setFilter(f => f === "world" ? "all" : "world")}>
            <span className="g-dot g-dot-white" />
            World Picks ({worldPoints.length})
          </button>
        </div>
      )}

      {ready && (
        <div className="g-hint">
          🖱 Drag to rotate &nbsp;·&nbsp; Scroll to zoom &nbsp;·&nbsp; Click a pin to explore
        </div>
      )}

      <Tooltip
        point={tooltip}
        onClose={() => setTooltip(null)}
        onAction={handleAction}
      />
    </div>
  );
}

// ─── Export with error boundary ───────────────────────────────────
export default function Globe({ onLoad }) {
  return (
    <GlobeErrorBoundary fallback={
      <div className="g-root" style={{ background: "#020510", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div className="g-stars" />
        <div style={{ textAlign:"center", color:"rgba(240,232,213,0.4)", position:"relative", zIndex:2 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🌍</div>
          <p>Globe requires WebGL. Try a different browser.</p>
        </div>
      </div>
    }>
      <GlobeInner onLoad={onLoad} />
    </GlobeErrorBoundary>
  );
}