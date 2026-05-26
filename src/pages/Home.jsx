import React, { useState, useEffect, useRef } from "react";
import { Search, Calendar, Star, CheckCircle, Award } from "lucide-react";

// Hook for scroll-triggered fade-in
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
import { useHospital } from "../context/HospitalContext";
import Slideshow from "../components/Slideshow";
import StatsBar from "../components/StatsBar";
import ServiceCard from "../components/ServiceCard";

export default function Home({ setCurrentTab, setSelectedSpecialtyId, setSelectedDoctorId }) {
  const { specialties, doctors, settings } = useHospital();
  
  // Search state
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [searchName, setSearchName] = useState("");

  // Scroll animation refs
  const [specRef, specVisible] = useFadeIn();
  const [testRef, testVisible] = useFadeIn();
  const [drRef, drVisible] = useFadeIn();

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedSpecialtyId(searchSpecialty);
    setSelectedDoctorId(""); // clear doctor filter first
    // In order to apply name search, we can pass it or simply go to doctors page
    setCurrentTab("doctors");
  };

  const handleSpecialtyBook = (specialtyId) => {
    setSelectedSpecialtyId(specialtyId);
    setCurrentTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDoctorBook = (doctor) => {
    setSelectedSpecialtyId(doctor.specialtyId);
    setSelectedDoctorId(doctor.id);
    setCurrentTab("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select 4 specialties for homepage
  const homeSpecialties = specialties.slice(0, 4);

  // Find Dr. Mohamed Sedky
  const drSedky = doctors.find((d) => d.id === "dr-mohamed-sedky");

  // Mock Testimonials
  const testimonials = [
    {
      name: "أحمد عبد العزيز",
      role: "مريض قلب سابق",
      text: "تجربتي مع د. محمد صدقي كانت ممتازة. الخدمة بالمستشفى ممتازة ومستوى النظافة والتعقيم يضاهي المستشفيات العالمية. أشكر كل الطاقم الطبي على الرعاية.",
      stars: 5
    },
    {
      name: "سارة الجارحي",
      role: "والدة الطفل عمر",
      text: "عيادة الأطفال ممتازة جداً. دكتورة ياسمين صلاح صبورة ولطيفة جداً مع طفلي، والمستشفى منظم والانتظار لم يتعدى 10 دقائق. تجربة مريحة جداً.",
      stars: 5
    },
    {
      name: "محمود الكردي",
      role: "مراجع عيادة العظام",
      text: "أجريت عملية جراحية بالركبة مع دكتور أحمد حسن، والحمد لله التعافي كان أسرع مما توقعت بفضل العلاج الطبيعي والمتابعة الدقيقة. مستشفى راقي بكل ما تحمله الكلمة.",
      stars: 5
    }
  ];

  return (
    <div>
      {/* Hero Slideshow */}
      <Slideshow setCurrentTab={setCurrentTab} />

      {/* Stats Section wrapper */}
      <section style={{ position: "relative", zIndex: 10, paddingBottom: "2rem" }}>
        <div className="container">
          <StatsBar />
        </div>
      </section>

      {/* Quick Booking Search */}
      <section style={{ padding: "3rem 0", backgroundColor: "var(--color-white)" }}>
        <div className="container">
          <form 
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: "1rem",
              backgroundColor: "var(--color-light)",
              padding: "1.5rem",
              borderRadius: "var(--border-radius-md)",
              boxShadow: "var(--shadow-sm)",
              alignItems: "center",
              flexWrap: "wrap",
              border: "1px solid var(--color-border)"
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                ابحث عن تخصص طبي
              </label>
              <select 
                className="form-input"
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
              >
                <option value="">كل التخصصات الطبية</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                اسم الطبيب
              </label>
              <input 
                type="text" 
                placeholder="مثال: د. محمد صدقي..." 
                className="form-input"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div style={{ minWidth: "150px", alignSelf: "flex-end" }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem", gap: "0.5rem" }}
              >
                <Search size={18} />
                ابحث الآن
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Services Block (4 Specialties) */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-light)" }} ref={specRef}>
        <div className="container">
          <div
            className="section-title"
            style={{ opacity: specVisible ? 1 : 0, transform: specVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
          >
            <h2>تخصصاتنا الطبية المتميزة</h2>
            <p>نقدم رعاية صحية شاملة ومتكاملة لعائلتك تحت إشراف نخبة من كبار الأطباء والاستشاريين</p>
          </div>

          <div className="grid-4">
            {homeSpecialties.map((spec, idx) => (
              <div
                key={spec.id}
                style={{
                  opacity: specVisible ? 1 : 0,
                  transform: specVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.5s ease ${0.1 + idx * 0.1}s, transform 0.5s ease ${0.1 + idx * 0.1}s`
                }}
              >
                <ServiceCard specialty={spec} onBookClick={handleSpecialtyBook} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button onClick={() => setCurrentTab("services")} className="btn btn-outline">
              عرض كافة الخدمات ({specialties.length} تخصص طبي)
            </button>
          </div>
        </div>
      </section>

      {/* Dr. Mohamed Sedky Profile Section */}
      {drSedky && (
        <section className="section-padding" ref={drRef} style={{ backgroundColor: "var(--color-white)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", opacity: drVisible ? 1 : 0, transform: drVisible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3.5rem", alignItems: "center" }} className="doctor-sedky-grid">
              
              {/* Doctor Image & Medal */}
              <div style={{ position: "relative" }}>
                <div 
                  style={{
                    borderRadius: "var(--border-radius-lg)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-luxury)",
                    border: "6px solid var(--color-white)"
                  }}
                >
                  <img 
                    src={drSedky.image} 
                    alt={drSedky.name}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
                <div 
                  style={{
                    position: "absolute",
                    bottom: "-1.5rem",
                    right: "-1.5rem",
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-white)",
                    padding: "1.5rem",
                    borderRadius: "var(--border-radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    border: "1px solid rgba(255,255,255,0.1)"
                  }}
                  className="exp-badge"
                >
                  <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-primary)", lineHeight: "1" }}>+20</span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>عاماً من الخبرة</span>
                </div>
              </div>

              {/* Doctor Credentials */}
              <div>
                <span 
                  style={{ 
                    color: "var(--color-primary)", 
                    fontWeight: "bold", 
                    fontSize: "0.95rem", 
                    display: "inline-block", 
                    marginBottom: "0.5rem" 
                  }}
                >
                  مؤسس ومدير المستشفى
                </span>
                <h2 style={{ fontSize: "2.5rem", color: "var(--color-dark)", fontWeight: "800", marginBottom: "1rem" }}>
                  {drSedky.name}
                </h2>
                <p style={{ fontSize: "1.1rem", color: "var(--color-text)", marginBottom: "1.5rem", lineHeight: "1.8" }}>
                  {drSedky.experience}
                </p>

                <h3 style={{ fontSize: "1.1rem", color: "var(--color-dark)", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Award style={{ color: "var(--color-secondary)" }} />
                  الشهادات والعضويات المهنية:
                </h3>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem", paddingRight: "0" }}>
                  {drSedky.credentials.map((cred, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.95rem" }}>
                      <CheckCircle size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.25rem" }} />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleDoctorBook(drSedky)}
                  className="btn btn-primary"
                  style={{ padding: "0.85rem 2rem" }}
                >
                  <Calendar size={18} />
                  احجز موعداً خاصاً مع الدكتور
                </button>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Testimonials section */}
      <section className="section-padding" style={{ backgroundColor: "var(--color-light)" }} ref={testRef}>
        <div className="container">
          <div className="section-title" style={{ opacity: testVisible ? 1 : 0, transform: testVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
            <h2>ماذا يقول مرضانا عنا؟</h2>
            <p>قصص نجاح ورسائل شكر من مرضى وثقوا برعاية مستشفى Family Health</p>
          </div>

          <div className="grid-3">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="luxury-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  opacity: testVisible ? 1 : 0,
                  transform: testVisible ? "translateY(0)" : "translateY(30px)",
                  transition: `opacity 0.5s ease ${idx * 0.15}s, transform 0.5s ease ${idx * 0.15}s`
                }}
              >
                <div style={{ display: "flex", gap: "0.2rem", marginBottom: "1rem" }}>
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>

                <p style={{ fontSize: "0.95rem", fontStyle: "italic", color: "var(--color-text)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                  "{test.text}"
                </p>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--color-dark)" }}>{test.name}</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>{test.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section 
        className="section-padding animate-fade"
        style={{
          backgroundColor: "var(--color-dark)",
          backgroundImage: "linear-gradient(to left, rgba(28, 43, 53, 0.95), rgba(42, 157, 181, 0.85)), url(https://images.unsplash.com/photo-1579684389782-64d84b5e982b?auto=format&fit=crop&q=80&w=1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "var(--color-white)",
          textAlign: "center"
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
            ابدأ رحلة رعايتك الطبية اليوم
          </h2>
          <p style={{ fontSize: "1.15rem", color: "rgba(255, 255, 255, 0.9)", marginBottom: "2.5rem", lineHeight: "1.8" }}>
            لا تتردد في حجز موعد طبي متكامل لك أو لأفراد عائلتك. عياداتنا الاستشارية تعمل بكامل طاقتها لخدمتكم، وقسم الطوارئ جاهز دائماً.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              onClick={() => setCurrentTab("booking")}
              className="btn btn-primary"
              style={{ padding: "0.9rem 2.2rem" }}
            >
              <Calendar size={18} />
              احجز موعدك الآن
            </button>
            <button 
              onClick={() => setCurrentTab("contact")}
              className="btn btn-outline"
              style={{ color: "#fff", borderColor: "#fff" }}
            >
              اتصل بنا
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 992px) {
          .doctor-sedky-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .exp-badge {
            right: 0 !important;
            bottom: 0 !important;
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
