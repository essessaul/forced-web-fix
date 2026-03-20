import React, { useEffect, useMemo, useState } from "react";
import { Button, Card } from "../common/ui";
import { createPropertyCrud, deletePropertyCrud, listPropertiesCrud, updatePropertyCrud } from "../../services/propertyCrudService";
import { uploadPropertyImage } from "../../services/uploadService";

const emptyForm = (listingType = "rental") => ({
  listing_type: listingType,
  slug: "",
  status: "draft",
  title: "",
  subtitle: "",
  description: "",
  location: "",
  view_type: "",
  bedrooms: "",
  bathrooms: "",
  sqm: "",
  sqft: "",
  parking: "",
  level_label: "",
  price_sale: "",
  nightly_rate: "",
  cleaning_fee: "",
  min_nights: "1",
  max_guests: "1",
  instant_book: false,
  featured: false,
  image_url: "",
  image_path: "",
});

export default function PropertyManager({ listingType = "rental", title = "Property Manager" }) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(emptyForm(listingType));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const result = await listPropertiesCrud(listingType);
    if (result.success) setItems(result.data);
    else setMessage(result.error.message);
  }

  useEffect(() => {
    load();
  }, [listingType]);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

  useEffect(() => {
    if (selectedItem) {
      setForm({
        ...emptyForm(listingType),
        ...selectedItem,
        bedrooms: selectedItem.bedrooms ?? "",
        bathrooms: selectedItem.bathrooms ?? "",
        sqm: selectedItem.sqm ?? "",
        sqft: selectedItem.sqft ?? "",
        parking: selectedItem.parking ?? "",
        price_sale: selectedItem.price_sale ?? "",
        nightly_rate: selectedItem.nightly_rate ?? "",
        cleaning_fee: selectedItem.cleaning_fee ?? "",
        min_nights: selectedItem.min_nights ?? "1",
        max_guests: selectedItem.max_guests ?? "1",
      });
    } else {
      setForm(emptyForm(listingType));
    }
  }, [selectedItem, listingType]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const result = await uploadPropertyImage(file, listingType);
    if (result.success) {
      setForm((prev) => ({ ...prev, image_url: result.publicUrl, image_path: result.filePath }));
      setMessage("Image uploaded.");
    } else {
      setMessage(result.error.message);
    }
    setLoading(false);
  }

  async function handleSave() {
    setLoading(true);
    const payload = {
      ...form,
      bedrooms: form.bedrooms === "" ? 0 : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? 0 : Number(form.bathrooms),
      sqm: form.sqm === "" ? 0 : Number(form.sqm),
      sqft: form.sqft === "" ? 0 : Number(form.sqft),
      parking: form.parking === "" ? 0 : Number(form.parking),
      price_sale: form.price_sale === "" ? null : Number(form.price_sale),
      nightly_rate: form.nightly_rate === "" ? null : Number(form.nightly_rate),
      cleaning_fee: form.cleaning_fee === "" ? 0 : Number(form.cleaning_fee),
      min_nights: form.min_nights === "" ? 1 : Number(form.min_nights),
      max_guests: form.max_guests === "" ? 1 : Number(form.max_guests),
    };

    const result = selectedId
      ? await updatePropertyCrud(selectedId, payload)
      : await createPropertyCrud(payload);

    if (result.success) {
      setMessage(selectedId ? "Listing updated." : "Listing created.");
      setSelectedId(result.data.id);
      await load();
    } else {
      setMessage(result.error.message);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!selectedId) return;
    setLoading(true);
    const result = await deletePropertyCrud(selectedId);
    if (result.success) {
      setMessage("Listing deleted.");
      setSelectedId("");
      setForm(emptyForm(listingType));
      await load();
    } else {
      setMessage(result.error.message);
    }
    setLoading(false);
  }

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <Card style={{ padding: "1rem" }}>
        <div className="admin-section-header">
          <div>
            <div className="admin-kicker">{listingType.toUpperCase()} CRUD</div>
            <h3 style={{ margin: ".35rem 0 0" }}>{title}</h3>
          </div>
          <div className="inline" style={{ gap: ".6rem", flexWrap: "wrap" }}>
            <Button variant="light" onClick={() => { setSelectedId(""); setForm(emptyForm(listingType)); }}>NEW</Button>
            <Button onClick={handleSave} disabled={loading}>SAVE</Button>
            <Button variant="light" onClick={handleDelete} disabled={!selectedId || loading}>DELETE</Button>
          </div>
        </div>

        {message ? <div className="notice" style={{ marginTop: "1rem" }}>{message}</div> : null}

        <div className="admin-form-grid" style={{ marginTop: "1rem" }}>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            <option value="">SELECT EXISTING LISTING</option>
            {items.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
          <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="SLUG" />
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="TITLE" />
          <input value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} placeholder="SUBTITLE" />
          <input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="LOCATION" />
          <input value={form.view_type} onChange={(e) => setField("view_type", e.target.value)} placeholder="VIEW TYPE" />
          <input value={form.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} placeholder="BEDROOMS" />
          <input value={form.bathrooms} onChange={(e) => setField("bathrooms", e.target.value)} placeholder="BATHROOMS" />
          <input value={form.sqm} onChange={(e) => setField("sqm", e.target.value)} placeholder="SQ METERS" />
          <input value={form.sqft} onChange={(e) => setField("sqft", e.target.value)} placeholder="SQ FEET" />
          <input value={form.parking} onChange={(e) => setField("parking", e.target.value)} placeholder="PARKING" />
          <input value={form.level_label} onChange={(e) => setField("level_label", e.target.value)} placeholder="LEVEL / FLOOR" />
          {listingType === "sale" ? <input value={form.price_sale} onChange={(e) => setField("price_sale", e.target.value)} placeholder="SALE PRICE" /> : null}
          {listingType === "rental" ? <input value={form.nightly_rate} onChange={(e) => setField("nightly_rate", e.target.value)} placeholder="NIGHTLY RATE" /> : null}
          {listingType === "rental" ? <input value={form.cleaning_fee} onChange={(e) => setField("cleaning_fee", e.target.value)} placeholder="CLEANING FEE" /> : null}
          {listingType === "rental" ? <input value={form.min_nights} onChange={(e) => setField("min_nights", e.target.value)} placeholder="MIN NIGHTS" /> : null}
          {listingType === "rental" ? <input value={form.max_guests} onChange={(e) => setField("max_guests", e.target.value)} placeholder="MAX GUESTS" /> : null}
          <select value={form.status} onChange={(e) => setField("status", e.target.value)}>
            <option value="draft">DRAFT</option>
            <option value="live">LIVE</option>
            <option value="private">PRIVATE</option>
            <option value="archived">ARCHIVED</option>
          </select>
          <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} /> FEATURED</label>
          {listingType === "rental" ? <label className="admin-checkbox"><input type="checkbox" checked={form.instant_book} onChange={(e) => setField("instant_book", e.target.checked)} /> INSTANT BOOK</label> : null}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="DESCRIPTION" style={{ gridColumn: "1 / -1" }} />
          {form.image_url ? (
            <div className="card" style={{ padding: ".75rem", gridColumn: "1 / -1" }}>
              <div className="muted" style={{ marginBottom: ".5rem" }}>IMAGE PREVIEW</div>
              <img src={form.image_url} alt="preview" style={{ width: "100%", maxWidth: 280, borderRadius: 18, objectFit: "cover" }} />
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
