import React from "react";
import { Card } from "../common/ui";

export default function OperationalCriteriaCard() {
  return (
    <Card style={{ padding: "1rem" }}>
      <div className="admin-kicker">OPERATIONAL CRITERIA</div>
      <div className="two-col" style={{ marginTop: "1rem" }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Rentals</h3>
          <div className="option-chip-grid">
            {[
              "Nightly Rate","Weekend Rate","Weekly Rate","Monthly Rate","Cleaning Fee","Damage Deposit",
              "Extra Guest Fee","Min Nights","Max Nights","Max Guests","Instant Book","Check-in Time",
              "Check-out Time","Cancellation Policy","House Rules","Seasonal Pricing","Blocked Dates","Channel Sync"
            ].map((x) => <div key={x} className="real-estate-chip">{x}</div>)}
          </div>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Real Estate</h3>
          <div className="option-chip-grid">
            {[
              "Bedrooms","Bathrooms","Sq Meters","Sq Feet","Parking","Level / Floor",
              "Sale Price","HOA Fee","Yearly Taxes","Commission %"
            ].map((x) => <div key={x} className="real-estate-chip">{x}</div>)}
          </div>
        </div>
      </div>
    </Card>
  );
}
