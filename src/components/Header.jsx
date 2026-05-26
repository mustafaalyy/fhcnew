import React, { useState } from "react";
import { Phone, MapPin, Menu, X, LogOut, User, Shield, Calendar } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function Header({ currentTab, setCurrentTab }) {
  const { settings, currentUser, logout } = useHospital();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: "home", name: "الرئيسية" },
    { id: "services", name: "الخدمات" },
    { id: "doctors", name: "الأطباء" },
    { id: "portal", name: "بوابة المريض" },
    { id: "about", name: "عن المستشفى" },
    { id: "contact", name: "تواصل معنا" }
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
      {/* Top Header Bar */}
      <div
        style={{
          backgroundColor: "var(--color-dark)",
          color: "rgba(255, 255, 255, 0.85)",
          padding: "0.5rem 0",
          fontSize: "0.85rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MapPin size={14} style={{ color: "var(--color-primary)" }} />
              {settings.address || "مدينة 6 أكتوبر، الجيزة"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Phone size={14} style={{ color: "var(--color-secondary)" }} />
              <span>الاستعلامات: {settings.phone}</span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#f87171", fontWeight: "bold" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", animation: "pulse-subtle 1.5s infinite" }}></span>
              طوارئ 24/7: {settings.emergencyPhone}
            </span>
            
            {currentUser ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <span 
                  onClick={() => handleNavClick("admin")}
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--color-primary)", cursor: "pointer", fontWeight: "600" }}
                >
                  <Shield size={14} />
                  <span>لوحة التحكم ({currentUser.role === 'superadmin' ? 'مدير' : currentUser.role === 'receptionist' ? 'استقبال' : 'طبيب'})</span>
                </span>
                <button 
                  onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#f87171", border: "none", background: "none", fontSize: "0.85rem" }}
                >
                  <LogOut size={14} />
                  <span>خروج</span>
                </button>
              </div>
            ) : (
              <span 
                onClick={() => handleNavClick("admin")} 
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", cursor: "pointer", hover: { color: "#fff" } }}
              >
                <User size={14} style={{ color: "var(--color-primary)" }} />
                <span>دخول الإدارة</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{ backgroundColor: "var(--color-white)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick("home")} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
          >
            <div 
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-white)",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 4px 10px rgba(42,157,181,0.2)"
              }}
            >
              FH
            </div>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-dark)", lineHeight: "1.1" }}>
                {settings.hospitalName || "Family Health Care"}
              </h1>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)", display: "block" }}>
                مستشفى عائلي تخصصي
              </span>
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
          ) : (
            <button 
              onClick={() => handleNavClick("admin")}
              className="btn btn-outline"
              style={{ width: "100%", color: "var(--color-white)", borderColor: "var(--color-primary)" }}
            >
              <User size={16} />
              دخول الإدارة
            </button>
          )}
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
