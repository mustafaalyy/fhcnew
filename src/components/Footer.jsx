import React from "react";
import { Phone, MapPin, Send, MessageSquare, Clock, Shield, Facebook, Instagram } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function Footer({ setCurrentTab }) {
  const { settings } = useHospital();

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCleanPhone = (phoneStr) => {
    return phoneStr ? phoneStr.replace(/[^\d+]/g, "") : "";
  };

  const getMapsLink = () => {
    if (settings.mapsUrl) return settings.mapsUrl;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "")}`;
  };

  const getWhatsappLink = () => {
    const clean = getCleanPhone(settings.whatsapp || settings.phone);
    return clean ? `https://wa.me/${clean.replace("+", "")}` : "#";
  };

  return (
    <footer 
      style={{
        backgroundColor: "var(--color-dark)",
        color: "rgba(255, 255, 255, 0.75)",
        paddingTop: "4rem",
        paddingBottom: "1.5rem",
        borderTop: "4px solid var(--color-primary)"
      }}
    >
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr 1.2fr", gap: "2.5rem", marginBottom: "3rem" }} className="footer-grid">
          
          {/* Hospital Overview */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div 
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold"
                }}
              >
                FH
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "bold" }}>
                {settings.hospitalName || "Family Health Care"}
              </h3>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
              تأسست مستشفانا عام 2009 لتقديم رعاية طبية متكاملة لجميع أفراد الأسرة في مدينة 6 أكتوبر بريادة د. محمد صدقي عبدالقادر.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f87171", fontWeight: "bold", fontSize: "0.95rem" }}>
              <Clock size={16} />
              <span>الطوارئ والعمليات: 24/7 طوال العام</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: "600", marginBottom: "1.5rem", position: "relative", paddingBottom: "0.5rem" }}>
              روابط سريعة
              <span style={{ position: "absolute", bottom: 0, right: 0, width: "30px", height: "2px", backgroundColor: "var(--color-primary)" }}></span>
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.9rem" }}>
              <li>
                <span onClick={() => handleNavClick("home")} style={{ cursor: "pointer", hover: { color: "#fff" } }}>
                  الصفحة الرئيسية
                </span>
              </li>
              <li>
                <span onClick={() => handleNavClick("services")} style={{ cursor: "pointer" }}>
                  الخدمات والتخصصات
                </span>
              </li>
              <li>
                <span onClick={() => handleNavClick("doctors")} style={{ cursor: "pointer" }}>
                  فريق الأطباء
                </span>
              </li>
              <li>
                <span onClick={() => handleNavClick("about")} style={{ cursor: "pointer" }}>
                  عن المستشفى
                </span>
              </li>
              <li>
                <span onClick={() => handleNavClick("contact")} style={{ cursor: "pointer" }}>
                  تواصل معنا
                </span>
              </li>
              <li>
                <span onClick={() => handleNavClick("booking")} style={{ cursor: "pointer", color: "var(--color-primary)", fontWeight: "bold" }}>
                  احجز موعداً
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: "600", marginBottom: "1.5rem", position: "relative", paddingBottom: "0.5rem" }}>
              معلومات الاتصال
              <span style={{ position: "absolute", bottom: 0, right: 0, width: "30px", height: "2px", backgroundColor: "var(--color-primary)" }}></span>
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <MapPin size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                <a
                  href={getMapsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", lineHeight: "1.7", textDecoration: "none" }}
                  title="افتح الموقع على Google Maps"
                >
                  {settings.address || "موقع المستشفى على الخريطة"}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Phone size={18} style={{ color: "var(--color-secondary)" }} />
                <span style={{ fontWeight: "700", color: "#fff" }}>للاستعلامات:</span>
                <a href={`tel:${getCleanPhone(settings.phone)}`} style={{ direction: "ltr" }}>
                  {settings.phone}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center", color: "#f87171", fontWeight: "bold" }}>
                <Phone size={18} />
                <span>الطوارئ:</span>
                <a href={`tel:${settings.emergencyPhone}`} style={{ direction: "ltr" }}>
                  {settings.emergencyPhone}
                </a>
              </li>
              <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <MessageSquare size={18} style={{ color: "#25D366" }} />
                <a
                  href={getWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#25D366", fontWeight: "700", direction: "ltr" }}
                >
                  واتساب: {settings.whatsapp || settings.phone}
                </a>
              </li>
            </ul>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ color: "#fff", fontWeight: "700", marginBottom: "0.75rem" }}>تابعنا على</p>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <a
                  href={settings.facebook || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Facebook size={19} />
                </a>
                <a
                  href={settings.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Instagram size={19} />
                </a>
              </div>
            </div>
          </div>

          {/* Maps Embed */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: "600", marginBottom: "1.25rem", position: "relative", paddingBottom: "0.5rem" }}>
              موقعنا الجغرافي
              <span style={{ position: "absolute", bottom: 0, right: 0, width: "30px", height: "2px", backgroundColor: "var(--color-primary)" }}></span>
            </h4>
            <div style={{ borderRadius: "var(--border-radius-sm)", overflow: "hidden", height: "120px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "0.75rem" }}>
              <iframe
                title="Google Maps Location"
                src={settings.mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <a 
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.5rem 1rem", fontSize: "0.8rem", gap: "0.3rem", borderRadius: "var(--border-radius-sm)" }}
            >
              <Send size={12} />
              افتح خرائط Google
            </a>
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingPadding: "1.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", paddingTop: "1.5rem", fontSize: "0.85rem" }}>
          <div>
            &copy; {new Date().getFullYear()} مستشفى Family Health Care. جميع الحقوق محفوظة.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span>تحت إشراف طبي كامل: د. محمد صدقي عبدالقادر</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Shield size={12} />
              معايير سريرية فاخرة
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
