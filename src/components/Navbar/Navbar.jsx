import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const routeLinks = [
  { label: "Inicio", to: "/" },
  { label: "Coches", to: "/catalogo" },
];

const anchorLinks = [
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Financiacion", href: "/#financiacion" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="logo__auto">AUTO</span>
          <span className="logo__select">SELECT</span>
          <span className="logo__sub">COCHES DE SEGUNDA MANO</span>
        </Link>

        {/* Nav links */}
        <nav className={`navbar__links ${menuOpen ? "open" : ""}`}>
          {routeLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar__link ${isActive ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {anchorLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Phone CTA */}
        <a href="tel:600123456" className="navbar__cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.68 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 1.27h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.18 6.18l.91-.91a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          600 123 456
        </a>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
