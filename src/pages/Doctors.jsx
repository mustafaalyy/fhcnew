import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import DoctorCard from "../components/DoctorCard";
import { Search, Stethoscope, Star, Award, CheckCircle } from "lucide-react";

export default function Doctors({ setCurrentTab, selectedSpecialtyId, setSelectedSpecialtyId, selectedDoctorId, setSelectedDoctorId }) {
  const { doctors, specialties } = useHospital();
  const [searchTerm, setSearchTerm] = useState("");

  const handleBook = (doctor) => {
    setSelectedSpecialtyId(doctor.specialtyId);
    setSelectedDoctorId(doctor.id);
    setCurrentTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter logic
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpecialty = selectedSpecialtyId ? doc.specialtyId === selectedSpecialtyId : true;
    const matchesName = searchTerm ? doc.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesSpecialty && matchesName;
  });

  // Find Featured Doctor (Dr. Mohamed Sedky)
  const featuredDoc = doctors.find((doc) => doc.featured);

  return (
    <div style={{ backgroundColor: "var(--color-light)", padding: "4rem 0" }}>
      <div className="container">
        
        {/* Page Title */}
        <div className="section-title">
          <h2>الفريق الطبي والاستشاريين</h2>
          <p>نخبة من كبار الأطباء وأعضاء هيئات التدريس بالجامعات المصرية وحملة الشهادات والزمالات الدولية</p>
        </div>

        {/* Featured Doctor Spotlight (at the top if filters are empty) */}
        {!selectedSpecialtyId && !searchTerm && featuredDoc && (
          <div 
            className="luxury-card animate-fade"
            style={{ 
              marginBottom: "3.5rem", 
              padding: "2.5rem", 
              border: "1px solid rgba(42, 157, 181, 0.2)",
              backgroundColor: "var(--color-white)",
              position: "relative"
            }}
          >
            {/* Banner Flag */}
            <div 
              style={{
                position: "absolute",
                top: 0,
                right: "2rem",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-white)",
                padding: "0.5rem 1.5rem",
                fontSize: "0.85rem",
                fontWeight: "bold",
                borderRadius: "0 0 var(--border-radius-sm) var(--border-radius-sm)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              طبيب متميز /featured doctor
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem", alignItems: "center" }} className="featured-doc-grid">
              
              {/* Doctor Pic */}
              <div style={{ borderRadius: "var(--border-radius-md)", overflow: "hidden", border: "4px solid var(--color-light)", boxShadow: "var(--shadow-md)" }}>
                <img 
                  src={featuredDoc.image} 
                  alt={featuredDoc.name}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>

              {/* Doctor Details */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.8rem", color: "var(--color-dark)", fontWeight: "800" }}>
                    {featuredDoc.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", backgroundColor: "rgba(251, 191, 36, 0.1)", padding: "0.25rem 0.6rem", borderRadius: "var(--border-radius-sm)" }}>
                    <Star size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                    <span style={{ color: "var(--color-dark)", fontWeight: "bold", fontSize: "0.9rem" }}>{featuredDoc.rating}</span>
                    <span style={{ color: "var(--color-text-light)", fontSize: "0.8rem" }}>({featuredDoc.reviewsCount} تقييم)</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  {featuredDoc.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      style={{ 
                        fontSize: "0.8rem", 
                        backgroundColor: idx === 0 ? "rgba(42, 157, 181, 0.1)" : "rgba(90, 171, 107, 0.1)",
                        color: idx === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "var(--border-radius-sm)",
                        fontWeight: "600"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: "1.05rem", color: "var(--color-text)", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                  {featuredDoc.experience}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.75rem" }} className="featured-creds-grid">
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Award size={16} style={{ color: "var(--color-primary)" }} />
                      الدرجات العلمية:
                    </h4>
                    <ul style={{ listStyle: "none", paddingRight: "0", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {featuredDoc.credentials.map((cred, idx) => (
                        <li key={idx} style={{ fontSize: "0.85rem", color: "var(--color-text)", display: "flex", gap: "0.4rem" }}>
                          <CheckCircle size={14} style={{ color: "var(--color-secondary)", flexShrink: 0, marginTop: "0.2rem" }} />
                          <span>{cred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Stethoscope size={16} style={{ color: "var(--color-secondary)" }} />
                      مواعيد التواجد والعيادة:
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: "0.5rem", fontWeight: "600" }}>
                      الأيام: {featuredDoc.schedule.days.join("، ")}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", fontWeight: "600" }}>
                      الساعات: {featuredDoc.schedule.hours.join(" و ")}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleBook(featuredDoc)}
                  className="btn btn-primary animate-fade"
                  style={{ padding: "0.8rem 2rem" }}
                >
                  حجز موعد فوري مع د. محمد صدقي
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div 
          style={{
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--border-radius-md)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem"
          }}
        >
          <div style={{ display: "flex", gap: "1rem", flex: 1, minWidth: "280px", flexWrap: "wrap" }}>
            
            {/* Specialty select filter */}
            <div style={{ flex: 1, minWidth: "200px" }}>
              <select
                className="form-input"
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
              >
                <option value="">كل التخصصات الطبية</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            </div>

            {/* Name text search filter */}
            <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
              <input
                type="text"
                placeholder="ابحث باسم الطبيب..."
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search 
                size={18} 
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-light)"
                }}
              />
            </div>

          </div>

          {(selectedSpecialtyId || searchTerm) && (
            <button
              onClick={() => {
                setSelectedSpecialtyId("");
                setSearchTerm("");
              }}
              style={{
                color: "var(--color-primary)",
                fontWeight: "bold",
                fontSize: "0.9rem"
              }}
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid-3 animate-fade">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBookClick={handleBook}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "var(--color-white)", borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border)" }}>
            <Stethoscope size={48} style={{ color: "var(--color-text-light)", marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "0.5rem" }}>
              عذراً، لم نجد أطباء يطابقون خيارات البحث
            </h3>
            <p style={{ color: "var(--color-text-light)" }}>
              يرجى محاولة تغيير الفلترة أو كتابة اسم طبيب آخر.
            </p>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 992px) {
          .featured-doc-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 576px) {
          .featured-creds-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
