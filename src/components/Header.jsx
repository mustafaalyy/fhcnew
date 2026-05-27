import React, { useState, useEffect } from "react";
import { Phone, MapPin, Menu, X, LogOut, Shield, Calendar } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function Header({ currentTab, setCurrentTab }) {
  const { settings, currentUser, logout } = useHospital();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Secret access: click logo 5 times quickly to open admin
  const [logoClicks, setLogoClicks] = useState(0);
  const logoClickTimer = React.useRef(null);

  const handleLogoSecretClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        handleNavClick("admin");
        clearTimeout(logoClickTimer.current);
        return 0;
      }
      clearTimeout(logoClickTimer.current);
      logoClickTimer.current = setTimeout(() => setLogoClicks(0), 2000);
      return next;
    });
  };

  const navigation = [
    { id: "home", name: "الرئيسية" },
    { id: "services", name: "الخدمات" },
    { id: "doctors", name: "الأطباء" },
    { id: "portal", name: "بوابة المريض" },
    { id: "about", name: "عن المستشفى" },
    { id: "contact", name: "تواصل معنا" },
    { id: "admin", name: "دخول الإدارة" }
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setCurrentTab("home");
  };

  return (
    <header style={{ width: "100%", zIndex: 100, position: "sticky", top: 0, boxShadow: "var(--shadow-md)" }}>
      {/* Main Navbar */}
      <nav style={{ backgroundColor: "var(--color-white)", padding: "0.85rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo */}
          <div 
            onClick={() => { handleNavClick("home"); handleLogoSecretClick(); }}
            style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer" }}
          >
            <img
              src={settings.logo || localStorage.getItem("fhh_logo") || "/logo.png"}
              alt={settings.hospitalName || "Family Health Care"}
              style={{ height: "82px", width: "auto", objectFit: "contain" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontWeight: "800", fontSize: "1.15rem", color: "var(--color-dark)" }}>
                {settings.hospitalName || "Family Health Care"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)", fontWeight: "600" }}>
                {settings.tagline || "رعاية طبية متكاملة للأسرة"}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-menu">
            {navigation.map((item) => (
              <span
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${currentTab === item.id ? "active" : ""}`}
                style={{ cursor: "pointer", fontWeight: "500" }}
              >
                {item.name}
              </span>
            ))}
          </div>

          {/* Book Appointment CTA Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="desktop-menu">
            <button 
              onClick={() => handleNavClick("booking")}
              className="btn btn-primary"
              style={{ padding: "0.6rem 1.4rem", fontSize: "0.95rem" }}
            >
              <Calendar size={16} />
              احجز موعداً
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none", color: "var(--color-dark)" }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: "fixed",
            top: "92px",
            right: 0,
            left: 0,
            bottom: 0,
            backgroundColor: "rgba(28, 43, 53, 0.95)",
            backdropFilter: "blur(5px)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
            gap: "1.5rem"
          }}
        >
          {navigation.map((item) => (
            <span
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                color: currentTab === item.id ? "var(--color-primary)" : "var(--color-white)",
                fontSize: "1.3rem",
                fontWeight: "600",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                paddingBottom: "0.75rem",
                cursor: "pointer"
              }}
            >
              {item.name}
            </span>
          ))}

          <button 
            onClick={() => handleNavClick("booking")}
            className="btn btn-primary animate-fade"
            style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
          >
            <Calendar size={18} />
            احجز موعدك الآن
          </button>

          {currentUser ? (
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ width: "100%", color: "#fff", borderColor: "#ef4444" }}
            >
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          ) : null}
        </div>
      )}

      {/* CSS rules specifically for responsive showing/hiding of header controls */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
