import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const AUTO_CLOSE_MS = 45000;

function detectIntent(message) {
  const text = message.toLowerCase();

  if (/sale|venta|buy|comprar|real estate|unit|listing/.test(text)) return "sales";
  if (/rental|rent|book|stay|vacation|alquiler|reserva|booking/.test(text)) return "rentals";
  if (/owner|propietario|statement|payout|reporte/.test(text)) return "owners";
  if (/admin|dashboard|login|sign in|registrarse|ingresar/.test(text)) return "admin";
  if (/contact|call|phone|email|whatsapp|contacto|llamar|correo/.test(text)) return "contact";
  if (/price|pricing|precio|rate|tarifa/.test(text)) return "pricing";
  return "general";
}

function smartReply(message, language = "en") {
  const intent = detectIntent(message);

  const replies = {
    en: {
      sales: "For real estate units for sale, open OUR LISTINGS. That section is separate from rentals and includes bedrooms, bathrooms, square meters, square feet, parking, level, view, and sale price.",
      rentals: "For vacation rentals, open VACATION RENTALS. You can search by dates and guests, review pricing, and use the booking flow with Airbnb-style options.",
      owners: "Owner services include listing access, booking visibility, and owner statements. The owner workflow is separate from guest booking and real estate sales.",
      admin: "Admin access is protected. Use the login page first, then open the admin system to manage rentals, sales listings, bookings, and workflows.",
      contact: "You can contact Saul directly by phone at +507 6616-4212, by email at saul@playa.com, or through the floating WhatsApp button.",
      pricing: "Pricing depends on whether you are looking at rentals or sale listings. Rentals use nightly and operational pricing. Real estate listings use full sale price and property details.",
      general: "I’m Saul Playa AI. I can help with vacation rentals, real estate listings for sale, owner services, admin guidance, and direct contact with Saul Playa."
    },
    es: {
      sales: "Para unidades inmobiliarias en venta, abre NUESTROS LISTADOS. Esa sección está separada de los alquileres e incluye habitaciones, baños, metros cuadrados, pies cuadrados, estacionamientos, nivel, vista y precio de venta.",
      rentals: "Para alquileres vacacionales, abre ALQUILERES VACACIONALES. Puedes buscar por fechas y huéspedes, revisar precios y usar el flujo de reserva con opciones estilo Airbnb.",
      owners: "Los servicios al propietario incluyen acceso a listados, visibilidad de reservas y estados de cuenta. El flujo del propietario está separado del de huéspedes y ventas inmobiliarias.",
      admin: "El acceso de admin está protegido. Primero usa la página de ingreso y luego abre el sistema admin para manejar alquileres, listados de venta, reservas y flujos.",
      contact: "Puedes contactar directamente a Saul por teléfono al +507 6616-4212, por correo a saul@playa.com, o con el botón flotante de WhatsApp.",
      pricing: "El precio depende de si buscas alquileres o unidades en venta. Los alquileres usan tarifas operativas por noche. Los listados inmobiliarios usan precio total de venta y detalles de la propiedad.",
      general: "Soy Saul Playa AI. Puedo ayudarte con alquileres vacacionales, listados inmobiliarios en venta, servicios al propietario, guía admin y contacto directo con Saul Playa."
    }
  };

  return replies[language][intent];
}

export default function SaulAIAssistant() {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const timeoutRef = useRef(null);
  const panelRef = useRef(null);

  const quickReplies = useMemo(() => (
    language === "es"
      ? ["Ver alquileres", "Ver unidades en venta", "Cómo contacto a Saul", "Ayuda con reserva", "Soy propietario"]
      : ["Show rentals", "Show units for sale", "How do I contact Saul", "Help me book a stay", "I am an owner"]
  ), [language]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: language === "es"
          ? "Bienvenido. Soy Saul Playa AI. Pregúntame sobre alquileres, unidades en venta, servicios al propietario o cómo contactar a Saul Playa."
          : "Welcome. I’m Saul Playa AI. Ask me about rentals, units for sale, owner services, or how to contact Saul Playa."
      }
    ]);
  }, [language]);

  function resetAutoClose() {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, AUTO_CLOSE_MS);
  }

  useEffect(() => {
    if (open) resetAutoClose();
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [open]);

  function handleOpenToggle() {
    setOpen((prev) => !prev);
    if (!open) resetAutoClose();
  }

  function pushMessage(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;
    const reply = smartReply(trimmed, language);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }, { role: "assistant", text: reply }]);
    setInput("");
    resetAutoClose();
  }

  function onInteract() {
    if (open) resetAutoClose();
  }

  return (
    <>
      <button
        type="button"
        className="saul-ai-trigger"
        onClick={handleOpenToggle}
        aria-label="Open Saul Playa AI"
      >
        ✨
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="saul-ai-panel"
          onMouseMove={onInteract}
          onMouseDown={onInteract}
          onKeyDown={onInteract}
        >
          <div className="saul-ai-header">
            <div>
              <div className="saul-ai-title">Saul Playa AI</div>
              <div className="saul-ai-subtitle">
                {language === "es" ? "Alquileres • Ventas • Propietarios" : "Rentals • Sales • Owner Support"}
              </div>
            </div>
            <button type="button" className="saul-ai-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="saul-ai-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`saul-ai-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="saul-ai-quick-replies">
            {quickReplies.map((item) => (
              <button key={item} type="button" className="saul-ai-chip" onClick={() => pushMessage(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="saul-ai-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === "es" ? "Pregunta a Saul Playa AI" : "Ask Saul Playa AI"}
              onFocus={onInteract}
              onKeyDown={(e) => {
                onInteract();
                if (e.key === "Enter" && input.trim()) pushMessage(input);
              }}
            />
            <button type="button" className="saul-ai-send" onClick={() => pushMessage(input)} disabled={!input.trim()}>
              {language === "es" ? "Enviar" : "Send"}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
