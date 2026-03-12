/* eslint-env node */
// ─────────────────────────────────────────────────────────────────
//  server.js  —  Tiny Express backend for blog file uploads
//  Runs on port 3001 alongside Vite (port 5173)
//  Vite proxies /api/* → http://localhost:3001
// ─────────────────────────────────────────────────────────────────

import express    from "express";
import multer     from "multer";
import fs         from "fs";
import path       from "path";
import { fileURLToPath } from "url";
import dotenv     from "dotenv";

dotenv.config();

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const BLOGS_DIR  = path.join(__dirname, "public", "blogs");
const PASSWORD   = process.env.VITE_UPLOAD_PASSWORD;
const PORT       = 3001;

// Make sure /public/blogs/ exists
if (!fs.existsSync(BLOGS_DIR)) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

const app = express();

// ── Multer — store in memory, we'll write manually ────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (_req, file, cb) => {
    if (file.originalname.endsWith(".txt")) cb(null, true);
    else cb(new Error("Only .txt files are accepted"));
  },
});

// ── CORS — allow Vite dev server ──────────────────────────────────
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ── POST /api/upload-blog ─────────────────────────────────────────
app.post("/api/upload-blog", upload.single("blog"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file received." });
    }

    const filename = req.file.originalname;

    // ── Validate password in filename ─────────────────────────────
    // Format: placename-PASSWORD.txt  →  slug: "placename"
    const base  = filename.replace(/\.txt$/i, "");
    const parts = base.split("-");
    const last  = parts[parts.length - 1];

    if (!/^\d+$/.test(last)) {
      return res.status(403).json({
        success: false,
        error:   `No password in filename. Name your file: placename-${PASSWORD}.txt`,
      });
    }

    if (last !== PASSWORD) {
      return res.status(403).json({
        success: false,
        error:   `Wrong password "${last}". Check your VITE_UPLOAD_PASSWORD in .env`,
      });
    }

    const slug    = parts.slice(0, -1).join("-");
    const content = req.file.buffer.toString("utf-8");

    // ── Basic format check ────────────────────────────────────────
    if (!content.includes("TITLE:") || !content.includes("---")) {
      return res.status(400).json({
        success: false,
        error:   "Invalid format. File must contain TITLE: and --- separator.",
      });
    }

    // ── Parse meta for response ───────────────────────────────────
    const meta = {};
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (t === "---") break;
      const m = t.match(/^([A-Z_]+):\s*(.+)$/);
      if (m) meta[m[1]] = m[2].trim();
    }

    // ── Write file to /public/blogs/SLUG.txt ─────────────────────
    const destPath = path.join(BLOGS_DIR, `${slug}.txt`);
    fs.writeFileSync(destPath, content, "utf-8");

    console.log(`✅ Blog saved: /public/blogs/${slug}.txt`);

    return res.json({
      success: true,
      slug,
      filename: `${slug}.txt`,
      title:    meta.TITLE    || slug,
      cover:    meta.COVER    || null,
      category: meta.CATEGORY || null,
      readTime: meta.READ_TIME|| null,
      author:   meta.AUTHOR   || null,
      date:     meta.DATE     || null,
      path:     `/blogs/${slug}.txt`,
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/blogs — list all saved blogs ─────────────────────────
app.get("/api/blogs", (_req, res) => {
  try {
    const files = fs.readdirSync(BLOGS_DIR)
      .filter(f => f.endsWith(".txt"))
      .map(f => {
        const slug    = f.replace(".txt", "");
        const content = fs.readFileSync(path.join(BLOGS_DIR, f), "utf-8");
        const meta    = {};
        for (const line of content.split("\n")) {
          const t = line.trim();
          if (t === "---") break;
          const m = t.match(/^([A-Z_]+):\s*(.+)$/);
          if (m) meta[m[1]] = m[2].trim();
        }
        return {
          slug,
          title:    meta.TITLE    || slug,
          cover:    meta.COVER    || null,
          category: meta.CATEGORY || null,
          readTime: meta.READ_TIME|| null,
          author:   meta.AUTHOR   || null,
          date:     meta.DATE     || null,
        };
      });

    res.json({ success: true, blogs: files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Upload server running at http://localhost:${PORT}`);
  console.log(`📁 Saving blogs to: ${BLOGS_DIR}`);
  if (!PASSWORD) console.warn("⚠️  VITE_UPLOAD_PASSWORD not set in .env!");
});