import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "../components/common/ui";
import { useLanguage } from "../context/LanguageContext";
import DateRangeFields from "../components/common/DateRangeFields";
import { starterProperties } from "../data/starterData";

function HeroSearch() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (checkIn) params.set("check_in", checkIn);
    if (checkOut) params.set("check_out", checkOut);
    if (guests) params.set("guests", guests);
    navigate(`/listings?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="search-box conversion-search-box">
      <div className="grid">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={language === "es" ? "DESTINO O ID DE PROPIEDAD" : "DESTINATION OR PROPERTY ID"}
        />

        <DateRangeFields
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          compact
        />

        <div className="hero-search-actions">
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder={language === "es" ? "HUÉSPEDES" : "GUESTS"}
            style={{ width: 160 }}
          />
          <Button type="submit">{language === "es" ? "BUSCAR" : "SEARCH"}</Button>
          <Link to="/listings"><Button type="button" variant="light">{language === "es" ? "VER ALQUILERES" : "VIEW RENTALS"}</Button></Link>
        </div>
      </div>
    </form>
  );
}

function TrustStrip() {
  const { language } = useLanguage();
  const items = language === "es"
    ? ["VENTAS DIRECTAS", "ATENCIÓN PERSONALIZADA", "PLAYA ESCONDIDA", "RESERVA RÁPIDA"]
    : ["DIRECT SALES", "PERSONALIZED SERVICE", "PLAYA ESCONDIDA", "FAST BOOKING"];

  return (
    <div className="hero-trust-strip">
      {items.map((item) => (
        <div key={item} className="hero-trust-item">{item}</div>
      ))}
    </div>
  );
}

function FeaturedPreview() {
  const { language } = useLanguage();
  const featured = starterProperties.slice(0, 3);

  return (
    <div className="hero-preview-grid">
      {featured.map((item) => (
        <Card key={item.slug} style={{ overflow: "hidden" }}>
          <div className="hero-preview-card">
            <img src={item.image} alt={item.name} />
            <div className="hero-preview-content">
              <div className="hero-preview-title">{item.name}</div>
              <div className="muted">{item.location}</div>
              <div className="hero-preview-meta">
                <span>{item.bedrooms} {language === "es" ? "HAB" : "BD"}</span>
                <span>{item.bathrooms} {language === "es" ? "BAÑOS" : "BA"}</span>
                <span>${item.rate}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="hero hero-conversion">
            <div className="hero-inner">
              <Badge>{language === "es" ? "VIDA DE LUJO FRENTE AL MAR" : "LUXURY BEACHFRONT LIVING"}</Badge>

              <h1 className="page-title">
                {language === "es"
                  ? "RENTA O COMPRA TU HOGAR IDEAL EN PLAYA ESCONDIDA"
                  : "RENT OR OWN YOUR DREAM HOME IN PLAYA ESCONDIDA"}
              </h1>

              <p className="hero-subtitle">
                {language === "es"
                  ? "Alquileres vacacionales, unidades en venta y atención directa con Saul Playa en una sola plataforma de alto nivel."
                  : "Vacation rentals, units for sale, and direct support from Saul Playa in one high-conversion luxury platform."}
              </p>

              <div className="hero-cta-row">
                <Link to="/listings"><Button>{language === "es" ? "RESERVAR AHORA" : "BOOK NOW"}</Button></Link>
                <Link to="/our-listings"><Button variant="light">{language === "es" ? "VER UNIDADES EN VENTA" : "SEE UNITS FOR SALE"}</Button></Link>
                <a href="tel:+50766164212"><Button variant="light">{language === "es" ? "LLAMAR A SAUL" : "CALL SAUL"}</Button></a>
              </div>

              <HeroSearch />

              <div className="hero-note-conversion">
                {language === "es"
                  ? "VENTAS DIRECTAS DE LA PROMOTORA · MEJOR ATENCIÓN · MEJOR PRECIO"
                  : "DIRECT SALES FROM THE PROMOTER · BEST SERVICE · BEST PRICE"}
              </div>
            </div>
          </div>

          <TrustStrip />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-heading">
            <div className="muted" style={{ letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, fontSize: 13 }}>
              {language === "es" ? "DESTACADOS" : "FEATURED"}
            </div>
            <h2 style={{ fontSize: "2rem", margin: ".5rem 0 0" }}>
              {language === "es" ? "UNIDADES QUE CONVIERTEN" : "HIGH-CONVERSION FEATURED INVENTORY"}
            </h2>
            <div className="divider" />
          </div>

          <FeaturedPreview />
        </div>
      </section>
    </>
  );
}
