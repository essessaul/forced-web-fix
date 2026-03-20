import React from "react";
import { Card, Button, Badge } from "../components/common/ui";
import { Link } from "react-router-dom";

const saleListings = [
  {
    slug: "unit-ap-801",
    name: "UNIT AP-801",
    category: "BEACHFRONT APARTMENT",
    price: "$450,000",
    location: "PLAYA ESCONDIDA RESORT & MARINA",
    description: "Premium beachfront unit with strong lifestyle appeal and long-term value.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "villa-12",
    name: "VILLA 12",
    category: "LUXURY VILLA",
    price: "$895,000",
    location: "PLAYA ESCONDIDA RESORT & MARINA",
    description: "Large-format villa opportunity designed for high-end family use and ownership.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  }
];

export default function ForSalePage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div className="muted" style={{ letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 800, fontSize: 13 }}>
            SALE / UNIDADES EN VENTA
          </div>
          <h1 className="page-title" style={{ marginBottom: ".5rem" }}>PROPERTIES FOR SALE</h1>
          <div className="divider" />
        </div>

        <div className="listing-grid">
          {saleListings.map((item) => (
            <Card key={item.slug}>
              <div className="property-card">
                <img src={item.image} alt={item.name} />
                <div className="price-row" style={{ marginTop: 14, flexWrap: "wrap" }}>
                  <Badge>{item.category}</Badge>
                  <Badge>FOR SALE</Badge>
                </div>
                <h3 style={{ margin: "16px 0 8px" }}>{item.name}</h3>
                <div className="muted">{item.location}</div>
                <p className="muted" style={{ lineHeight: 1.7 }}>{item.description}</p>
                <div className="price-row" style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{item.price}</div>
                  <Link to="/login"><Button>REQUEST INFO</Button></Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
