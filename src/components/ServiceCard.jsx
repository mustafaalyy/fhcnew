import React from "react";
import * as Icons from "lucide-react";
import { Calendar } from "lucide-react";

export default function ServiceCard({ specialty, onBookClick }) {
  const IconComponent = Icons[specialty.icon] || Icons.Stethoscope;

  return (
    <div
      className="luxury-card service-card-split"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 0,
        overflow: "hidden"
      }}
    >
      {/* TOP HALF: Icon + Name + Description */}
      <div style={{ padding: "1.5rem 1.5rem 1rem 1.5rem", flex: 1 }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "rgba(42, 157, 181, 0.08)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}
        >
          <IconComponent size={26} />
        </div>

        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
          {specialty.name}
        </h3>

        <p style={{ fontSize: "0.88rem", color: "var(--color-text-light)", lineHeight: "1.6" }}>
          {specialty.description}
        </p>
      </div>

      {/* DIVIDER */}
      <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0 1.5rem" }} />

      {/* BOTTOM HALF: Book button */}
      <div style={{ padding: "1rem 1.5rem" }}>
        <button
          onClick={() => onBookClick(specialty.id)}
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.65rem 1rem", fontSize: "0.9rem", gap: "0.4rem", justifyContent: "center" }}
        >
          <Calendar size={15} />
          احجز الآن
        </button>
      </div>

      <style>{`
        .service-card-split {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .service-card-split:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-luxury) !important;
        }
      `}</style>
    </div>
  );
}
