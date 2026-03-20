import React, { useState } from "react";
import { Button, Card } from "../components/common/ui";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ display_name:"", email:"", password:"", role:"owner" });
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    if (mode === "signin") {
      const result = await signIn(form.email, form.password);
      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage(language === "es" ? "SESIÓN INICIADA. REDIRIGIENDO..." : "SIGNED IN. REDIRECTING...");
        if (form.email === "SaulPlaya" && form.password === "Formula5181") {
          window.setTimeout(() => navigate("/admin"), 400);
        }
      }
    } else {
      const result = await signUp(form.email, form.password, form.role, form.display_name);
      setMessage(result.error ? result.error.message : language === "es" ? "CUENTA CREADA. REVISA TU CORREO." : "ACCOUNT CREATED. CHECK YOUR EMAIL.");
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 620 }}>
        <Card>
          <div className="property-card">
            <div className="price-row" style={{ flexWrap: "wrap" }}>
              <h1 style={{ margin: 0, textTransform: "uppercase" }}>
                {language === "es" ? "INGRESAR / REGISTRARSE" : "SIGN IN / SIGN UP"}
              </h1>
              <div className="inline">
                <Button variant={mode === "signin" ? "dark" : "light"} onClick={() => setMode("signin")}>
                  {language === "es" ? "INGRESAR" : "SIGN IN"}
                </Button>
                <Button variant={mode === "signup" ? "dark" : "light"} onClick={() => setMode("signup")}>
                  {language === "es" ? "REGISTRARSE" : "SIGN UP"}
                </Button>
              </div>
            </div>

            <div className="notice" style={{ marginTop: "1rem" }}>
              {language === "es"
                ? "ACCESO ADMIN DEMO: USUARIO SaulPlaya · CONTRASEÑA Formula5181"
                : "DEMO ADMIN ACCESS: LOGIN SaulPlaya · PASSWORD Formula5181"}
            </div>

            <div className="grid" style={{ marginTop: "1rem" }}>
              {mode === "signup" ? (
                <>
                  <input value={form.display_name} onChange={(e) => setForm((p) => ({ ...p, display_name: e.target.value }))} placeholder={language === "es" ? "NOMBRE" : "DISPLAY NAME"} />
                  <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
                    <option value="guest">{language === "es" ? "HUÉSPED" : "GUEST"}</option>
                    <option value="owner">{language === "es" ? "PROPIETARIO" : "OWNER"}</option>
                    <option value="realtor">{language === "es" ? "CORREDOR" : "REALTOR"}</option>
                    <option value="admin">{language === "es" ? "ADMIN" : "ADMIN"}</option>
                  </select>
                </>
              ) : null}

              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder={language === "es" ? "USUARIO O EMAIL" : "LOGIN OR EMAIL"}
              />

              <div className="password-toggle-row">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder={language === "es" ? "CONTRASEÑA" : "PASSWORD"}
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (language === "es" ? "OCULTAR" : "HIDE") : (language === "es" ? "VER" : "SHOW")}
                </button>
              </div>

              <Button onClick={handleSubmit}>
                {mode === "signin" ? (language === "es" ? "INGRESAR" : "SIGN IN") : (language === "es" ? "CREAR CUENTA" : "CREATE ACCOUNT")}
              </Button>

              <div className="muted" style={{ fontWeight: 700 }}>
                {language === "es" ? "ADMIN DIRECTO:" : "DIRECT ADMIN:"} <Link to="/admin">/admin</Link>
              </div>

              {message ? <div className="notice">{message}</div> : null}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
