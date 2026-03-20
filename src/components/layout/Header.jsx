import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useLanguage } from "../../context/LanguageContext";

export default function Header() {
  const [shrunk, setShrunk] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setShrunk(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabel = {
    home: "HOME",
    rentals: language === "es" ? "ALQUILERES VACACIONALES" : "VACATION RENTALS",
    listings: language === "es" ? "NUESTROS LISTADOS" : "OUR LISTINGS",
    login: language === "es" ? "INGRESAR / REGISTRARSE" : "LOG IN / SIGN UP",
    about: language === "es" ? "NOSOTROS" : "ABOUT US",
    contact: language === "es" ? "CONTACTO" : "CONTACT",
  };

  return (
    <header className={`site-header luxury-header elite-header ${shrunk ? "is-shrunk elite-solid" : "elite-transparent"}`}>
      <div className="container luxury-header-shell">
        <div className="luxury-header-left">
          <Link to="/" className="luxury-logo-wrap">
            <img src={logo} alt="Playa Escondida Vacation Homes" className="logo luxury-logo" />
          </Link>
        </div>

        <div className="luxury-header-center">
          <nav className="nav-links luxury-nav luxury-nav-centered">
            <NavLink to="/" end className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.home}
            </NavLink>
            <NavLink to="/listings" className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.rentals}
            </NavLink>
            <NavLink to="/our-listings" className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.listings}
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.login}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.about}
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `luxury-nav-link ${isActive ? "active-luxury-link" : ""}`}>
              {navLabel.contact}
            </NavLink>
          </nav>
        </div>

        <div className="luxury-header-right">
          <div className="header-actions luxury-header-actions">
            <a href="tel:+50766164212" className="icon-btn glow-call-btn" aria-label="Call">📞</a>
            <a href="mailto:saul@playa.com" className="icon-btn" aria-label="Email">✉️</a>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: 126 }}>
              <option value="en">ENGLISH</option>
              <option value="es">ESPAÑOL</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
