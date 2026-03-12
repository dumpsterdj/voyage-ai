import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveUploadedBlog,
  getUploadedIndex,
  deleteUploadedBlog,
  parseFilename,
} from "../services/blogStorage";
import "./AdminUpload.css";

const UPLOAD_PASSWORD = import.meta.env.VITE_UPLOAD_PASSWORD;

// ─── Status badge ─────────────────────────────────────────────────
function StatusBadge({ type, children }) {
  return <div className={`status-badge status-${type}`}>{children}</div>;
}

// ─── Uploaded blog row ────────────────────────────────────────────
function BlogRow({ entry, onDelete, onPreview }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="blog-row">
      <div className="blog-row-cover">
        {entry.cover
          ? <img src={entry.cover} alt={entry.title} />
          : <span>📄</span>}
      </div>
      <div className="blog-row-info">
        <div className="blog-row-title">{entry.title}</div>
        <div className="blog-row-meta">
          <span className="br-slug">/{entry.slug}</span>
          {entry.category && <span className="br-cat">{entry.category.split('·')[0].trim()}</span>}
          {entry.date && <span className="br-date">{entry.date}</span>}
          <span className="br-uploaded">
            Uploaded {new Date(entry.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      <div className="blog-row-actions">
        <button className="br-btn preview" onClick={() => onPreview(entry.slug)}>
          👁 Preview
        </button>
        {confirming ? (
          <>
            <button className="br-btn confirm-del" onClick={() => { onDelete(entry.slug); setConfirming(false); }}>
              Confirm Delete
            </button>
            <button className="br-btn cancel" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="br-btn delete" onClick={() => setConfirming(true)}>🗑</button>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────
export default function AdminUpload() {
  const navigate = useNavigate();

  // Auth gate
  const [authed,     setAuthed]     = useState(false);
  const [authInput,  setAuthInput]  = useState("");
  const [authError,  setAuthError]  = useState(false);

  // Upload state
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [result,     setResult]     = useState(null); // { type: 'success'|'error', message, slug? }
  const [blogs,      setBlogs]      = useState(() => getUploadedIndex());

  const fileInputRef = useRef(null);

  // ── Auth ──────────────────────────────────────────────────────
  const handleAuth = () => {
    if (authInput === UPLOAD_PASSWORD) {
      setAuthed(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setAuthInput("");
    }
  };

  // ── Process file ──────────────────────────────────────────────
  const processFile = useCallback(async (file) => {
    setResult(null);
    setUploading(true);

    // Must be .txt
    if (!file.name.endsWith('.txt')) {
      setResult({ type: 'error', message: '❌ Only .txt files are accepted.' });
      setUploading(false);
      return;
    }

    // Parse filename for password
    const { slug, password } = parseFilename(file.name);

    // Validate password in filename
    if (!password) {
      setResult({
        type: 'error',
        message: `❌ No password found in filename.\n\nFile must be named: placename-${UPLOAD_PASSWORD}.txt\nExample: rishikesh-${UPLOAD_PASSWORD}.txt`,
      });
      setUploading(false);
      return;
    }

    if (password !== UPLOAD_PASSWORD) {
      setResult({
        type: 'error',
        message: `❌ Wrong password in filename.\n\nExpected: placename-${UPLOAD_PASSWORD}.txt\nGot password: "${password}"`,
      });
      setUploading(false);
      return;
    }

    // Read file content
    const rawContent = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsText(file);
    });

    // Basic format check
    if (!rawContent.includes('TITLE:') || !rawContent.includes('---')) {
      setResult({
        type: 'error',
        message: '❌ Invalid format. File must contain TITLE: and --- separator.\n\nCheck the blog.txt format guide below.',
      });
      setUploading(false);
      return;
    }

    // Save to localStorage
    const save = saveUploadedBlog(slug, file.name, rawContent);

    if (save.success) {
      setBlogs(getUploadedIndex());
      setResult({
        type: 'success',
        message: `✅ "${save.entry.title}" published successfully!\n\nAvailable at: /blog/${slug}`,
        slug,
      });
    } else {
      setResult({ type: 'error', message: `❌ Save failed: ${save.error}` });
    }

    setUploading(false);
  }, []);

  // ── Drag & drop ───────────────────────────────────────────────
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDelete = (slug) => {
    deleteUploadedBlog(slug);
    setBlogs(getUploadedIndex());
  };

  // ── Auth screen ───────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-card">
          <div className="admin-lock-icon">🔐</div>
          <h2 className="admin-auth-title">Admin Access</h2>
          <p className="admin-auth-sub">Enter your admin password to continue</p>
          <input
            className={`admin-auth-input ${authError ? 'error' : ''}`}
            type="password"
            placeholder="Enter password..."
            value={authInput}
            onChange={e => { setAuthInput(e.target.value); setAuthError(false); }}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            autoFocus
          />
          {authError && <div className="admin-auth-error">⚠ Incorrect password</div>}
          <button className="btn-gold" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            onClick={handleAuth}>
            Unlock Admin Panel
          </button>
          <button className="btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            onClick={() => navigate('/')}>
            ← Back to Site
          </button>
        </div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">Admin Panel</div>
          <h1 className="admin-title">Blog Manager</h1>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">🔓 Authenticated</span>
          <button className="btn-ghost" onClick={() => navigate('/')}>← Back to Site</button>
        </div>
      </div>

      <div className="admin-layout">
        {/* ── Upload Section ── */}
        <section className="admin-section">
          <h2 className="admin-section-title">Upload Blog Post</h2>

          {/* Drop zone */}
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef} type="file" accept=".txt"
              style={{ display: 'none' }} onChange={onFileSelect}
            />
            {uploading ? (
              <>
                <div className="spin" style={{ width: 36, height: 36 }} />
                <p className="dz-text">Processing file...</p>
              </>
            ) : (
              <>
                <div className="dz-icon">{dragging ? '📂' : '📄'}</div>
                <p className="dz-text">
                  {dragging ? 'Drop to upload' : 'Drag & drop your .txt file here'}
                </p>
                <p className="dz-sub">or click to browse</p>
                <div className="dz-format-hint">
                  Filename format: <code>placename-{UPLOAD_PASSWORD}.txt</code>
                </div>
              </>
            )}
          </div>

          {/* Result message */}
          {result && (
            <div className={`upload-result ${result.type}`}>
              <pre className="result-msg">{result.message}</pre>
              {result.type === 'success' && result.slug && (
                <button className="btn-gold" style={{ marginTop: 12 }}
                  onClick={() => navigate(`/blog/${result.slug}`)}>
                  View Published Post →
                </button>
              )}
            </div>
          )}

          {/* Format guide */}
          <div className="format-guide">
            <div className="fg-title">📋 Required .txt Format</div>
            <pre className="fg-code">{`TITLE: Your Blog Title Here
AUTHOR: Your Name
DATE: March 2026
COVER: https://image-url.com/photo.jpg
CATEGORY: India · Region · Theme
READ_TIME: 5 min read
---
INTRO:
Your opening paragraph(s)...
---
SECTION: Day 1 — Morning
Content for this section...
---
SECTION: Day 2 — Afternoon
More content...
---
CLOSING:
Your final thoughts...
---
TAGS: India, City, Heritage, Food`}
            </pre>
            <div className="fg-note">
              💡 Save file as <strong>placename-{UPLOAD_PASSWORD}.txt</strong> where <strong>{UPLOAD_PASSWORD}</strong> is your upload password.
              <br />Example: <code>varanasi-{UPLOAD_PASSWORD}.txt</code> → published at <code>/blog/varanasi</code>
            </div>
          </div>
        </section>

        {/* ── Published Blogs ── */}
        <section className="admin-section">
          <h2 className="admin-section-title">
            Published Blogs
            <span className="admin-count">{blogs.length}</span>
          </h2>

          {blogs.length === 0 ? (
            <div className="admin-empty">
              <span style={{ fontSize: 36 }}>✍️</span>
              <p>No blogs uploaded yet. Upload your first .txt file above.</p>
            </div>
          ) : (
            <div className="blogs-list">
              {blogs.map(entry => (
                <BlogRow
                  key={entry.slug}
                  entry={entry}
                  onDelete={handleDelete}
                  onPreview={(slug) => navigate(`/blog/${slug}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}