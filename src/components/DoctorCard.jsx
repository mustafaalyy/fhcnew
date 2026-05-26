import React from "react";
import { Star, Calendar, Award } from "lucide-react";

export default function DoctorCard({ doctor, onBookClick }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i < fullStars ? "var(--color-gold)" : "none"}
          color={i < fullStars ? "var(--color-gold)" : "#cbd5e1"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="luxury-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.5rem" }}>
      
      {/* Image and Specialty Badge */}
      <div style={{ position: "relative", marginBottom: "1.25rem", borderRadius: "var(--border-radius-md)", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "var(--color-light)" }}>
        <img 
          src={doctor.image} 
          alt={doctor.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
        <div 
          style={{ 
            position: "absolute", 
            top: "0.75rem", 
            right: "0.75rem", 
            backgroundColor: "rgba(28, 43, 53, 0.85)", 
            color: "var(--color-white)", 
            padding: "0.3rem 0.8rem", 
            borderRadius: "var(--border-radius-sm)", 
            fontSize: "0.8rem", 
            fontWeight: "600",
            backdropFilter: "blur(4px)"
          }}
        >
          {doctor.specialtyName}
        </div>
        {doctor.featured && (
          <div 
            style={{ 
              position: "absolute", 
              bottom: "0.75rem", 
              left: "0.75rem", 
              backgroundColor: "var(--color-primary)", 
              color: "var(--color-white)", 
              padding: "0.3rem 0.8rem", 
              borderRadius: "var(--border-radius-sm)", 
              fontSize: "0.8rem", 
              fontWeight: "bold",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            استشاري أول / رئيس مجلس الإدارة
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--color-dark)" }}>{doctor.name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            {renderStars(doctor.rating)}
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", marginRight: "0.25rem" }}>
              ({doctor.reviewsCount})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
          {doctor.tags.map((tag, i) => (
            <span 
              key={i} 
              style={{ 
                fontSize: "0.75rem", 
                backgroundColor: i === 0 ? "rgba(42, 157, 181, 0.08)" : "rgba(90, 171, 107, 0.08)", 
                color: i === 0 ? "var(--color-primary)" : "var(--color-secondary)", 
                padding: "0.2rem 0.6rem", 
                borderRadius: "var(--border-radius-sm)",
                fontWeight: "500"
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Experience summary */}
        <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", marginBottom: "1.25rem", flexGrow: 1, lineHeight: "1.6" }}>
          {doctor.experience}
        </p>

        {/* Credentials preview */}
        {doctor.credentials && doctor.credentials.length > 0 && (
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginBottom: "1.25rem" }}>
            <h4 style={{ fontSize: "0.85rem", color: "var(--color-dark)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.5rem" }}>
              <Award size={14} style={{ color: "var(--color-primary)" }} />
              المؤهلات العلمية:
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.25rem", paddingRight: "0.5rem" }}>
              {doctor.credentials.slice(0, 2).map((cred, i) => (
                <li key={i} style={{ fontSize: "0.8rem", color: "var(--color-text)", position: "relative", paddingRight: "0.8rem" }}>
                  <span style={{ position: "absolute", right: 0, top: "0.5rem", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--color-secondary)" }}></span>
                  {cred}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={() => onBookClick(doctor)}
          className="btn btn-secondary"
          style={{ width: "100%", fontSize: "0.95rem", gap: "0.5rem" }}
        >
          <Calendar size={16} />
          احجز موعد الآن
        </button>
      </div>
    </div>
  );
}
