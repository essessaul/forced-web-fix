import React, { useEffect, useState } from "react";
import { Card, Button } from "../common/ui";
import { createSalesLead, listOwnerStatements, listSalesLeads } from "../../services/workflowService";

export default function WorkflowManager() {
  const [leadForm, setLeadForm] = useState({
    lead_name: "",
    lead_email: "",
    lead_phone: "",
    budget_text: "",
    source: "website",
    status: "new",
    notes: "",
  });
  const [leadItems, setLeadItems] = useState([]);
  const [statementItems, setStatementItems] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    const leads = await listSalesLeads();
    if (leads.success) setLeadItems(leads.data);
    const statements = await listOwnerStatements();
    if (statements.success) setStatementItems(statements.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function saveLead() {
    const result = await createSalesLead(leadForm);
    if (result.success) {
      setMessage("Lead created.");
      setLeadForm({
        lead_name: "",
        lead_email: "",
        lead_phone: "",
        budget_text: "",
        source: "website",
        status: "new",
        notes: "",
      });
      load();
    } else {
      setMessage(result.error.message);
    }
  }

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <Card style={{ padding: "1rem" }}>
        <div className="admin-section-header">
          <div>
            <div className="admin-kicker">REALTOR WORKFLOW</div>
            <h3 style={{ margin: ".35rem 0 0" }}>Sales lead pipeline</h3>
          </div>
          <Button onClick={saveLead}>SAVE LEAD</Button>
        </div>

        {message ? <div className="notice" style={{ marginTop: "1rem" }}>{message}</div> : null}

        <div className="admin-form-grid" style={{ marginTop: "1rem" }}>
          <input value={leadForm.lead_name} onChange={(e) => setLeadForm((p) => ({ ...p, lead_name: e.target.value }))} placeholder="LEAD NAME" />
          <input value={leadForm.lead_email} onChange={(e) => setLeadForm((p) => ({ ...p, lead_email: e.target.value }))} placeholder="LEAD EMAIL" />
          <input value={leadForm.lead_phone} onChange={(e) => setLeadForm((p) => ({ ...p, lead_phone: e.target.value }))} placeholder="LEAD PHONE" />
          <input value={leadForm.budget_text} onChange={(e) => setLeadForm((p) => ({ ...p, budget_text: e.target.value }))} placeholder="BUDGET" />
          <select value={leadForm.source} onChange={(e) => setLeadForm((p) => ({ ...p, source: e.target.value }))}>
            <option value="website">WEBSITE</option>
            <option value="whatsapp">WHATSAPP</option>
            <option value="referral">REFERRAL</option>
          </select>
          <select value={leadForm.status} onChange={(e) => setLeadForm((p) => ({ ...p, status: e.target.value }))}>
            <option value="new">NEW</option>
            <option value="contacted">CONTACTED</option>
            <option value="tour_scheduled">TOUR SCHEDULED</option>
            <option value="closed">CLOSED</option>
          </select>
          <textarea value={leadForm.notes} onChange={(e) => setLeadForm((p) => ({ ...p, notes: e.target.value }))} placeholder="NOTES" style={{ gridColumn: "1 / -1" }} />
        </div>

        <div className="admin-table-wrap" style={{ marginTop: "1rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>BUDGET</th>
                <th>SOURCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {leadItems.map((row) => (
                <tr key={row.id}>
                  <td>{row.lead_name}</td>
                  <td>{row.lead_email}</td>
                  <td>{row.lead_phone}</td>
                  <td>{row.budget_text}</td>
                  <td>{row.source}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ padding: "1rem" }}>
        <div className="admin-section-header">
          <div>
            <div className="admin-kicker">OWNER WORKFLOW</div>
            <h3 style={{ margin: ".35rem 0 0" }}>Owner statements and payouts</h3>
          </div>
        </div>

        <div className="admin-table-wrap" style={{ marginTop: "1rem" }}>
          <table className="table">
            <thead>
              <tr>
                <th>OWNER ID</th>
                <th>PROPERTY ID</th>
                <th>MONTH</th>
                <th>GROSS</th>
                <th>FEES</th>
                <th>PAYOUT</th>
              </tr>
            </thead>
            <tbody>
              {statementItems.map((row) => (
                <tr key={row.id}>
                  <td>{row.owner_id}</td>
                  <td>{row.property_id}</td>
                  <td>{row.statement_month}</td>
                  <td>{row.gross_revenue}</td>
                  <td>{row.fees}</td>
                  <td>{row.payout_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
