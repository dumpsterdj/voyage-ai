import { useState } from "react";
import { generateItinerary } from "../services/ollamaService";
import "./ItineraryPlanner.css";

// ─── Config ───────────────────────────────────────────────────────
const BUDGET_OPTIONS = [
  { id: "backpacker", icon: "🎒", label: "Backpacker", desc: "Hostels & street food" },
  { id: "budget",     icon: "💰", label: "Budget",     desc: "3-star & local eats" },
  { id: "moderate",   icon: "💳", label: "Moderate",   desc: "4-star comfort" },
  { id: "luxury",     icon: "💎", label: "Luxury",     desc: "5-star experiences" },
  { id: "ultra",      icon: "👑", label: "Ultra",      desc: "No limits" },
];

const INTEREST_OPTIONS = [
  "🏛️ History & Heritage", "🍜 Food & Cuisine", "🏔️ Adventure & Trekking",
  "🎨 Art & Culture", "🌿 Nature & Wildlife", "🌃 Nightlife",
  "🛍️ Shopping", "🧘 Wellness & Spa", "📸 Photography",
  "🏖️ Beaches", "🤿 Water Sports", "🎭 Local Festivals",
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "SGD", "AED"];

const LOADING_STEPS = [
  "Researching top-rated hotels & stays...",
  "Curating local restaurants & street food...",
  "Finding hidden gems & attractions...",
  "Mapping routes & transport options...",
  "Checking visa & entry requirements...",
  "Calculating your budget breakdown...",
  "Adding insider tips & cultural notes...",
  "Crafting your perfect itinerary...",
];

const SECTION_DEFS = [
  { key: "ACCOMMODATION", icon: "🏨", label: "Where to Stay",   kws: ["ACCOMMODATION", "HOTEL", "WHERE TO STAY", "STAY", "LODGING"] },
  { key: "MORNING",       icon: "🌅", label: "Morning",         kws: ["MORNING"] },
  { key: "LUNCH",         icon: "🥗", label: "Lunch",           kws: ["LUNCH", "MIDDAY MEAL"] },
  { key: "AFTERNOON",     icon: "☀️", label: "Afternoon",       kws: ["AFTERNOON"] },
  { key: "DINNER",        icon: "🍷", label: "Dinner",          kws: ["DINNER", "EVENING MEAL"] },
  { key: "EVENING",       icon: "🌙", label: "Evening & Night", kws: ["EVENING", "NIGHT", "NIGHTLIFE"] },
  { key: "TRANSPORT",     icon: "🗺️", label: "Getting Around",  kws: ["GETTING AROUND", "TRANSPORT", "ROUTE", "TRAVEL TIP"] },
  { key: "TIPS",          icon: "💡", label: "Local Tips",      kws: ["LOCAL TIPS", "TIPS", "INSIDER"] },
];

const APPENDIX_DEFS = [
  { key: "budget",    icon: "💰", label: "Budget Summary",     reStr: "BUDGET\\s+SUMMARY" },
  { key: "visa",      icon: "🛂", label: "Visa & Entry",       reStr: "VISA(?:\\s*[&\\s]*ENTRY)?" },
  { key: "besttime",  icon: "📅", label: "Best Time to Visit", reStr: "BEST\\s+TIME" },
  { key: "emergency", icon: "🆘", label: "Emergency Contacts", reStr: "EMERGENCY" },
  { key: "phrases",   icon: "🗣️", label: "Useful Phrases",     reStr: "USEFUL\\s+PHRASES" },
];

// ─── Markdown → Styled HTML ───────────────────────────────────────
function renderMarkdown(raw) {
  if (!raw) return "";

  let text = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Tables
  text = renderTables(text);

  // Headings
  text = text.replace(/^### (.+)$/gm, '<h4 class="md-h4">$1</h4>');
  text = text.replace(/^## (.+)$/gm,  '<h3 class="md-h3">$1</h3>');
  text = text.replace(/^# (.+)$/gm,   '<h2 class="md-h2">$1</h2>');

  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');
  text = text.replace(/__(.+?)__/g,     '<strong class="md-bold">$1</strong>');

  // Italic
  text = text.replace(/\*([^*\n]+?)\*/g, '<em class="md-em">$1</em>');
  text = text.replace(/_([^_\n]+?)_/g,   '<em class="md-em">$1</em>');

  // HR
  text = text.replace(/^---+$/gm, '<hr class="md-hr" />');

  // Bullet list items
  text = text.replace(/^[-•]\s+(.+)$/gm, '<li class="md-li">$1</li>');

  // Wrap consecutive li items in ul
  text = text.replace(/(<li class="md-li">[\s\S]*?<\/li>\n?)+/g,
    match => `<ul class="md-ul">${match}</ul>`);

  // Numbered list items
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li class="md-oli">$1</li>');
  text = text.replace(/(<li class="md-oli">[\s\S]*?<\/li>\n?)+/g,
    match => `<ol class="md-ol">${match}</ol>`);

  // Paragraphs: wrap bare text lines
  const lines = text.split('\n');
  const wrapped = lines.map(line => {
    const t = line.trim();
    if (!t) return '';
    if (t.startsWith('<')) return line;
    return `<p class="md-p">${line}</p>`;
  });

  return wrapped.join('\n');
}

function renderTables(text) {
  return text.replace(/((?:\|.+\|\n?)+)/g, block => {
    const rows = block.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return block;
    const sepIdx = rows.findIndex(r => /^\|[\s\-:|]+\|$/.test(r.trim()));
    if (sepIdx < 0) return block;

    const parseRow = r => r.split('|').slice(1, -1).map(c => c.trim());
    const headers  = parseRow(rows[0]);
    const dataRows = rows.slice(sepIdx + 1);

    let html = '<div class="md-table-wrap"><table class="md-table"><thead><tr>';
    headers.forEach(h => { html += `<th>${h.replace(/\*+/g, '')}</th>`; });
    html += '</tr></thead><tbody>';
    dataRows.forEach(row => {
      const cells = parseRow(row);
      if (!cells.length) return;
      html += '<tr>';
      cells.forEach(c => { html += `<td>${c.replace(/\*+/g, '')}</td>`; });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  });
}

// ─── Day Parser ───────────────────────────────────────────────────
function parseDays(text) {
  // Matches: "Day 1:", "**Day 1:**", "Day 1 -", "**Day 1 -**" etc.
  const re = /(?:^|\n)\*{0,2}Day\s+(\d+)\s*[:\-–*]/gim;
  const hits = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    hits.push({ index: m.index === 0 ? 0 : m.index, number: m[1] });
  }
  if (!hits.length) return [];

  // Find start of appendix to cap last day
  const appendixRe = /\n\*{0,2}(?:BUDGET SUMMARY|VISA|BEST TIME|EMERGENCY CONTACTS|USEFUL PHRASES)/i;
  const appendixHit = appendixRe.exec(text);
  const appendixStart = appendixHit ? appendixHit.index : text.length;

  return hits.map((hit, i) => {
    const end = i + 1 < hits.length
      ? Math.min(hits[i + 1].index, appendixStart)
      : appendixStart;
    return { number: hit.number, raw: text.slice(hit.index, end).trim() };
  });
}

// ─── Section Extractor ────────────────────────────────────────────
function extractSection(dayRaw, keywords) {
  // Build a combined alternation for all keyword variants
  const allSectionKws = SECTION_DEFS.flatMap(s => s.kws).join('|');
  for (const kw of keywords) {
    const re = new RegExp(
      `(?:^|\\n)\\*{0,2}${kw}\\*{0,2}[:\\s]*\\*{0,2}\\n?([\\s\\S]*?)` +
      `(?=\\n\\*{0,2}(?:${allSectionKws})\\*{0,2}[:\\s]|\\n---+\\n|$)`,
      'im'
    );
    const hit = dayRaw.match(re);
    if (hit && hit[1]?.trim()) return hit[1].trim();
  }
  return null;
}

// ─── Appendix Extractor ───────────────────────────────────────────
// Finds each section header position, then slices text between them
function extractAppendix(text) {
  // Step 1: locate every appendix header and its position in the text
  const found = [];
  for (const def of APPENDIX_DEFS) {
    // Match header at start of a line, with optional ** and ### prefixes
    const re = new RegExp(
      `(?:^|\\n)[#*\\s]*(?:${def.reStr})[*\\s]*[:\\-–]?[ \\t]*`,
      'im'
    );
    const hit = re.exec(text);
    if (hit) {
      found.push({
        key:   def.key,
        icon:  def.icon,
        label: `${def.icon} ${def.label}`,
        // content starts right after the header line
        start: hit.index + hit[0].length,
        headerIndex: hit.index,
      });
    }
  }

  if (!found.length) return {};

  // Step 2: sort by position in the document
  found.sort((a, b) => a.headerIndex - b.headerIndex);

  // Step 3: each section's content ends where the next section starts
  const result = {};
  for (let i = 0; i < found.length; i++) {
    const contentStart = found[i].start;
    const contentEnd   = i + 1 < found.length ? found[i + 1].headerIndex : text.length;
    const content      = text.slice(contentStart, contentEnd).trim();
    if (content) {
      result[found[i].key] = { label: found[i].label, content };
    }
  }
  return result;
}

// ─── Section Block ────────────────────────────────────────────────
function SectionBlock({ icon, label, content }) {
  return (
    <div className="itin-section">
      <div className="itin-section-header">
        <span className="itin-section-icon">{icon}</span>
        <span className="itin-section-label">{label}</span>
      </div>
      <div className="md-content"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
    </div>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────
function DayCard({ day, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  const title = day.raw.split('\n')[0]
    .replace(/\*{0,2}Day\s+\d+\s*[:\-–*]\s*\*{0,2}/i, '')
    .replace(/\*+|["'"]/g, '')
    .trim();

  const sections = SECTION_DEFS
    .map(def => ({ ...def, content: extractSection(day.raw, def.kws) }))
    .filter(s => s.content);

  return (
    <div className={`day-card ${open ? "open" : ""}`}>
      <button className="day-header" onClick={() => setOpen(o => !o)}>
        <div className="day-number">{day.number}</div>
        <div className="day-title-group">
          <div className="day-title">{title || `Day ${day.number}`}</div>
          <div className="day-section-count">
            {sections.length > 0 ? `${sections.length} sections` : "Tap to expand"}
          </div>
        </div>
        <span className={`chevron ${open ? "up" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="day-body fade-up">
          {sections.length > 0 ? (
            sections.map(sec => (
              <SectionBlock key={sec.key} icon={sec.icon} label={sec.label} content={sec.content} />
            ))
          ) : (
            <div className="md-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(day.raw.replace(/\*{0,2}Day\s+\d+[^\n]*/i, '').trim())
              }} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Appendix Card ────────────────────────────────────────────────
function AppendixCard({ label, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`appendix-card card ${open ? "open" : ""}`}>
      <button className="day-header" onClick={() => setOpen(o => !o)}>
        <span className="appendix-label">{label}</span>
        <span className={`chevron ${open ? "up" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="day-body fade-up">
          <div className="md-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function ItineraryPlanner() {
  const [destination, setDestination] = useState("");
  const [days,        setDays]        = useState("7");
  const [people,      setPeople]      = useState("2");
  const [budget,      setBudget]      = useState("moderate");
  const [interests,   setInterests]   = useState([]);
  const [currency,    setCurrency]    = useState("USD");
  const [loading,     setLoading]     = useState(false);
  const [loadStep,    setLoadStep]    = useState(0);
  const [result,      setResult]      = useState(null);
  const [parsedDays,  setParsedDays]  = useState([]);
  const [appendix,    setAppendix]    = useState({});
  const [meta,        setMeta]        = useState(null);
  const [error,       setError]       = useState(null);

  const toggleInterest = item =>
    setInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);

  const handleGenerate = async () => {
    if (!destination.trim() || loading) return;
    setError(null); setResult(null); setParsedDays([]); setAppendix({});
    setLoading(true); setLoadStep(0);
    const interval = setInterval(() => setLoadStep(s => (s + 1) % LOADING_STEPS.length), 1800);

    try {
      const budgetLabel = BUDGET_OPTIONS.find(b => b.id === budget)?.label || budget;
      const raw = await generateItinerary({ destination: destination.trim(), days, people, budget: budgetLabel, interests, currency });
      setParsedDays(parseDays(raw));
      setAppendix(extractAppendix(raw));
      setResult(raw);
      setMeta({ destination: destination.trim(), days, people, budget: budgetLabel, currency, interests: [...interests] });
    } catch (err) {
      console.error(err);
      setError("Failed to generate. Check your Ollama connection and API key.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="planner-page">
      <div className="planner-hero">
        <p className="hero-eyebrow">AI Itinerary Builder</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(38px, 6vw, 70px)" }}>
          Your Dream Trip,<br /><em>Perfectly Planned</em>
        </h1>
        <p className="hero-sub" style={{ maxWidth: 500 }}>
          Tell us your destination, budget and interests. Our AI builds a full
          day-by-day itinerary — hotels, restaurants, routes, tips and more.
        </p>
      </div>

      <div className="planner-layout container">
        {/* ══ FORM ══ */}
        <aside className="planner-form card">
          <div className="form-heading">
            <h2 className="form-title">Plan Your Journey</h2>
            <p className="form-subtitle">Powered by AI · Fully Customised</p>
          </div>

          <div className="form-field">
            <label className="form-label">📍 Destination</label>
            <input className="form-input" placeholder="e.g. Amritsar, Punjab"
              value={destination} onChange={e => setDestination(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()} />
          </div>

          <div className="form-row-2">
            <div className="form-field">
              <label className="form-label">📅 Duration</label>
              <select className="form-select" value={days} onChange={e => setDays(e.target.value)}>
                {[2,3,4,5,6,7,8,10,12,14,21].map(d => <option key={d} value={d}>{d} Days</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">👥 Travellers</label>
              <select className="form-select" value={people} onChange={e => setPeople(e.target.value)}>
                {[1,2,3,4,5,6,8,10].map(p => <option key={p} value={p}>{p} {p===1?"Person":"People"}</option>)}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">💱 Currency</label>
            <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">💰 Budget Style</label>
            <div className="budget-grid">
              {BUDGET_OPTIONS.map(opt => (
                <div key={opt.id} className={`budget-tile ${budget===opt.id?"selected":""}`} onClick={() => setBudget(opt.id)}>
                  <span className="budget-icon">{opt.icon}</span>
                  <span className="budget-name">{opt.label}</span>
                  <span className="budget-desc">{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">🎯 Interests
              <span style={{ opacity: 0.45, textTransform: "none", fontSize: 10, marginLeft: 6 }}>(optional)</span>
            </label>
            <div className="interests-wrap">
              {INTEREST_OPTIONS.map(item => (
                <div key={item} className={`tag ${interests.includes(item)?"selected":""}`} onClick={() => toggleInterest(item)}>{item}</div>
              ))}
            </div>
          </div>

          {error && <div className="error-banner">⚠ {error}</div>}

          <button className="btn-gold generate-btn" onClick={handleGenerate} disabled={loading || !destination.trim()}>
            {loading ? "✨ Crafting Your Itinerary..." : "✨ Generate My Itinerary"}
          </button>
        </aside>

        {/* ══ OUTPUT ══ */}
        <section className="planner-output">
          {!result && !loading && (
            <div className="output-empty card">
              <div className="empty-icon">🌐</div>
              <div className="empty-title">Your itinerary will appear here</div>
              <div className="empty-sub">Fill in the form and hit Generate</div>
            </div>
          )}

          {loading && (
            <div className="output-loading card">
              <div className="spin" />
              <div className="loading-dest">
                Crafting your trip to<br />
                <strong style={{ color: "var(--gold)" }}>{destination}</strong>
              </div>
              <div className="loading-steps">
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} className={`loading-step ${i===loadStep?"active":""}`}>
                    <span className="step-dot" />{step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="output-result fade-up">
              <div className="result-header card">
                <h2 className="result-destination">✈ {meta.destination}</h2>
                <div className="result-meta">
                  <span className="pill">📅 {meta.days} Days</span>
                  <span className="pill">👥 {meta.people} {+meta.people===1?"Traveller":"Travellers"}</span>
                  <span className="pill">💰 {meta.budget}</span>
                  <span className="pill">💱 {meta.currency}</span>
                  {meta.interests.length > 0 && (
                    <span className="pill">🎯 {meta.interests.map(i => i.replace(/^\S+\s/, "")).slice(0,3).join(", ")}</span>
                  )}
                </div>
              </div>

              {parsedDays.length > 0 ? (
                <div className="days-list">
                  {parsedDays.map((day, i) => (
                    <DayCard key={`day-${day.number}-${i}`} day={day} defaultOpen={i === 0} />
                  ))}
                </div>
              ) : (
                <div className="card raw-output md-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
              )}

              {Object.keys(appendix).length > 0 && (
                <div className="appendix-list">
                  <div className="section-divider" style={{ marginBottom: 16 }}>Additional Information</div>
                  {Object.entries(appendix).map(([key, { label, content }]) => (
                    <AppendixCard key={key} label={label} content={content} />
                  ))}
                </div>
              )}

              <button className="btn-ghost" style={{ marginTop: 16, width: "100%" }} onClick={handleGenerate}>
                ↺ Regenerate Itinerary
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}