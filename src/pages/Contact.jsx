import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { Phone, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const { settings } = useHospital();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate sending form details
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const getCleanPhone = (phoneStr) => {
    return phoneStr ? phoneStr.replace(/[^\d+]/g, "") : "";
  };

  return (
    <div style={{ backgroundColor: "var(--color-light)", padding: "4rem 0" }}>
      <div className="container">
        
        {/* Title */}
        <div className="section-title">
          <h2>تواصل معنا</h2>
          <p>يسعدنا دائماً الرد على استفساراتكم واقتراحاتكم لتطوير خدماتنا الطبية</p>
        </div>

        {/* Contact layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2.5rem", marginBottom: "4rem" }} className="contact-grid">
          
          {/* Left Cards panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Phone details */}
            <div className="luxury-card" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(42, 157, 181, 0.08)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-dark)" }}>هاتف العيادات والاتصالات</h4>
                <a href={`tel:${getCleanPhone(settings.phone)}`} style={{ fontSize: "0.9rem", color: "var(--color-text-light)", direction: "ltr", display: "inline-block" }}>
                  {settings.phone}
                </a>
              </div>
            </div>

            {/* Emergency details */}
            <div className="luxury-card" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1.5rem", borderLeft: "4px solid var(--color-danger)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-danger)" }}>طوارئ 24/7 (الخط الساخن)</h4>
                <a href={`tel:${settings.emergencyPhone}`} style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-dark)", direction: "ltr", display: "inline-block" }}>
                  {settings.emergencyPhone}
                </a>
              </div>
            </div>

            {/* WhatsApp details */}
            <div className="luxury-card" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(37, 211, 102, 0.08)", color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-dark)" }}>تواصل سريع عبر واتساب</h4>
                <a 
                  href={`https://wa.me/${getCleanPhone(settings.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.9rem", color: "#25D366", fontWeight: "600" }}
                >
                  اضغط لبدء محادثة فورية
                </a>
              </div>
            </div>

            {/* Address details */}
            <div className="luxury-card" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(90, 171, 107, 0.08)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-dark)" }}>العنوان الجغرافي</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", lineHeight: "1.5" }}>
                  {settings.address}
                </p>
              </div>
            </div>

          </div>

          {/* Right Contact Form */}
          <div className="luxury-card" style={{ padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
              أرسل رسالة سريعة لإدارة المستشفى
            </h3>

            {submitted && (
              <div 
                className="animate-fade"
                style={{
                  backgroundColor: "rgba(90, 171, 107, 0.1)",
                  color: "var(--color-secondary)",
                  padding: "1rem",
                  borderRadius: "var(--border-radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1.5rem",
                  fontWeight: "bold"
                }}
              >
                <CheckCircle2 size={20} />
                <span>تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا وسنقوم بالرد عليك في أقرب وقت.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-double-col">
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                    اسمك الكريم *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد محمود"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                  موضوع الرسالة
                </label>
                <input
                  type="text"
                  placeholder="اكتب عنوان الرسالة..."
                  className="form-input"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                  نص الرسالة والاستفسار *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="اكتب هنا تفاصيل استفسارك أو مشكلتك..."
                  className="form-input"
                  style={{ resize: "none" }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ alignSelf: "flex-start", padding: "0.8rem 2.2rem", gap: "0.5rem" }}
              >
                <Send size={16} />
                إرسال الاستفسار
              </button>
            </form>
          </div>

        </div>

        {/* Embedded Map Section */}
        <div className="luxury-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-dark)" }}>موقعنا على خرائط جوجل</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>مدينة 6 أكتوبر، محافظة الجيزة</p>
            </div>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", gap: "0.4rem" }}
            >
              <Send size={14} />
              فتح الموقع في خرائط Google
            </a>
          </div>
          
          <div style={{ borderRadius: "var(--border-radius-md)", overflow: "hidden", height: "350px", border: "1px solid var(--color-border)" }}>
            <iframe
              title="Google Map embed location for Hospital"
              src={settings.mapsEmbedSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .form-double-col {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
