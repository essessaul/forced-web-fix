import React from "react";
import { Card, Button } from "../components/common/ui";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { language } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div className="muted" style={{ letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, fontSize: 13 }}>
            {language === "es" ? "CONTACTO" : "CONTACT"}
          </div>
          <h1 className="page-title" style={{ marginBottom: ".5rem" }}>
            {language === "es" ? "PONTE EN CONTACTO" : "GET IN TOUCH"}
          </h1>
          <div className="divider" />
        </div>
        <div className="two-col">
          <Card style={{ padding: "1rem" }}>
            <div className="property-card">
              <h3>{language === "es" ? "DETALLES DE CONTACTO" : "CONTACT DETAILS"}</h3>
              <p className="muted">Phone: +507 6616-4212</p>
              <p className="muted">Email: saul@playa.com</p>
              <p className="muted">
                {language === "es" ? "WhatsApp disponible para consultas directas." : "WhatsApp available for direct inquiries."}
              </p>
            </div>
          </Card>
          <Card style={{ padding: "1rem" }}>
            <div className="property-card">
              <h3>{language === "es" ? "ENVIAR MENSAJE" : "SEND MESSAGE"}</h3>
              <div className="grid" style={{ marginTop: "1rem" }}>
                <input placeholder={language === "es" ? "NOMBRE" : "NAME"} />
                <input placeholder="EMAIL" />
                <textarea placeholder={language === "es" ? "MENSAJE" : "MESSAGE"} />
                <Button>{language === "es" ? "ENVIAR" : "SEND"}</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
