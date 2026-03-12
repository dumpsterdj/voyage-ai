import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { destinations } from "../data/destinations.js";
import { getUploadedBlogContent} from "../services/blogStorage.js";
import "./Blog.css";

// ─── Parse blog.txt ────────────────────────────────────────────────
function parseBlogTxt(raw) {
  const lines   = raw.split('\n');
  const meta    = {};
  const body    = [];
  let   inBody  = false;

  for (const line of lines) {
    const t = line.trim();
    if (!inBody) {
      if (t === '---') { inBody = true; continue; }
      const m = t.match(/^([A-Z_]+):\s*(.+)$/);
      if (m) { meta[m[1]] = m[2].trim(); continue; }
    } else {
      body.push(line);
    }
  }

  // Parse body sections
  const sections = [];
  let current = null;
  let buffer  = [];

  const pushCurrent = () => {
    if (current !== null && buffer.join('').trim()) {
      sections.push({ heading: current, content: buffer.join('\n').trim() });
    }
  };

  for (const line of body) {
    const t = line.trim();
    if (t.startsWith('SECTION:'))  { pushCurrent(); current = t.replace('SECTION:', '').trim(); buffer = []; continue; }
    if (t.startsWith('INTRO:'))    { pushCurrent(); current = '__INTRO__';   buffer = []; continue; }
    if (t.startsWith('CLOSING:'))  { pushCurrent(); current = '__CLOSING__'; buffer = []; continue; }
    if (t === '---')               { pushCurrent(); current = null; buffer = []; continue; }
    if (current !== null) buffer.push(line);
  }
  pushCurrent();

  return { meta, sections };
}

// ─── Markdown renderer ─────────────────────────────────────────────
function renderContent(text) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="bl-bold">$1</strong>');
  html = html.replace(/\*([^*\n]+?)\*/g, '<em class="bl-em">$1</em>');
  html = html.replace(/^[-•]\s+(.+)$/gm, '<li class="bl-li">$1</li>');
  html = html.replace(/(<li class="bl-li">[\s\S]*?<\/li>\n?)+/g, m => `<ul class="bl-ul">${m}</ul>`);
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="bl-oli">$1</li>');
  html = html.replace(/(<li class="bl-oli">[\s\S]*?<\/li>\n?)+/g, m => `<ol class="bl-ol">${m}</ol>`);

  return html.split('\n').map(line => {
    const t = line.trim();
    if (!t) return '';
    if (t.startsWith('<')) return line;
    return `<p class="bl-p">${line}</p>`;
  }).join('\n');
}

// ─── Section ───────────────────────────────────────────────────────
function BlogSection({ section, index }) {
  const isIntro   = section.heading === '__INTRO__';
  const isClosing = section.heading === '__CLOSING__';
  const num       = isIntro || isClosing ? null : index;

  return (
    <div className={`blog-section ${isIntro ? 'intro-section' : ''} ${isClosing ? 'closing-section' : ''} fade-up`}
      style={{ animationDelay: `${index * 0.04}s` }}>

      {!isIntro && !isClosing && (
        <div className="blog-section-header">
          <span className="blog-section-num">{String(num).padStart(2, '0')}</span>
          <h2 className="blog-section-title">{section.heading}</h2>
        </div>
      )}

      {isClosing && (
        <div className="closing-marker">
          <span className="closing-line" />
          <span className="closing-label">Final Thoughts</span>
          <span className="closing-line" />
        </div>
      )}

      <div className="blog-section-body"
        dangerouslySetInnerHTML={{ __html: renderContent(section.content) }} />
    </div>
  );
}

// ─── Main Blog Reader ──────────────────────────────────────────────
export default function Blog() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const [blog,    setBlog]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Find matching destination for sidebar info
  const dest = destinations.find(d => d.blogFile === `${slug}.txt`);

  // Find prev / next blogs for navigation
  const blogged = destinations.filter(d => d.blogFile);
  const idx     = blogged.findIndex(d => d.blogFile === `${slug}.txt`);
  const prev    = idx > 0                  ? blogged[idx - 1] : null;
  const next    = idx < blogged.length - 1 ? blogged[idx + 1] : null;

  useEffect(() => {
    setLoading(true); setBlog(null); setError(null);

    // 1. Check localStorage first (uploaded via chatbot)
    const stored = getUploadedBlogContent(slug);
    if (stored) {
      setBlog(parseBlogTxt(stored));
      setLoading(false);
      return;
    }

    // 2. Fall back to static /public/blogs/ files
    fetch(`/blogs/${slug}.txt`)
      .then(r => {
        if (!r.ok) throw new Error(`Blog "${slug}.txt" not found. Upload it via the chat 📎 button or add it to /public/blogs/.`);
        return r.text();
      })
      .then(raw => { setBlog(parseBlogTxt(raw)); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="blog-loading"><div className="spin" /><p>Loading article...</p></div>
  );

  if (error) return (
    <div className="blog-error">
      <div style={{ fontSize: 48 }}>📄</div>
      <h2>Blog not found</h2>
      <p>{error}</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
        Create <code>/public/blogs/{slug}.txt</code> and refresh.
      </p>
      <button className="btn-ghost" style={{ marginTop: 20 }} onClick={() => navigate('/blog')}>
        ← All Stories
      </button>
    </div>
  );

  const { meta, sections } = blog;
  const tags = meta.TAGS ? meta.TAGS.split(',').map(t => t.trim()) : [];
  const tocSections = sections.filter(s => s.heading !== '__INTRO__' && s.heading !== '__CLOSING__');
  let sectionCounter = 0;

  return (
    <div className="blog-page">
      {/* Cover */}
      <div className="blog-cover">
        {meta.COVER && <><img src={meta.COVER} alt={meta.TITLE} className="blog-cover-img" /><div className="blog-cover-overlay" /></>}
        <div className="blog-cover-content">
          <Link to="/blog" className="blog-back-link">← All Stories</Link>
          <div className="blog-meta-row">
            {meta.CATEGORY && <span className="blog-category">{meta.CATEGORY}</span>}
            {meta.READ_TIME && <span className="blog-readtime">⏱ {meta.READ_TIME}</span>}
          </div>
          <h1 className="blog-title">{meta.TITLE}</h1>
          <div className="blog-byline">
            <span className="blog-author">✦ {meta.AUTHOR}</span>
            {meta.DATE && <span className="blog-date">{meta.DATE}</span>}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="blog-layout">
        {/* Sidebar */}
        <aside className="blog-sidebar">
          {tocSections.length > 0 && (
            <div className="blog-sidebar-card">
              <div className="sidebar-label">Contents</div>
              <nav className="blog-toc">
                {tocSections.map((s, i) => (
                  <a key={i} href={`#section-${i}`} className="toc-item">
                    <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="toc-text">{s.heading}</span>
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Destination quick info */}
          {dest && (
            <div className="blog-sidebar-card">
              <div className="sidebar-label">Quick Info</div>
              <div className="sidebar-info">
                <div className="sidebar-info-row"><span>📅 Best time</span><strong>{dest.bestTime}</strong></div>
                <div className="sidebar-info-row"><span>⏱ Duration</span><strong>{dest.duration}</strong></div>
                <div className="sidebar-info-row"><span>💰 Budget</span><strong>{dest.budget}</strong></div>
              </div>
            </div>
          )}

          {/* Plan CTA */}
          <div className="blog-sidebar-card sidebar-cta">
            <div className="sidebar-label">Ready to go?</div>
            <p className="sidebar-cta-text">Let our AI build a full itinerary for this destination.</p>
            <button className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              onClick={() => navigate(`/planner${dest ? `?destination=${encodeURIComponent(dest.name)}` : ''}`)}>
              ✨ Plan This Trip
            </button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="blog-sidebar-card">
              <div className="sidebar-label">Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {tags.map(t => <span key={t} className="pill" style={{ fontSize: 11 }}>{t}</span>)}
              </div>
            </div>
          )}
        </aside>

        {/* Article */}
        <article className="blog-article">
          {sections.filter(s => s.content).map((section, i) => {
            const isNamed = section.heading !== '__INTRO__' && section.heading !== '__CLOSING__';
            if (isNamed) sectionCounter++;
            return (
              <div key={i} id={isNamed ? `section-${sectionCounter - 1}` : undefined}>
                <BlogSection section={section} index={isNamed ? sectionCounter : i} />
              </div>
            );
          })}

          {/* Prev / Next navigation */}
          <div className="blog-nav">
            {prev ? (
              <button className="blog-nav-btn" onClick={() => navigate(`/blog/${prev.blogFile.replace('.txt','')}`)}>
                <span className="blog-nav-label">← Previous</span>
                <span className="blog-nav-title">{prev.name}</span>
              </button>
            ) : <div />}
            {next && (
              <button className="blog-nav-btn next" onClick={() => navigate(`/blog/${next.blogFile.replace('.txt','')}`)}>
                <span className="blog-nav-label">Next →</span>
                <span className="blog-nav-title">{next.name}</span>
              </button>
            )}
          </div>

          {/* Footer CTA */}
          <div className="blog-article-footer">
            <div className="blog-footer-divider" />
            <div className="blog-footer-content">
              <p className="blog-footer-text">Enjoyed this guide? Let our AI plan your trip.</p>
              <button className="btn-gold" onClick={() => navigate('/planner')}>✨ Build My Itinerary</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}