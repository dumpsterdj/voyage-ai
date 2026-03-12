// ─────────────────────────────────────────────────────────────────
//  blogStorage.js
//  Manages blogs uploaded via the admin panel.
//  Uploaded blogs are stored in localStorage so they persist across
//  page refreshes without needing a backend.
//
//  Storage keys:
//    blog:index        → array of { slug, filename, uploadedAt, title, cover }
//    blog:content:{slug} → raw .txt content
// ─────────────────────────────────────────────────────────────────

const INDEX_KEY = "blog:index";

// ─── Read the index of all uploaded blogs ─────────────────────────
export function getUploadedIndex() {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ─── Save a new blog ──────────────────────────────────────────────
export function saveUploadedBlog(slug, filename, rawContent) {
  try {
    // Parse minimal meta for the index
    const meta = {};
    for (const line of rawContent.split('\n')) {
      const t = line.trim();
      if (t === '---') break;
      const m = t.match(/^([A-Z_]+):\s*(.+)$/);
      if (m) meta[m[1]] = m[2].trim();
    }

    // Save raw content
    localStorage.setItem(`blog:content:${slug}`, rawContent);

    // Update index
    const index   = getUploadedIndex();
    const existing = index.findIndex(b => b.slug === slug);
    const entry   = {
      slug,
      filename,
      uploadedAt: new Date().toISOString(),
      title:      meta.TITLE     || slug,
      cover:      meta.COVER     || null,
      category:   meta.CATEGORY  || null,
      readTime:   meta.READ_TIME || null,
      author:     meta.AUTHOR    || null,
      date:       meta.DATE      || null,
    };

    if (existing >= 0) index[existing] = entry;
    else index.unshift(entry); // newest first

    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return { success: true, entry };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── Get raw content of an uploaded blog ─────────────────────────
export function getUploadedBlogContent(slug) {
  return localStorage.getItem(`blog:content:${slug}`) || null;
}

// ─── Delete an uploaded blog ──────────────────────────────────────
export function deleteUploadedBlog(slug) {
  try {
    localStorage.removeItem(`blog:content:${slug}`);
    const index = getUploadedIndex().filter(b => b.slug !== slug);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    return true;
  } catch {
    return false;
  }
}

// ─── Check if a slug exists in uploaded blogs ─────────────────────
export function isUploadedBlog(slug) {
  return !!localStorage.getItem(`blog:content:${slug}`);
}

// ─── Extract slug from filename ───────────────────────────────────
//  "kerala-4829.txt"   → { slug: "kerala",        password: "4829" }
//  "spiti-valley.txt"  → { slug: "spiti-valley",  password: null   }
//  "rishikesh-9000.txt"→ { slug: "rishikesh",     password: "9000" }
export function parseFilename(filename) {
  // Strip .txt extension
  const base = filename.replace(/\.txt$/i, '');
  // Check if last segment is purely numeric
  const parts = base.split('-');
  const last  = parts[parts.length - 1];
  if (/^\d+$/.test(last)) {
    return {
      slug:     parts.slice(0, -1).join('-') || base,
      password: last,
    };
  }
  return { slug: base, password: null };
}