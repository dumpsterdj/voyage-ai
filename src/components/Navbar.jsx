import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          VOYAGE<em>AI</em>
        </NavLink>

        {/* Center Nav Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/destinations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Destinations
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Travel Chat
          </NavLink>
          <NavLink to="/planner" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Trip Planner
          </NavLink>
        </nav>

        {/* Right CTA */}
        <div className="navbar-right">
          <div className="ai-badge">
            <span className="ai-dot" />
            AI Active
          </div>
          <NavLink to="/planner" className="navbar-cta">
            Plan My Trip ✦
          </NavLink>
        </div>
      </div>
    </header>
  );
}