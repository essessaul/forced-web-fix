import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card } from "../components/common/ui";
import DateRangeFields from "../components/common/DateRangeFields";
import PlatformMascot from "../components/common/PlatformMascot";
import { getPropertyBySlug } from "../services/propertyService";
import { createPersistentBooking } from "../services/bookingPersistenceService";
import { useLanguage } from "../context/LanguageContext";

function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  a.setHours(0,0,0,0);
  b.setHours(0,0,0,0);
  return Math.max(0, Math.round((b - a) / 86400000));
}

export default function BookingPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [property, setProperty] = useState(null);
  const [form, setForm] = useState({
    first_name:"", last_name:"", email:"", phone:"",
    check_in:"", check_out:"", guests:2, notes:"",
    include_cleaning:true, include_insurance:false, include_transfer:false
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    getPropertyBySlug(slug).then(setProperty);
  }, [slug]);

  if (!property) return <section className="section"><div className="container">Loading booking...</div></section>;

  const nights = nightsBetween(form.check_in, form.check_out);
  const base = nights * Number(property.rate || 0);
  const cleaning = form.include_cleaning ? Number(property.cleaning_fee || 0) : 0;
  const insurance = form.include_insurance ? 39 : 0;
  const transfer = form.include_transfer ? 65 : 0;
  const total = base + cleaning + insurance + transfer;

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit() {
    const result = await createPersistentBooking({
      property_id: property.id,
      guest_name: `${form.first_name} ${form.last_name}`.trim(),
      guest_email: form.email,
      guest_phone: form.phone,
      check_in: form.check_in,
      check_out: form.check_out,
      guests: Number(form.guests),
      include_cleaning: form.include_cleaning,
      include_insurance: form.include_insurance,
      include_transfer: form.include_transfer,
      subtotal: base,
      total_amount: total,
      source: "direct",
      status: "pending",
      notes: form.notes,
    });

    setMessage(result.success
      ? (language === "es" ? `RESERVA CREADA: ${result.data.id}` : `BOOKING CREATED: ${result.data.id}`)
      : result.error.message);
  }

  return (
    <section className="section">
      <div className="container two-col">
        <Card>
          <div className="property-card">
            <div className="space" style={{ flexWrap: "wrap" }}>
              <h1 style={{ margin: 0 }}>{language === "es" ? "CONTINUAR RESERVA" : "CONTINUE BOOKING"}</h1>
              <PlatformMascot size="small" caption="Saul Playa" />
            </div>

            <div className="grid" style={{ marginTop: "1rem" }}>
              <div className="two-col">
                <input name="first_name" value={form.first_name} onChange={updateField} placeholder={language === "es" ? "NOMBRE" : "FIRST NAME"} />
                <input name="last_name" value={form.last_name} onChange={updateField} placeholder={language === "es" ? "APELLIDO" : "LAST NAME"} />
              </div>
              <div className="two-col">
                <input name="email" value={form.email} onChange={updateField} placeholder="EMAIL" />
                <input name="phone" value={form.phone} onChange={updateField} placeholder={language === "es" ? "TELÉFONO" : "PHONE"} />
              </div>

              <DateRangeFields
                checkIn={form.check_in}
                checkOut={form.check_out}
                onCheckInChange={(value) => setForm((prev) => ({ ...prev, check_in: value }))}
                onCheckOutChange={(value) => setForm((prev) => ({ ...prev, check_out: value }))}
              />

              <input name="guests" value={form.guests} onChange={updateField} placeholder={language === "es" ? "HUÉSPEDES" : "GUESTS"} />
              <textarea name="notes" value={form.notes} onChange={updateField} placeholder={language === "es" ? "NOTAS" : "NOTES"} />

              <div className="option-list">
                <label className="option-row"><span className="inline"><input type="checkbox" name="include_cleaning" checked={form.include_cleaning} onChange={updateField} style={{ width: 18 }} /><span>{language === "es" ? "LIMPIEZA" : "CLEANING FEE"}</span></span>{form.include_cleaning ? <strong>${property.cleaning_fee}</strong> : null}</label>
                <label className="option-row"><span className="inline"><input type="checkbox" name="include_insurance" checked={form.include_insurance} onChange={updateField} style={{ width: 18 }} /><span>{language === "es" ? "SEGURO" : "INSURANCE"}</span></span>{form.include_insurance ? <strong>$39</strong> : null}</label>
                <label className="option-row"><span className="inline"><input type="checkbox" name="include_transfer" checked={form.include_transfer} onChange={updateField} style={{ width: 18 }} /><span>{language === "es" ? "TRASLADO" : "AIRPORT TRANSFER"}</span></span>{form.include_transfer ? <strong>$65</strong> : null}</label>
              </div>

              <Button onClick={handleSubmit}>{language === "es" ? "CREAR RESERVA" : "CREATE BOOKING"}</Button>
              {message ? <div className="notice">{message}</div> : null}
            </div>
          </div>
        </Card>

        <Card>
          <div className="property-card">
            <h3>{property.name}</h3>
            <div className="muted">{property.location}</div>

            <div className="booking-summary" style={{ marginTop: "1rem" }}>
              <div className="price-row"><span className="muted">{language === "es" ? "TARIFA POR NOCHE" : "NIGHTLY RATE"}</span><strong>${property.rate}</strong></div>
              <div className="price-row" style={{ marginTop: 8 }}><span className="muted">{language === "es" ? "NOCHES" : "NIGHTS"}</span><strong>{nights}</strong></div>
              <div className="price-row" style={{ marginTop: 8 }}><span className="muted">{language === "es" ? "HOSPEDAJE" : "ACCOMMODATION"}</span><strong>${base}</strong></div>
              {form.include_cleaning ? <div className="price-row" style={{ marginTop: 8 }}><span className="muted">{language === "es" ? "LIMPIEZA" : "CLEANING FEE"}</span><strong>${property.cleaning_fee}</strong></div> : null}
              {form.include_insurance ? <div className="price-row" style={{ marginTop: 8 }}><span className="muted">{language === "es" ? "SEGURO" : "INSURANCE"}</span><strong>$39</strong></div> : null}
              {form.include_transfer ? <div className="price-row" style={{ marginTop: 8 }}><span className="muted">{language === "es" ? "TRASLADO" : "AIRPORT TRANSFER"}</span><strong>$65</strong></div> : null}
              <div className="price-row" style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e9dfd5" }}>
                <span style={{ fontWeight: 800 }}>{language === "es" ? "TOTAL" : "TOTAL"}</span>
                <strong style={{ fontSize: 22 }}>${total}</strong>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <Link to={`/property/${property.slug}`}><Button variant="light">{language === "es" ? "VOLVER A PROPIEDAD" : "BACK TO PROPERTY"}</Button></Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
