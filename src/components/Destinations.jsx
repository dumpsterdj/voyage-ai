// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { destinations, categories } from "../data/destinations.js";
// import "./Destinations.css";

// function Stars({ rating }) {
//   return (
//     <div className="stars">
//       {[1,2,3,4,5].map(i => (
//         <span key={i} className={`star ${i <= Math.floor(rating) ? "filled" : ""}`}>★</span>
//       ))}
//       <span className="rating-num">{rating.toFixed(1)}</span>
//     </div>
//   );
// }

// function DestCard({ dest, onReadBlog, onPlan }) {
//   const [imgLoaded, setImgLoaded] = useState(false);
//   const [hovered,   setHovered]   = useState(false);
//   const hasBlog = !!dest.blogFile;

//   return (
//     <article
//       className={`dest-card ${hovered ? "hovered" : ""}`}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Image */}
//       <div className="dest-img-wrap">
//         {!imgLoaded && <div className="dest-img-skeleton" />}
//         <img
//           src={dest.image} alt={dest.name}
//           className={`dest-img ${imgLoaded ? "loaded" : ""}`}
//           onLoad={() => setImgLoaded(true)}
//         />
//         <div className="dest-img-overlay" />
//         <span className="dest-category-badge">{dest.category}</span>

//         {dest.instagramUrl && !dest.instagramUrl.includes("YOUR_POST") && (
//           <a href={dest.instagramUrl} target="_blank" rel="noopener noreferrer"
//             className="dest-ig-btn" onClick={e => e.stopPropagation()} title="View on Instagram">
//             <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
//               <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//             </svg>
//             Instagram
//           </a>
//         )}
//       </div>

//       {/* Body */}
//       <div className="dest-body">
//         <div className="dest-location">
//           <span className="dest-dot">✦</span>
//           {dest.region}, {dest.country}
//         </div>
//         <h3 className="dest-name">{dest.name}</h3>
//         <p className="dest-tagline">{dest.tagline}</p>
//         <p className="dest-desc">{dest.description}</p>

//         <div className="dest-meta">
//           <span className="dest-meta-item">📅 {dest.bestTime}</span>
//           <span className="dest-meta-item">⏱ {dest.duration}</span>
//           <span className="dest-meta-item">💰 {dest.budget}</span>
//         </div>

//         <div className="dest-footer">
//           <Stars rating={dest.rating} />
//           <div className="dest-tags">
//             {dest.tags.slice(0, 2).map(t => <span key={t} className="dest-tag">{t}</span>)}
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="dest-actions">
//           {hasBlog ? (
//             <button className="dest-btn-blog" onClick={() => onReadBlog(dest)}>
//               📖 Read Blog
//             </button>
//           ) : (
//             <span className="dest-btn-no-blog">✍️ Blog coming soon</span>
//           )}
//           <button className="dest-btn-plan" onClick={() => onPlan(dest.name)}>
//             ✨ Plan Trip
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }

// export default function Destinations() {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [search,         setSearch]         = useState("");
//   const navigate = useNavigate();

//   const filtered = destinations.filter(d => {
//     const matchCat    = activeCategory === "All" || d.category === activeCategory;
//     const matchSearch = !search ||
//       d.name.toLowerCase().includes(search.toLowerCase()) ||
//       d.region.toLowerCase().includes(search.toLowerCase()) ||
//       d.country.toLowerCase().includes(search.toLowerCase()) ||
//       d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
//     return matchCat && matchSearch;
//   });

//   const handleReadBlog = (dest) => {
//     navigate(`/blog/${dest.blogFile.replace('.txt', '')}`);
//   };

//   const handlePlan = (name) => {
//     navigate(`/planner?destination=${encodeURIComponent(name)}`);
//   };

//   return (
//     <div className="dest-page">
//       <div className="dest-hero">
//         <p className="hero-eyebrow">Hand-picked by our advisor</p>
//         <h1 className="hero-title" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
//           Places Worth <em>Every Mile</em>
//         </h1>
//         <p className="hero-sub" style={{ maxWidth: 480 }}>
//           Real destinations, real photos, real stories — curated from our
//           travel advisor's own journeys.
//         </p>

//         <div className="dest-search-wrap">
//           <span className="dest-search-icon">🔍</span>
//           <input
//             className="dest-search"
//             placeholder="Search destinations, regions, or experiences..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="container">
//         {/* Filters */}
//         <div className="dest-filters">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
//               onClick={() => setActiveCategory(cat)}
//             >
//               {cat}
//               {cat !== "All" && (
//                 <span className="filter-count">
//                   {destinations.filter(d => d.category === cat).length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         <div className="dest-results-count">
//           {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
//           {search && ` matching "${search}"`}
//           {" · "}
//           {filtered.filter(d => d.blogFile).length} with travel blogs
//         </div>

//         {filtered.length > 0 ? (
//           <div className="dest-grid">
//             {filtered.map(dest => (
//               <DestCard
//                 key={dest.id}
//                 dest={dest}
//                 onReadBlog={handleReadBlog}
//                 onPlan={handlePlan}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="dest-empty">
//             <div style={{ fontSize: 48 }}>🗺️</div>
//             <p>No destinations match your search.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { destinations, categories } from "../data/destinations.js";
import "./Destinations.css";

// Fetch all available blog slugs from the server
async function fetchAvailableSlugs() {
  try {
    const res  = await fetch("/api/blogs");
    const data = await res.json();
    if (!data.success) return new Set();
    return new Set(data.blogs.map(b => b.slug));
  } catch {
    return new Set();
  }
}

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= Math.floor(rating) ? "filled" : ""}`}>★</span>
      ))}
      <span className="rating-num">{rating.toFixed(1)}</span>
    </div>
  );
}

function DestCard({ dest, hasBlog, onReadBlog, onPlan }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered,   setHovered]   = useState(false);

  return (
    <article
      className={`dest-card ${hovered ? "hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="dest-img-wrap">
        {!imgLoaded && <div className="dest-img-skeleton" />}
        <img
          src={dest.image} alt={dest.name}
          className={`dest-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="dest-img-overlay" />
        <span className="dest-category-badge">{dest.category}</span>

        {dest.instagramUrl && !dest.instagramUrl.includes("YOUR_POST") && (
          <a href={dest.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="dest-ig-btn" onClick={e => e.stopPropagation()} title="View on Instagram">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </a>
        )}
      </div>

      {/* Body */}
      <div className="dest-body">
        <div className="dest-location">
          <span className="dest-dot">✦</span>
          {dest.region}, {dest.country}
        </div>
        <h3 className="dest-name">{dest.name}</h3>
        <p className="dest-tagline">{dest.tagline}</p>
        <p className="dest-desc">{dest.description}</p>

        <div className="dest-meta">
          <span className="dest-meta-item">📅 {dest.bestTime}</span>
          <span className="dest-meta-item">⏱ {dest.duration}</span>
          <span className="dest-meta-item">💰 {dest.budget}</span>
        </div>

        <div className="dest-footer">
          <Stars rating={dest.rating} />
          <div className="dest-tags">
            {dest.tags.slice(0, 2).map(t => <span key={t} className="dest-tag">{t}</span>)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="dest-actions">
          {hasBlog ? (
            <button className="dest-btn-blog" onClick={() => onReadBlog(dest)}>
              📖 Read Blog
            </button>
          ) : (
            <span className="dest-btn-no-blog">✍️ Blog coming soon</span>
          )}
          <button className="dest-btn-plan" onClick={() => onPlan(dest.name)}>
            ✨ Plan Trip
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Destinations() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search,         setSearch]         = useState("");
  const [availableSlugs, setAvailableSlugs] = useState(new Set());
  const navigate = useNavigate();

  // Load which blog slugs actually exist on the server
  useEffect(() => {
    fetchAvailableSlugs().then(setAvailableSlugs);
  }, []);

  const filtered = destinations.filter(d => {
    const matchCat    = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.region.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleReadBlog = (dest) => {
    // Use blogFile slug if available, otherwise slugify the name
    const slug = dest.blogFile
      ? dest.blogFile.replace('.txt', '')
      : dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/blog/${slug}`);
  };

  const handlePlan = (name) => {
    navigate(`/planner?destination=${encodeURIComponent(name)}`);
  };

  return (
    <div className="dest-page">
      <div className="dest-hero">
        <p className="hero-eyebrow">Hand-picked by our advisor</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(40px, 6vw, 76px)" }}>
          Places Worth <em>Every Mile</em>
        </h1>
        <p className="hero-sub" style={{ maxWidth: 480 }}>
          Real destinations, real photos, real stories — curated from our
          travel advisor's own journeys.
        </p>

        <div className="dest-search-wrap">
          <span className="dest-search-icon">🔍</span>
          <input
            className="dest-search"
            placeholder="Search destinations, regions, or experiences..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="dest-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== "All" && (
                <span className="filter-count">
                  {destinations.filter(d => d.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="dest-results-count">
          {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {" · "}
          {filtered.filter(d => d.blogFile).length} with travel blogs
        </div>

        {filtered.length > 0 ? (
          <div className="dest-grid">
            {filtered.map(dest => (
              <DestCard
                key={dest.id}
                dest={dest}
                hasBlog={availableSlugs.has(dest.blogFile?.replace('.txt','') || '')}
                onReadBlog={handleReadBlog}
                onPlan={handlePlan}
              />
            ))}
          </div>
        ) : (
          <div className="dest-empty">
            <div style={{ fontSize: 48 }}>🗺️</div>
            <p>No destinations match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}