import React from "react";
import { useHospital } from "../context/HospitalContext";
import ServiceCard from "../components/ServiceCard";

export default function Services({ setCurrentTab, setSelectedSpecialtyId }) {
  const { specialties } = useHospital();

  const handleBook = (specialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setCurrentTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "var(--color-light)", padding: "4rem 0" }}>
      <div className="container">
        
        {/* Title */}
        <div className="section-title">
          <h2>الخدمات الطبية والتخصصات</h2>
          <p>تضم مستشفانا 12 قسماً وتخصصاً طبياً متكاملاً مجهزاً بأحدث الأجهزة والتقنيات لتلبية كافة الاحتياجات الطبية لعائلتك</p>
        </div>

        {/* Specialties Grid (12 specialties) */}
        <div className="grid-3">
          {specialties.map((spec) => (
            <ServiceCard
              key={spec.id}
              specialty={spec}
              onBookClick={handleBook}
            />
          ))}
        </div>

        {/* Emergency Highlight Card */}
        <div 
          className="animate-fade"
          style={{
            marginTop: "4rem",
            backgroundColor: "var(--color-dark)",
            color: "var(--color-white)",
            borderRadius: "var(--border-radius-md)",
            padding: "2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "2rem",
            boxShadow: "var(--shadow-lg)",
            borderRight: "6px solid var(--color-danger)"
          }}
          className="er-highlight-card"
        >
          <div style={{ maxWidth: "600px" }}>
            <span 
              style={{ 
                backgroundColor: "var(--color-danger)", 
                color: "var(--color-white)", 
                padding: "0.25rem 0.75rem", 
                borderRadius: "var(--border-radius-sm)", 
                fontSize: "0.85rem", 
                fontWeight: "bold",
                display: "inline-block",
                marginBottom: "0.75rem"
              }}
            >
              طوارئ وإنقاذ حياة 24/7
            </span>
            <h3 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              هل تواجه حالة طارئة أو إصابة عاجلة؟
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.95rem", lineHeight: "1.7" }}>
              قسم الطوارئ بالمستشفى يعمل بكامل طاقته التشغيلية على مدار 24 ساعة طوال أيام الأسبوع. لدينا طاقم رعاية حرجة وسيارات إسعاف مجهزة بالكامل للتحرك الفوري.
            </p>
          </div>
          <div>
            <a 
              href="tel:02238322000" 
              className="btn btn-secondary"
              style={{ backgroundColor: "var(--color-danger)", boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)", padding: "0.9rem 2.2rem", fontSize: "1.1rem" }}
            >
              اتصل بالطوارئ فوراً: 02238322000
            </a>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 992px) {
          .er-highlight-card {
            flex-direction: column;
            text-align: center;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}
