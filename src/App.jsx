import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import InteractiveMascot from "./components/common/InteractiveMascot";
import SaulAIAssistant from "./components/common/SaulAIAssistant";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import PropertyPage from "./pages/PropertyPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import OwnerServicesPage from "./pages/OwnerServicesPage";
import ForSalePage from "./pages/ForSalePage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OurListingsPage from "./pages/OurListingsPage";

export default function App() {
  return (
    <div>
      <Header />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/our-listings" element={<OurListingsPage />} />
          <Route path="/property/:slug" element={<PropertyPage />} />
          <Route path="/booking/:slug" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/for-sale" element={<ForSalePage />} />
          <Route path="/owner-services" element={<OwnerServicesPage />} />
          <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <a href="https://wa.me/50766164212" target="_blank" rel="noreferrer" className="floating-whatsapp-elite" aria-label="WhatsApp">✆</a>
      <SaulAIAssistant />
      <InteractiveMascot />
      <Footer />
    </div>
  );
}
