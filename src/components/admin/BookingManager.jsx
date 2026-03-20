import React, { useEffect, useState } from "react";
import { Card, Button } from "../common/ui";
import { listBookingsForAdmin } from "../../services/bookingPersistenceService";

export default function BookingManager() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const result = await listBookingsForAdmin();
    if (result.success) setItems(result.data);
    else setMessage(result.error.message);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Card style={{ padding: "1rem" }}>
      <div className="admin-section-header">
        <div>
          <div className="admin-kicker">LIVE BOOKINGS</div>
          <h3 style={{ margin: ".35rem 0 0" }}>Booking persistence and review</h3>
        </div>
        <Button variant="light" onClick={load}>REFRESH</Button>
      </div>

      {message ? <div className="notice" style={{ marginTop: "1rem" }}>{message}</div> : null}

      <div className="admin-table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>GUEST</th>
              <th>EMAIL</th>
              <th>DATES</th>
              <th>NIGHTS</th>
              <th>GUESTS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>SOURCE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>{row.guest_name}</td>
                <td>{row.guest_email}</td>
                <td>{row.check_in} → {row.check_out}</td>
                <td>{row.nights}</td>
                <td>{row.guests}</td>
                <td>{row.total_amount}</td>
                <td>{row.status}</td>
                <td>{row.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
