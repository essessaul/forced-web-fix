import React from "react";
import { Card } from "../components/common/ui";
import { useLanguage } from "../context/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div className="muted" style={{ letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, fontSize: 13 }}>
            {language === "es" ? "NOSOTROS" : "ABOUT US"}
          </div>
          <h1 className="page-title" style={{ marginBottom: ".5rem" }}>
            {language === "es" ? "PLAYA ESCONDIDA VACATION HOMES" : "PLAYA ESCONDIDA VACATION HOMES"}
          </h1>
          <div className="divider" />
        </div>
        <Card style={{ padding: "1rem" }}>
          <div className="property-card">
            <p className="muted" style={{ lineHeight: 1.8 }}>
              {language === "es"
                ? "Playa Escondida Vacation Homes fue creada para unir alquileres vacacionales, ventas directas, servicios al propietario y soporte personalizado en una sola plataforma de lujo frente al mar."
                : "Playa Escondida Vacation Homes is built to combine vacation rentals, direct sales, owner services, and personalized support in one luxury beachfront platform."}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
