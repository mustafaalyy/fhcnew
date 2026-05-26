import React from "react";
import * as Icons from "lucide-react";
import { ArrowLeft } from "lucide-react";

export default function ServiceCard({ specialty, onBookClick }) {
  // Dynamically resolve icon from Lucide
  const IconComponent = Icons[specialty.icon] || Icons.Stethoscope;

  return (
    <div className="luxury-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "2rem" }}>
      
      {/* Icon header */}
      <div 
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          backgroundColor: "rgba(42, 157, 181, 0.08)",
          color: "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem"
        }}
      >
        <IconComponent size={30} />
      </div>

      {/* Text Details */}
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <h3 
          style={{ 
            fontSize: "1.3rem", 
            fontWeight: "700", 
            color: "var(--color-dark)",
            marginBottom: "0.75rem" 
          }}
        >
          {specialty.name}
        </h3>
        
        <p 
          style={{ 
            fontSize: "0.95rem", 
            color: "var(--color-text-light)",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
            flexGrow: 1 
          }}
        >
          {specialty.description}
        </p>

        {/* Features/Sub-services preview */}
        {specialty.features && specialty.features.length > 0 && (
          <ul 
            style={{ 
              listStyle: "none", 
              paddingRight: "0", 
              marginBottom: "1.5rem", 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.5rem" 
            }}
          >
            {specialty.features.slice(0, 3).map((feat, index) => (
              <li 
                key={index} 
                style={{ 
                  fontSize: "0.85rem", 
                  color: "var(--color-text)", 
                  display: "flex", 
                  gap: "0.5rem", 
                  alignItems: "flex-start" 
                }}
              >
                <Icons.CheckCircle size={14} style={{ color: "var(--color-secondary)", flexShrink: 0, marginTop: "0.2rem" }} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Booking Trigger */}
        <button
          onClick={() => onBookClick(specialty.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-primary)",
            fontWeight: "700",
            fontSize: "0.9rem",
            padding: "0.5rem 0",
            alignSelf: "flex-start",
            borderBottom: "1px dashed transparent"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = "var(--color-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; }}
        >
          <span>احجز في هذا التخصص</span>
          <ArrowLeft size={16} style={{ transition: "transform 0.2s" }} className="arrow-icon" />
        </button>
      </div>

      <style>{`
        .luxury-card:hover .arrow-icon {
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}
