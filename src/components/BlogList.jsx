// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { destinations } from "../data/destinations.js";
// import { getUploadedIndex } from "../services/blogStorage.js";
// import "./BlogList.css";

// // Fetch meta (first few lines only) from a blog txt file
// async function fetchBlogMeta(filename) {
//   try {
//     const res  = await fetch(`/blogs/${filename}`);
//     if (!res.ok) return null;
//     const text = await res.text();
//     const meta = {};
//     for (const line of text.split('\n')) {
//       const t = line.trim();
//       if (t === '---') break;
//       const m = t.match(/^([A-Z_]+):\s*(.+)$/);
//       if (m) meta[m[1]] = m[2].trim();
//     }
//     return meta;
//   } catch {
//     return null;
//   }
// }

// export default function BlogList() {
//   const [posts,   setPosts]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const run = async () => {
//       // 1. Static blogs from destinations.js + /public/blogs/
//       const blogged = destinations.filter(d => d.blogFile);
//       const staticPosts = await Promise.all(
//         blogged.map(async d => {
//           const meta = await fetchBlogMeta(d.blogFile);
//           return meta ? { dest: d, meta, source: 'static' } : null;
//         })
//       );

//       // 2. Uploaded blogs from localStorage
//       const uploaded = getUploadedIndex();
//       const uploadedPosts = uploaded.map(entry => ({
//         dest: {
//           id:           `uploaded-${entry.slug}`,
//           name:         entry.title,
//           blogFile:     `${entry.slug}.txt`,
//           image:        entry.cover || null,
//           instagramUrl: null,
//         },
//         meta: {
//           TITLE:      entry.title,
//           AUTHOR:     entry.author,
//           DATE:       entry.date,
//           COVER:      entry.cover,
//           CATEGORY:   entry.category,
//           READ_TIME:  entry.readTime,
//         },
//         source: 'uploaded',
//         uploadedAt: entry.uploadedAt,
//       }));

//       // 3. Merge — uploaded posts go first (newest), then static
//       //    Deduplicate by slug (uploaded overrides static)
//       const staticSlugs = new Set(uploadedPosts.map(p => p.dest.blogFile.replace('.txt', '')));
//       const filteredStatic = staticPosts.filter(p => p && !staticSlugs.has(p.dest.blogFile.replace('.txt', '')));
//       const allPosts = [...uploadedPosts, ...filteredStatic].filter(Boolean);

//       setPosts(allPosts);
//       setLoading(false);
//     };
//     run();
//   }, []);

//   if (loading) {
//     return (
//       <div className="bloglist-loading">
//         <div className="spin" />
//         <p>Loading travel stories...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bloglist-page">
//       {/* Hero */}
//       <div className="bloglist-hero">
//         <p className="hero-eyebrow">Travel Stories</p>
//         <h1 className="hero-title" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
//           Stories From <em>The Road</em>
//         </h1>
//         <p className="hero-sub" style={{ maxWidth: 480 }}>
//           First-hand accounts, honest tips, and the kind of travel writing
//           that makes you want to book a ticket right now.
//         </p>
//       </div>

//       <div className="container">
//         {posts.length === 0 ? (
//           <div className="bloglist-empty">
//             <div style={{ fontSize: 48 }}>✍️</div>
//             <p>No blog posts yet. Add .txt files to <code>/public/blogs/</code></p>
//           </div>
//         ) : (
//           <div className="bloglist-grid">
//             {/* Featured first post */}
//             {posts[0] && (
//               <article
//                 className="blog-card featured"
//                 onClick={() => navigate(`/blog/${posts[0].dest.blogFile.replace('.txt', '')}`)}
//               >
//                 <div className="blog-card-img-wrap">
//                   <img src={posts[0].meta.COVER || posts[0].dest.image} alt={posts[0].meta.TITLE} className="blog-card-img" />
//                   <div className="blog-card-overlay" />
//                   <span className="blog-card-badge featured-badge">✦ Featured</span>
//                 </div>
//                 <div className="blog-card-body">
//                   <div className="blog-card-meta">
//                     {posts[0].meta.CATEGORY && <span className="blog-card-cat">{posts[0].meta.CATEGORY}</span>}
//                     {posts[0].meta.READ_TIME && <span className="blog-card-time">⏱ {posts[0].meta.READ_TIME}</span>}
//                     {posts[0].meta.DATE && <span className="blog-card-date">{posts[0].meta.DATE}</span>}
//                   </div>
//                   <h2 className="blog-card-title">{posts[0].meta.TITLE}</h2>
//                   <p className="blog-card-author">✦ {posts[0].meta.AUTHOR}</p>
//                   <div className="blog-card-cta">Read Story →</div>
//                 </div>
//               </article>
//             )}

//             {/* Rest of the posts */}
//             <div className="bloglist-sub-grid">
//               {posts.slice(1).map(({ dest, meta }) => (
//                 <article
//                   key={dest.id}
//                   className="blog-card"
//                   onClick={() => navigate(`/blog/${dest.blogFile.replace('.txt', '')}`)}
//                 >
//                   <div className="blog-card-img-wrap small">
//                     <img src={meta.COVER || dest.image} alt={meta.TITLE} className="blog-card-img" />
//                     <div className="blog-card-overlay" />
//                     {meta.CATEGORY && <span className="blog-card-badge">{meta.CATEGORY.split('·')[0].trim()}</span>}
//                   </div>
//                   <div className="blog-card-body">
//                     <div className="blog-card-meta">
//                       {meta.READ_TIME && <span className="blog-card-time">⏱ {meta.READ_TIME}</span>}
//                       {meta.DATE && <span className="blog-card-date">{meta.DATE}</span>}
//                     </div>
//                     <h3 className="blog-card-title small">{meta.TITLE}</h3>
//                     <p className="blog-card-author">✦ {meta.AUTHOR}</p>
//                     <div className="blog-card-cta small">Read →</div>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations.js";
import "./BlogList.css";

// Removed: fetchBlogMeta, getUploadedIndex (now server handles everything)

export default function BlogList() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // Fetch ALL blogs from the server (reads actual /public/blogs/ folder)
        const res  = await fetch("/api/blogs");
        const data = await res.json();

        if (!data.success) throw new Error(data.error);

        // Match each blog slug back to a destination for the image/card info
        const posts = data.blogs.map(blog => {
          const dest = destinations.find(
            d => d.blogFile === `${blog.slug}.txt`
          ) || {
            // Fallback for uploaded blogs not in destinations.js
            id:           blog.slug,
            name:         blog.title,
            blogFile:     `${blog.slug}.txt`,
            image:        blog.cover || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
            instagramUrl: null,
          };

          return { dest, meta: {
            TITLE:      blog.title,
            AUTHOR:     blog.author,
            DATE:       blog.date,
            COVER:      blog.cover,
            CATEGORY:   blog.category,
            READ_TIME:  blog.readTime,
          }};
        });

        setPosts(posts);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <div className="bloglist-loading">
        <div className="spin" />
        <p>Loading travel stories...</p>
      </div>
    );
  }

  return (
    <div className="bloglist-page">
      {/* Hero */}
      <div className="bloglist-hero">
        <p className="hero-eyebrow">Travel Stories</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
          Stories From <em>The Road</em>
        </h1>
        <p className="hero-sub" style={{ maxWidth: 480 }}>
          First-hand accounts, honest tips, and the kind of travel writing
          that makes you want to book a ticket right now.
        </p>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <div className="bloglist-empty">
            <div style={{ fontSize: 48 }}>✍️</div>
            <p>No blog posts yet. Add .txt files to <code>/public/blogs/</code></p>
          </div>
        ) : (
          <div className="bloglist-grid">
            {/* Featured first post */}
            {posts[0] && (
              <article
                className="blog-card featured"
                onClick={() => navigate(`/blog/${posts[0].dest.blogFile.replace('.txt', '')}`)}
              >
                <div className="blog-card-img-wrap">
                  <img src={posts[0].meta.COVER || posts[0].dest.image} alt={posts[0].meta.TITLE} className="blog-card-img" />
                  <div className="blog-card-overlay" />
                  <span className="blog-card-badge featured-badge">✦ Featured</span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {posts[0].meta.CATEGORY && <span className="blog-card-cat">{posts[0].meta.CATEGORY}</span>}
                    {posts[0].meta.READ_TIME && <span className="blog-card-time">⏱ {posts[0].meta.READ_TIME}</span>}
                    {posts[0].meta.DATE && <span className="blog-card-date">{posts[0].meta.DATE}</span>}
                  </div>
                  <h2 className="blog-card-title">{posts[0].meta.TITLE}</h2>
                  <p className="blog-card-author">✦ {posts[0].meta.AUTHOR}</p>
                  <div className="blog-card-cta">Read Story →</div>
                </div>
              </article>
            )}

            {/* Rest of the posts */}
            <div className="bloglist-sub-grid">
              {posts.slice(1).map(({ dest, meta }) => (
                <article
                  key={dest.id}
                  className="blog-card"
                  onClick={() => navigate(`/blog/${dest.blogFile.replace('.txt', '')}`)}
                >
                  <div className="blog-card-img-wrap small">
                    <img src={meta.COVER || dest.image} alt={meta.TITLE} className="blog-card-img" />
                    <div className="blog-card-overlay" />
                    {meta.CATEGORY && <span className="blog-card-badge">{meta.CATEGORY.split('·')[0].trim()}</span>}
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      {meta.READ_TIME && <span className="blog-card-time">⏱ {meta.READ_TIME}</span>}
                      {meta.DATE && <span className="blog-card-date">{meta.DATE}</span>}
                    </div>
                    <h3 className="blog-card-title small">{meta.TITLE}</h3>
                    <p className="blog-card-author">✦ {meta.AUTHOR}</p>
                    <div className="blog-card-cta small">Read →</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}