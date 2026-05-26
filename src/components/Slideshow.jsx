import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function Slideshow({ setCurrentTab }) {
  const { slides } = useHospital();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleCtaClick = (link) => {
    if (link === "/book") {
      setCurrentTab("booking");
    } else if (link === "/doctors") {
      setCurrentTab("doctors");
    } else if (link === "/contact") {
      setCurrentTab("contact");
    } else {
      setCurrentTab("booking");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (slides.length === 0) {
    return <div style={{ height: "550px", backgroundColor: "var(--color-dark)" }}></div>;
  }

  return (
    <div style={{ position: "relative", height: "600px", overflow: "hidden", backgroundColor: "var(--color-dark)" }}>
      {/* Slides Container */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: idx === current ? 1 : 0,
            transform: idx === current ? "scale(1)" : "scale(1.05)",
            transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
            zIndex: idx === current ? 1 : 0,
            backgroundImage: `linear-gradient(to left, rgba(28, 43, 53, 0.85) 40%, rgba(28, 43, 53, 0.4)), url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Content Overlay */}
          <div className="container" style={{ zIndex: 2 }}>
            <div 
              style={{ 
                maxWidth: "650px", 
                opacity: idx === current ? 1 : 0, 
                transform: idx === current ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s"
              }}
            >
              <span 
                style={{ 
                  color: "var(--color-primary)", 
                  fontSize: "1rem", 
                  fontWeight: "bold", 
                  letterSpacing: "2px", 
                  textTransform: "uppercase",
                  display: "inline-block",
                  marginBottom: "1rem",
                  borderRight: "3px solid var(--color-primary)",
                  paddingRight: "0.75rem"
                }}
              >
                مستشفى عائلي بمعايير عالمية
              </span>
              <h2 
                style={{ 
                  fontSize: "3rem", 
                  fontWeight: "700", 
                  color: "var(--color-white)", 
                  lineHeight: "1.25", 
                  marginBottom: "1.5rem" 
                }}
              >
                {slide.title}
              </h2>
              <p 
                style={{ 
                  fontSize: "1.15rem", 
                  color: "rgba(255, 255, 255, 0.85)", 
                  marginBottom: "2.5rem",
                  lineHeight: "1.8" 
                }}
              >
                {slide.subtitle}
              </p>
              <div>
                <button
                  onClick={() => handleCtaClick(slide.ctaLink)}
                  className="btn btn-primary"
                  style={{ padding: "0.9rem 2.2rem", fontSize: "1.1rem", gap: "0.6rem" }}
                >
                  <Calendar size={20} />
                  {slide.ctaText || "احجز الآن"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Manual Slide Controls */}
      <button
        onClick={handlePrev}
        style={{
          position: "absolute",
          top: "50%",
          left: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: "absolute",
          top: "50%",
          right: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div 
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          gap: "0.75rem"
        }}
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: idx === current ? "var(--color-primary)" : "rgba(255,255,255,0.3)",
              transition: "var(--transition-smooth)"
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}
