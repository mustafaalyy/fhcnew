import React, { useEffect, useRef, useState } from "react";
import { Award, Users, Stethoscope, HeartHandshake } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

// Animated counter hook
function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numTarget = parseFloat(target);
    if (isNaN(numTarget)) { setCount(target); return; }
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numTarget);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatItem({ item, idx, visible }) {
  // Parse: "+15 سنة" -> prefix="+", number=15, suffix=" سنة"
  const raw = item.value || "";
  const match = raw.match(/^([+%]?)(\d+)(.*)$/);
  const prefix = match ? match[1] : "";
  const numPart = match ? parseInt(match[2]) : null;
  const suffix = match ? match[3] : raw;

  const counted = useCountUp(numPart, 1800, visible);
  const IconComp = item.icon;

  return (
    <div
      style={{
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        borderLeft: idx < 3 ? "1px solid var(--color-border)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${idx * 0.12}s, transform 0.5s ease ${idx * 0.12}s`
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
      <h3 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--color-dark)", lineHeight: "1" }}>
        {numPart !== null ? `${prefix}${counted}${suffix}` : raw}
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--color-text-light)", fontWeight: "500" }}>
        {item.label}
      </p>
    </div>
  );
}

export default function StatsBar() {
  const { settings } = useHospital();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!settings.stats) return null;

  const statItems = [
    { id: "exp",  value: settings.stats.experience || "+15 سنة خبرة",   label: "الخبرة المهنية الطبية",           icon: Award,         color: "var(--color-primary)" },
    { id: "pat",  value: settings.stats.patients   || "+8000 مريض",       label: "مريض يثق برعايتنا سنوياً",        icon: Users,         color: "var(--color-secondary)" },
    { id: "docs", value: settings.stats.doctors    || "+20 طبيب",          label: "طبيب واستشاري متخصص",             icon: Stethoscope,   color: "var(--color-primary)" },
    { id: "sat",  value: settings.stats.satisfaction || "98% رضا",         label: "نسبة رضا المرضى وعائلاتهم",      icon: HeartHandshake,color: "var(--color-secondary)" }
  ];

  return (
    <div
      ref={ref}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="stats-grid">
        {statItems.map((item, idx) => (
          <StatItem key={item.id} item={item} idx={idx} visible={visible} />
        ))}
      </div>
      <style>{`
        @media (max-width: 992px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-col:nth-child(even) { border-left: none !important; }
          .stat-col { border-bottom: 1px solid var(--color-border); }
          .stat-col:nth-child(3), .stat-col:nth-child(4) { border-bottom: none; }
        }
        @media (max-width: 576px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .stat-col { border-left: none !important; border-bottom: 1px solid var(--color-border) !important; }
          .stat-col:last-child { border-bottom: none !important; }
        }
      `}</style>
    </div>
  );
}
