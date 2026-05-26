import React from "react";
import { useHospital } from "../context/HospitalContext";
import { Award, ShieldAlert, Heart, Star, Target, Compass } from "lucide-react";

export default function About() {
  const { aboutSections, settings } = useHospital();

  if (!aboutSections.values) {
    return <div style={{ minHeight: "400px", padding: "4rem 0" }}></div>;
  }

  // Icons mapper for values
  const getValueIcon = (idx) => {
    switch (idx) {
      case 0: return <Heart size={28} style={{ color: "var(--color-primary)" }} />;
      case 1: return <Star size={28} style={{ color: "var(--color-secondary)" }} />;
      case 2: return <Award size={28} style={{ color: "var(--color-primary)" }} />;
      case 3: return <Compass size={28} style={{ color: "var(--color-secondary)" }} />;
      default: return <Heart size={28} style={{ color: "var(--color-primary)" }} />;
    }
  };

  return (
    <div style={{ backgroundColor: "var(--color-light)" }}>
      
      {/* Page Header */}
      <section 
        style={{
          padding: "5rem 0",
          backgroundColor: "var(--color-dark)",
          color: "var(--color-white)",
          backgroundImage: "linear-gradient(to bottom, rgba(28,43,53,0.9), rgba(28,43,53,0.95)), url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center"
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>عن المستشفى</h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", maxWidth: "700px", margin: "0 auto", lineHeight: "1.7" }}>
            تعرّف على مسيرة مستشفى Family Health Care ورؤيتنا في تقديم نموذج طبي رائد يجمع بين الفخامة والمسؤولية الإنسانية.
          </p>
        </div>
      </section>

      {/* Hospital Story Section */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3.5rem", alignItems: "center" }} className="about-story-grid">
            <div>
              <span style={{ color: "var(--color-primary)", fontWeight: "bold", fontSize: "0.95rem", display: "inline-block", marginBottom: "0.5rem" }}>
                قصتنا ومسيرتنا المهنية
              </span>
              <h2 style={{ fontSize: "2rem", color: "var(--color-dark)", fontWeight: "800", marginBottom: "1.5rem", lineHeight: "1.3" }}>
                رعاية صحية موثوقة لأفراد أسرتك منذ عام 2009
              </h2>
              <p style={{ fontSize: "1.05rem", color: "var(--color-text)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                {aboutSections.story}
              </p>
            </div>
            
            {/* Visual block */}
            <div style={{ position: "relative" }}>
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600" 
                alt="Hospital Clinic" 
                style={{ width: "100%", borderRadius: "var(--border-radius-lg)", boxShadow: "var(--shadow-luxury)", display: "block" }}
              />
              <div 
                style={{
                  position: "absolute",
                  top: "2rem",
                  right: "-2.5rem",
                  backgroundColor: "var(--color-secondary)",
                  color: "#fff",
                  padding: "1.25rem 2rem",
                  borderRadius: "var(--border-radius-md)",
                  boxShadow: "var(--shadow-md)"
                }}
                className="about-badge-float"
              >
                <h4 style={{ fontSize: "1.8rem", fontWeight: "bold", lineHeight: "1" }}>+15</h4>
                <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>سنة من التميز الطبي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision cards */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-light)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="about-cards-grid">
            
            {/* Mission Card */}
            <div className="luxury-card" style={{ padding: "2.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "14px", backgroundColor: "rgba(42, 157, 181, 0.08)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Target size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.75rem" }}>رسالتنا</h3>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text)", lineHeight: "1.7" }}>{aboutSections.mission}</p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="luxury-card" style={{ padding: "2.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "14px", backgroundColor: "rgba(90, 171, 107, 0.08)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Compass size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.75rem" }}>رؤيتنا</h3>
                <p style={{ fontSize: "0.95rem", color: "var(--color-text)", lineHeight: "1.7" }}>{aboutSections.vision}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values grid */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-white)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="section-title">
            <h2>قيمنا الجوهرية</h2>
            <p>المبادئ والقيم المهنية التي نلتزم بها في تعاملنا اليومي مع كل مريض</p>
          </div>

          <div className="grid-4">
            {aboutSections.values.map((val, idx) => (
              <div 
                key={idx}
                className="luxury-card"
                style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1.5rem" }}
              >
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: idx % 2 === 0 ? "rgba(42, 157, 181, 0.06)" : "rgba(90, 171, 107, 0.06)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                  {getValueIcon(idx)}
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.75rem" }}>{val.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", lineHeight: "1.6" }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Timeline section */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-light)", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div className="section-title">
            <h2>تطور المستشفى والخط الزمني</h2>
            <p>أبرز المحطات والإنجازات منذ التأسيس في 2009 حتى تطلعات عام 2025</p>
          </div>

          {/* Timeline flow */}
          <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto", padding: "2rem 0" }} className="timeline-container">
            
            {/* Center line */}
            <div 
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: "50%",
                transform: "translateX(50%)",
                width: "4px",
                backgroundColor: "var(--color-border)",
                zIndex: 1
              }}
              className="timeline-line"
            ></div>

            {aboutSections.timeline.map((node, idx) => (
              <div 
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: idx % 2 === 0 ? "flex-start" : "flex-end",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "3rem",
                  position: "relative",
                  zIndex: 2
                }}
                className="timeline-row"
              >
                {/* Year dot on the line */}
                <div 
                  style={{
                    position: "absolute",
                    right: "50%",
                    transform: "translateX(50%)",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: idx % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                    border: "4px solid var(--color-white)",
                    boxShadow: "var(--shadow-sm)"
                  }}
                  className="timeline-dot"
                ></div>

                {/* Content Box */}
                <div 
                  className="luxury-card animate-fade"
                  style={{
                    width: "45%",
                    padding: "1.5rem",
                    boxShadow: "var(--shadow-sm)",
                    backgroundColor: "var(--color-white)",
                    textAlign: "right"
                  }}
                  className="timeline-card"
                >
                  <span 
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "800",
                      color: idx % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                      display: "block",
                      marginBottom: "0.25rem"
                    }}
                  >
                    {node.year}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                    {node.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", lineHeight: "1.6" }}>
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-story-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .about-badge-float {
            right: 0 !important;
            bottom: 0 !important;
            top: auto !important;
          }
          .about-cards-grid {
            grid-template-columns: 1fr !important;
          }
          /* Timeline Mobile adjustment */
          .timeline-line {
            right: 15px !important;
            transform: none !important;
          }
          .timeline-row {
            justify-content: flex-start !important;
            padding-right: 45px;
          }
          .timeline-dot {
            right: 5px !important;
            transform: none !important;
          }
          .timeline-card {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
