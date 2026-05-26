import React from "react";
import { Award, Users, Stethoscope, HeartHandshake } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function StatsBar() {
  const { settings } = useHospital();
  
  if (!settings.stats) return null;

  const statItems = [
    {
      id: "exp",
      value: settings.stats.experience || "+15 سنة خبرة",
      label: "الخبرة المهنية الطبية",
      icon: Award,
      color: "var(--color-primary)"
    },
    {
      id: "pat",
      value: settings.stats.patients || "+8000 مريض",
      label: "مريض يثق برعايتنا سنوياً",
      icon: Users,
      color: "var(--color-secondary)"
    },
    {
      id: "docs",
      value: settings.stats.doctors || "+20 طبيب",
      label: "طبيب واستشاري متخصص",
      icon: Stethoscope,
      color: "var(--color-primary)"
    },
    {
      id: "sat",
      value: settings.stats.satisfaction || "98% رضا",
      label: "نسبة رضا المرضى وعائلاتهم",
      icon: HeartHandshake,
      color: "var(--color-secondary)"
    }
  ];

  return (
    <div 
      style={{
        backgroundColor: "var(--color-white)",
        boxShadow: "var(--shadow-md)",
        borderRadius: "var(--border-radius-md)",
        marginTop: "-4rem",
        position: "relative",
        zIndex: 5,
        border: "1px solid rgba(28, 43, 53, 0.08)"
      }}
    >
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)"
        }}
        className="stats-grid"
      >
        {statItems.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div 
              key={item.id}
              style={{
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                borderLeft: idx < 3 ? "1px solid var(--color-border)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem"
              }}
              className="stat-col"
            >
              <div 
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: `rgba(${item.id === "exp" || item.id === "docs" ? "42, 157, 181" : "90, 171, 107"}, 0.1)`,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.5rem"
                }}
              >
                <IconComp size={26} />
              </div>
              <h3 
                style={{ 
                  fontSize: "2rem", 
                  fontWeight: "800", 
                  color: "var(--color-dark)",
                  lineHeight: "1" 
                }}
              >
                {item.value}
              </h3>
              <p 
                style={{ 
                  fontSize: "0.9rem", 
                  color: "var(--color-text-light)",
                  fontWeight: "500" 
                }}
              >
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stat-col:nth-child(even) {
            border-left: none !important;
          }
          .stat-col {
            border-bottom: 1px solid var(--color-border);
          }
          .stat-col:nth-child(3), .stat-col:nth-child(4) {
            border-bottom: none;
          }
        }
        @media (max-width: 576px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stat-col {
            border-left: none !important;
            border-bottom: 1px solid var(--color-border) !important;
          }
          .stat-col:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </div>
  );
}
