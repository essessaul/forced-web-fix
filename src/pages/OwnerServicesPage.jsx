import React from "react";
import { Card } from "../components/common/ui";

export default function OwnerServicesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div className="muted" style={{ letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, fontSize: 13 }}>
            OWNER SERVICES
          </div>
          <h1 className="page-title" style={{ marginBottom: ".5rem" }}>OWNER PORTAL OVERVIEW</h1>
          <div className="divider" />
        </div>

        <div className="two-col">
          <Card style={{ padding: "1rem" }}>
            <div className="property-card">
              <h3>REVENUE REPORTING</h3>
              <p className="muted">Track occupancy, payouts, statements, and reservations for your unit.</p>
            </div>
          </Card>
          <Card style={{ padding: "1rem" }}>
            <div className="property-card">
              <h3>OWNER ACCESS</h3>
              <p className="muted">Each listing can have its own access credentials and owner management flow.</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
