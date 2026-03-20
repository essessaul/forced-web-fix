import React, { useMemo, useState } from "react";
import { Button, Card } from "../components/common/ui";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PropertyManager from "../components/admin/PropertyManager";
import BookingManager from "../components/admin/BookingManager";
import WorkflowManager from "../components/admin/WorkflowManager";
import { useLanguage } from "../context/LanguageContext";
import OperationalCriteriaCard from "../components/admin/OperationalCriteriaCard";

function Overview() {
  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <div className="admin-stat-grid">
        {[
          ["LIVE CRUD", "READY"],
          ["IMAGE UPLOAD", "READY"],
          ["ROLE PERMISSIONS", "READY"],
          ["WORKFLOWS", "READY"],
        ].map(([label, value]) => (
          <Card key={label} style={{ padding: "1rem" }}>
            <div className="admin-stat-card">
              <div className="muted admin-kicker">{label}</div>
              <div className="admin-stat-value">{value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="two-col">
        <Card style={{ padding: "1rem" }}>
          <div className="admin-kicker">RENTALS</div>
          <h3 style={{ margin: ".35rem 0 0" }}>Airbnb-style production controls</h3>
          <p className="muted" style={{ lineHeight: 1.8, marginTop: ".85rem" }}>
            Create, update, and delete rental inventory with nightly pricing, cleaning fees, minimum nights, guest limits, image uploads, and booking persistence.
          </p>
        </Card>
        <Card style={{ padding: "1rem" }}>
          <div className="admin-kicker">REAL ESTATE</div>
          <h3 style={{ margin: ".35rem 0 0" }}>Dedicated for-sale inventory</h3>
          <p className="muted" style={{ lineHeight: 1.8, marginTop: ".85rem" }}>
            Manage sale listings separately from rentals with pricing, beds, baths, square meters, parking, levels, images, and realtor workflows.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { language } = useLanguage();
  const tabs = useMemo(() => ([
    { id: "overview", label: language === "es" ? "RESUMEN" : "OVERVIEW" },
    { id: "rentals", label: language === "es" ? "CRUD ALQUILERES" : "RENTAL CRUD" },
    { id: "sales", label: language === "es" ? "CRUD VENTAS" : "SALE CRUD" },
    { id: "bookings", label: language === "es" ? "RESERVAS" : "BOOKINGS" },
    { id: "workflows", label: language === "es" ? "FLUJOS" : "WORKFLOWS" },
  ]), [language]);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <ProtectedRoute requireAdmin>
      <section className="section">
        <div className="container">
          <div className="admin-shell">
            <aside className="admin-sidebar">
              <div className="admin-brand-card">
                <div className="admin-kicker">PLATFORM</div>
                <h2 style={{ margin: ".35rem 0 0" }}>REAL ADMIN SYSTEM</h2>
                <p className="muted" style={{ lineHeight: 1.7, marginTop: ".85rem" }}>
                  {language === "es"
                    ? "CRUD en vivo con Supabase, permisos por rol, carga de imágenes, reservas persistentes y flujos de propietario / corredor."
                    : "Live CRUD with Supabase, role permissions, image uploads, booking persistence, and owner / realtor workflows."}
                </p>
              </div>

              <div className="admin-tab-list">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`admin-tab-button ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            <div className="admin-content">
              <div className="admin-page-header">
                <div>
                  <div className="admin-kicker">
                    {language === "es" ? "PLATAFORMA DE PRODUCCIÓN" : "PRODUCTION PLATFORM"}
                  </div>
                  <h1 style={{ margin: ".4rem 0 0" }}>
                    {language === "es" ? "ADMINISTRACIÓN EN VIVO" : "LIVE ADMINISTRATION"}
                  </h1>
                </div>
                <div className="inline" style={{ gap: ".7rem", flexWrap: "wrap" }}>
                  <Button variant="light">SUPABASE</Button>
                  <Button>LIVE MODE</Button>
                </div>
              </div>

              {activeTab === "overview" ? <Overview /> : null}
              {activeTab === "rentals" ? <PropertyManager listingType="rental" title="Rental inventory CRUD" /> : null}
              {activeTab === "sales" ? <PropertyManager listingType="sale" title="Sale listings CRUD" /> : null}
              {activeTab === "bookings" ? <BookingManager /> : null}
              {activeTab === "workflows" ? <WorkflowManager /> : null}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
