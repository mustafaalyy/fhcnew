import React, { useState, useEffect } from "react";
import { 
  User, Phone, Key, Calendar, FileText, Activity, 
  Printer, LogOut, Heart, FlaskConical, Eye, ChevronLeft, 
  CheckCircle, Clock, AlertCircle, FileSpreadsheet, Lock
} from "lucide-react";
import { useHospital } from "../context/HospitalContext";

export default function PatientPortal() {
  const { bookings, prescriptions, reports, settings } = useHospital();
  
  // Login State
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpNotification, setOtpNotification] = useState("");
  
  // Session State
  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings"); // bookings, prescriptions, reports
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // OTP Countdown timer
  useEffect(() => {
    let interval;
    if (showOtp && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, otpTimer]);

  // Login handler - Direct verify phone & bookingId (no OTP)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !bookingId.trim()) {
      setError("الرجاء إدخال رقم الهاتف ورقم الحجز");
      return;
    }

    const cleanPhone = phone.trim();
    const cleanBookingId = bookingId.trim().toUpperCase();

    const matchingBooking = bookings.find(
      (b) => {
        const bId = (b.id || "").toString().trim().toUpperCase();
        const bPhone = (b.phone || "").toString().trim().replace(/\s/g, "");
        const inputPhone = cleanPhone.replace(/\s/g, "");
        return bId === cleanBookingId && bPhone === inputPhone;
      }
    );

    if (!matchingBooking) {
      setError("لم يتم العثور على حجز متطابق. يرجى التحقق من البيانات المدخلة.");
      return;
    }

    // Load all patient bookings by phone
    const patientBookings = bookings.filter((b) => b.phone === cleanPhone);
    setPatientData({
      name: matchingBooking.patientName,
      phone: cleanPhone,
      age: matchingBooking.age,
      bookings: patientBookings
    });
  };

  // Logout handler
  const handleLogout = () => {
    setPatientData(null);
    setPhone("");
    setBookingId("");
    setShowOtp(false);
    setOtp("");
    setError("");
  };

  // Filter patient specific data
  const patientPhone = patientData?.phone || "";
  const patientBookingIds = patientData?.bookings.map(b => b.id) || [];

  const myPrescriptions = prescriptions.filter(
    (p) => p.phone === patientPhone || patientBookingIds.includes(p.bookingId)
  );

  const myReports = reports.filter(
    (r) => r.phone === patientPhone || patientBookingIds.includes(r.bookingId)
  );

  // Status Translators
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", backgroundColor: "rgba(90, 171, 107, 0.15)", color: "var(--color-secondary)" }}>
            <CheckCircle size={14} /> مؤكد
          </span>
        );
      case "pending":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
            <Clock size={14} /> قيد التأكيد
          </span>
        );
      case "cancelled":
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
            <AlertCircle size={14} /> ملغي
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "80vh", padding: "3rem 0", direction: "rtl" }}>
      
      {/* Simulation Notification SMS */}
      {otpNotification && (
        <div 
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            left: "20px",
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderLeft: "4px solid var(--color-primary)",
            fontSize: "0.9rem",
            animation: "slide-up-fade 0.4s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              💬 رسالة نصية قصيرة (SMS)
            </span>
            <button 
              onClick={() => setOtpNotification("")} 
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.8rem", marginRight: "auto" }}
            >
              إغلاق
            </button>
          </div>
          <p style={{ margin: 0, lineHeight: "1.4" }}>{otpNotification}</p>
        </div>
      )}

      <div className="container">
        
              {!patientData ? (
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ display: "inline-flex", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "rgba(42, 157, 181, 0.1)", color: "var(--color-primary)", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <Lock size={28} />
              </div>
              <h2 style={{ fontFamily: "Cormorant Garamond, Tajawal", fontSize: "2rem", color: "var(--color-dark)", fontWeight: "bold" }}>
                بوابة المريض الإلكترونية
              </h2>
              <p style={{ color: "var(--color-text-light)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
                قم بالوصول الآمن لملفك الطبي، الروشتات، ونتائج الفحوصات والتحاليل
              </p>
            </div>

            <div style={{ backgroundColor: "var(--color-white)", borderRadius: "16px", padding: "2.5rem 2rem", boxShadow: "0 10px 30px rgba(28, 43, 53, 0.05)", border: "1px solid rgba(42, 157, 181, 0.08)" }}>
              <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {error && (
                  <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#ef4444", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-dark)" }}>رقم الهاتف المسجل بالحجز</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
                    <input type="tel" placeholder="مثال: 01099887766" value={phone} onChange={(e) => setPhone(e.target.value)}
                      style={{ width: "100%", padding: "0.75rem 2.5rem 0.75rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem" }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--color-dark)" }}>رقم مرجع الحجز</label>
                  <div style={{ position: "relative" }}>
                    <Key size={18} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
                    <input type="text" placeholder="مثال: FHH-2026-8092" value={bookingId} onChange={(e) => setBookingId(e.target.value)}
                      style={{ width: "100%", padding: "0.75rem 2.5rem 0.75rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "1rem", textTransform: "uppercase" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>* تجد رقم الحجز في إيصال تأكيد الحجز الذي استلمته عند الحجز</span>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem", fontWeight: "bold" }}>
                  دخول الملف الطبي
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Patient Header Card */}
            <div 
              style={{
                backgroundColor: "var(--color-dark)",
                borderRadius: "16px",
                padding: "2rem",
                color: "var(--color-white)",
                boxShadow: "0 10px 25px rgba(28,43,53,0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.5rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                <div 
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "2px solid var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary)"
                  }}
                >
                  <User size={30} />
                </div>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.6)" }}>مرحباً بك في بوابتك الصحية</span>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: "bold", margin: "0.2rem 0 0 0" }}>{patientData.name}</h2>
                  <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)" }}>
                    <span>السن: {patientData.age} سنة</span>
                    <span>رقم الملف: FHP-{patientData.phone.substring(phone.length - 4)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  onClick={handleLogout}
                  className="btn"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    color: "#f87171",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    padding: "0.6rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <LogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>

            {/* Main Section: Tabs & Info */}
            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "2rem" }} className="portal-grid">
              
              {/* Sidebar Tabs */}
              <div 
                style={{
                  backgroundColor: "var(--color-white)",
                  borderRadius: "16px",
                  padding: "1.2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  height: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  border: "1px solid #f1f5f9"
                }}
              >
                <h3 style={{ fontSize: "0.9rem", color: "var(--color-text-light)", padding: "0 0.5rem 0.5rem 0.5rem", borderBottom: "1px solid #f1f5f9", margin: "0 0 0.5rem 0" }}>
                  ملفي الطبي
                </h3>

                <button
                  onClick={() => { setActiveTab("bookings"); setSelectedReport(null); setSelectedPrescription(null); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: "none",
                    width: "100%",
                    textAlign: "right",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    backgroundColor: activeTab === "bookings" ? "rgba(42, 157, 181, 0.08)" : "transparent",
                    color: activeTab === "bookings" ? "var(--color-primary)" : "var(--color-dark)"
                  }}
                >
                  <Calendar size={18} />
                  <span>مواعيد الحجوزات</span>
                </button>

                <button
                  onClick={() => { setActiveTab("prescriptions"); setSelectedReport(null); setSelectedPrescription(null); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: "none",
                    width: "100%",
                    textAlign: "right",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    backgroundColor: activeTab === "prescriptions" ? "rgba(42, 157, 181, 0.08)" : "transparent",
                    color: activeTab === "prescriptions" ? "var(--color-primary)" : "var(--color-dark)"
                  }}
                >
                  <FileText size={18} />
                  <span>الروشتات الطبية ({myPrescriptions.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab("reports"); setSelectedReport(null); setSelectedPrescription(null); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    border: "none",
                    width: "100%",
                    textAlign: "right",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    backgroundColor: activeTab === "reports" ? "rgba(42, 157, 181, 0.08)" : "transparent",
                    color: activeTab === "reports" ? "var(--color-primary)" : "var(--color-dark)"
                  }}
                >
                  <Activity size={18} />
                  <span>التقارير والتحاليل ({myReports.length})</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div 
                style={{
                  backgroundColor: "var(--color-white)",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                  border: "1px solid #f1f5f9"
                }}
              >
                
                {/* 1. BOOKINGS TAB */}
                {activeTab === "bookings" && (
                  <div>
                    <h3 style={{ fontSize: "1.4rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "1.5rem" }}>
                      سجل زياراتي ومواعيدي
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {patientData.bookings.map((booking) => (
                        <div 
                          key={booking.id}
                          style={{
                            border: "1px solid #f1f5f9",
                            borderRadius: "12px",
                            padding: "1.2rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "1rem",
                            backgroundColor: "#fafcfd"
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>رقم الحجز: {booking.id}</span>
                            <span style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--color-dark)" }}>{booking.specialtyName}</span>
                            <span style={{ fontSize: "0.9rem", color: "var(--color-text)" }}>الطبيب: {booking.doctorName}</span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                            {getStatusBadge(booking.status)}
                            <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                              <Calendar size={14} /> {booking.date} - {booking.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. PRESCRIPTIONS TAB */}
                {activeTab === "prescriptions" && !selectedPrescription && (
                  <div>
                    <h3 style={{ fontSize: "1.4rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "1.5rem" }}>
                      الروشتات والوصفات الطبية الصادرة
                    </h3>
                    {myPrescriptions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-light)" }}>
                        <FileText size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                        <p>لا توجد روشتات طبية مصدرة لهذا الملف حتى الآن.</p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }} className="prescriptions-grid">
                        {myPrescriptions.map((rx) => (
                          <div 
                            key={rx.id}
                            style={{
                              border: "1px solid #f1f5f9",
                              borderRadius: "12px",
                              padding: "1.5rem",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              backgroundColor: "#fff",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.01)",
                              cursor: "pointer",
                              transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                            className="hover-card"
                            onClick={() => setSelectedPrescription(rx)}
                          >
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>تاريخ: {rx.date}</span>
                                <span style={{ fontWeight: "bold", fontSize: "0.85rem", padding: "0.2rem 0.6rem", borderRadius: "6px", backgroundColor: "rgba(42, 157, 181, 0.1)", color: "var(--color-primary)" }}>
                                  روشتة
                                </span>
                              </div>
                              <h4 style={{ fontWeight: "bold", color: "var(--color-dark)", fontSize: "1.05rem", margin: "0 0 0.5rem 0" }}>
                                {rx.doctorName}
                              </h4>
                              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", margin: 0, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                التشخيص: {rx.diagnosis || "متابعة دورية"}
                              </p>
                              <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--color-text)" }}>
                                <strong>الأدوية الموصوفة ({rx.medicines?.length || 0}):</strong>
                                <ul style={{ paddingRight: "1.2rem", margin: "0.3rem 0" }}>
                                  {rx.medicines?.slice(0, 2).map((med, index) => (
                                    <li key={index}>{med.name}</li>
                                  ))}
                                  {(rx.medicines?.length || 0) > 2 && <li>وغيرها...</li>}
                                </ul>
                              </div>
                            </div>

                            <button 
                              className="btn btn-outline" 
                              style={{ width: "100%", padding: "0.5rem", marginTop: "1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}
                            >
                              <Eye size={14} /> عرض وتفاصيل
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SELECTED PRESCRIPTION VIEW */}
                {activeTab === "prescriptions" && selectedPrescription && (
                  <div>
                    <button 
                      onClick={() => setSelectedPrescription(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-primary)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontWeight: "600",
                        marginBottom: "1.5rem"
                      }}
                    >
                      <ChevronLeft size={16} /> العودة إلى الروشتات
                    </button>

                    {/* Prescription Sheet Box */}
                    <div 
                      id="printable-rx"
                      style={{
                        border: "2px solid var(--color-dark)",
                        borderRadius: "12px",
                        padding: "2.5rem 2rem",
                        backgroundColor: "#fff",
                        fontFamily: "Tajawal, sans-serif",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Hospital Heading */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--color-primary)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                        <div>
                          <h2 style={{ fontFamily: "Cormorant Garamond, Tajawal", fontWeight: "bold", fontSize: "1.6rem", color: "var(--color-dark)", margin: 0 }}>
                            {settings.hospitalName || "Family Health Care Hospital"}
                          </h2>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>تحت إشراف د. محمد صدقي عبدالقادر</span>
                        </div>
                        <div style={{ textAlign: "left", fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                          <div>هاتف: {settings.phone}</div>
                          <div>واتساب: {settings.whatsapp}</div>
                        </div>
                      </div>

                      {/* Patient info details */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", marginBottom: "2rem", fontSize: "0.9rem" }}>
                        <div><strong>اسم المريض:</strong> {selectedPrescription.patientName}</div>
                        <div><strong>التاريخ:</strong> {selectedPrescription.date}</div>
                        <div><strong>رقم الحجز:</strong> {selectedPrescription.bookingId}</div>
                        <div><strong>الطبيب المعالج:</strong> {selectedPrescription.doctorName}</div>
                      </div>

                      {/* Diagnosis */}
                      <div style={{ marginBottom: "2rem" }}>
                        <h5 style={{ fontWeight: "bold", fontSize: "1.05rem", color: "var(--color-dark)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
                          التشخيص الطبي (Diagnosis)
                        </h5>
                        <p style={{ fontSize: "0.95rem", color: "var(--color-text)", margin: 0 }}>
                          {selectedPrescription.diagnosis || "متابعة طبية عامة."}
                        </p>
                      </div>

                      {/* RX Logo Watermark style */}
                      <div style={{ fontSize: "3rem", fontWeight: "bold", color: "rgba(42, 157, 181, 0.1)", position: "absolute", right: "2rem", top: "18rem" }}>
                        ℞
                      </div>

                      {/* Medicines Table */}
                      <div style={{ marginBottom: "2.5rem" }}>
                        <h5 style={{ fontWeight: "bold", fontSize: "1.05rem", color: "var(--color-dark)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "0.8rem" }}>
                          العلاج والجرعات (Prescribed Medications)
                        </h5>
                        
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", textAlign: "right" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
                              <th style={{ padding: "0.75rem 1rem", fontWeight: "bold" }}>اسم الدواء</th>
                              <th style={{ padding: "0.75rem 1rem", fontWeight: "bold" }}>الجرعة</th>
                              <th style={{ padding: "0.75rem 1rem", fontWeight: "bold" }}>التكرار</th>
                              <th style={{ padding: "0.75rem 1rem", fontWeight: "bold" }}>المدة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPrescription.medicines?.map((med, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: "600", color: "var(--color-primary)" }}>{med.name}</td>
                                <td style={{ padding: "0.75rem 1rem" }}>{med.dosage}</td>
                                <td style={{ padding: "0.75rem 1rem" }}>{med.frequency}</td>
                                <td style={{ padding: "0.75rem 1rem" }}>{med.period}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Notes / Instructions */}
                      {selectedPrescription.notes && (
                        <div style={{ borderLeft: "3px solid var(--color-secondary)", paddingLeft: "1rem", paddingRight: "1rem", marginBottom: "2rem", fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                          <strong>إرشادات ونصائح إضافية:</strong>
                          <p style={{ margin: "0.3rem 0 0 0", lineHeight: "1.4" }}>{selectedPrescription.notes}</p>
                        </div>
                      )}

                      {/* Footer signatures */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "3rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                          * يرجى إبراز هذه الروشتة في صيدلية المستشفى للحصول على خصم 10%
                        </span>
                        
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", display: "block" }}>توقيع الطبيب</span>
                          <span style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "1.3rem", fontWeight: "bold", fontStyle: "italic", color: "var(--color-primary)" }}>
                            {selectedPrescription.doctorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Print Action Trigger */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                      <button 
                        onClick={() => window.print()}
                        className="btn btn-primary"
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.5rem" }}
                      >
                        <Printer size={16} />
                        طباعة الروشتة
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. REPORTS TAB */}
                {activeTab === "reports" && !selectedReport && (
                  <div>
                    <h3 style={{ fontSize: "1.4rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "1.5rem" }}>
                      نتائج التحاليل وتقارير الأشعة التشخيصية
                    </h3>
                    {myReports.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-light)" }}>
                        <FlaskConical size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                        <p>لا توجد نتائج فحوصات معملية أو أشعة متوفرة حالياً.</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {myReports.map((rep) => (
                          <div 
                            key={rep.id}
                            style={{
                              border: "1px solid #f1f5f9",
                              borderRadius: "12px",
                              padding: "1.2rem",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "1rem",
                              backgroundColor: "#fff",
                              boxShadow: "0 2px 10px rgba(0,0,0,0.01)"
                            }}
                          >
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <div 
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "10px",
                                  backgroundColor: rep.type === "lab" ? "rgba(42, 157, 181, 0.1)" : "rgba(90, 171, 107, 0.1)",
                                  color: rep.type === "lab" ? "var(--color-primary)" : "var(--color-secondary)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                {rep.type === "lab" ? <FlaskConical size={20} /> : <Activity size={20} />}
                              </div>

                              <div>
                                <h4 style={{ fontWeight: "bold", color: "var(--color-dark)", fontSize: "1.05rem", margin: 0 }}>
                                  {rep.title}
                                </h4>
                                <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                                  نوع الفحص: {rep.type === "lab" ? "تحليل دم/مخبري" : "أشعة تشخيصية"} | طبيب: {rep.doctorName}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                              <div style={{ textAlign: "left", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                                <div>تاريخ: {rep.date}</div>
                                <span style={{ color: rep.status === "ready" ? "var(--color-secondary)" : "#d97706", fontWeight: "bold" }}>
                                  {rep.status === "ready" ? "✓ جاهز" : "⏳ قيد المعالجة"}
                                </span>
                              </div>

                              {rep.status === "ready" ? (
                                <button 
                                  onClick={() => setSelectedReport(rep)}
                                  className="btn btn-outline"
                                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                                >
                                  <Eye size={14} /> عرض التقرير
                                </button>
                              ) : (
                                <button 
                                  disabled
                                  className="btn"
                                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", backgroundColor: "#f1f5f9", color: "#94a3b8", cursor: "not-allowed", border: "1px solid #e2e8f0" }}
                                >
                                  قيد المراجعة
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SELECTED REPORT VIEW */}
                {activeTab === "reports" && selectedReport && (
                  <div>
                    <button 
                      onClick={() => setSelectedReport(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-primary)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontWeight: "600",
                        marginBottom: "1.5rem"
                      }}
                    >
                      <ChevronLeft size={16} /> العودة إلى التقارير
                    </button>

                    {/* Diagnostic Sheet Box */}
                    <div 
                      id="printable-report"
                      style={{
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "2.5rem 2rem",
                        backgroundColor: "#fff",
                        fontFamily: "Tajawal, sans-serif"
                      }}
                    >
                      {/* Logo and report title header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--color-secondary)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                        <div>
                          <h2 style={{ fontFamily: "Cormorant Garamond, Tajawal", fontWeight: "bold", fontSize: "1.5rem", color: "var(--color-dark)", margin: 0 }}>
                            {selectedReport.type === "lab" ? "قسم التحاليل الطبية والدم" : "قسم الأشعة والتصوير الطبي"}
                          </h2>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>{settings.hospitalName || "مستشفى فيميلي هيلث كير"}</span>
                        </div>
                        <div style={{ textAlign: "left", fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                          <strong>رقم الفحص:</strong> {selectedReport.id.toUpperCase()}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", marginBottom: "2rem", fontSize: "0.9rem" }}>
                        <div><strong>المريض:</strong> {selectedReport.patientName}</div>
                        <div><strong>تاريخ الفحص:</strong> {selectedReport.date}</div>
                        <div><strong>الطبيب الطالب للفحص:</strong> {selectedReport.doctorName}</div>
                        <div><strong>عنوان الفحص:</strong> {selectedReport.title}</div>
                      </div>

                      {/* Results block */}
                      <div style={{ marginBottom: "2.5rem" }}>
                        <h4 style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--color-dark)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                          نتائج الفحص التفصيلية (Detailed Results)
                        </h4>
                        
                        {/* If Lab report, show split results, otherwise text block */}
                        {selectedReport.type === "lab" ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {selectedReport.resultText.split("\n").map((line, idx) => {
                              const parts = line.split(":");
                              if (parts.length > 1) {
                                return (
                                  <div 
                                    key={idx} 
                                    style={{ 
                                      display: "flex", 
                                      justifyContent: "space-between", 
                                      padding: "0.75rem 1rem", 
                                      borderRadius: "6px", 
                                      backgroundColor: idx % 2 === 0 ? "#fafcfd" : "#fff",
                                      borderBottom: "1px solid #f1f5f9"
                                    }}
                                  >
                                    <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{parts[0]}</span>
                                    <span style={{ fontFamily: "monospace", fontSize: "1rem", color: "var(--color-primary)", fontWeight: "bold" }}>{parts[1]}</span>
                                  </div>
                                );
                              }
                              return <p key={idx} style={{ margin: "0.3rem 0", lineHeight: "1.4" }}>{line}</p>;
                            })}
                          </div>
                        ) : (
                          <div 
                            style={{ 
                              whiteSpace: "pre-line", 
                              lineHeight: "1.8", 
                              fontSize: "0.95rem", 
                              color: "var(--color-text)", 
                              backgroundColor: "#fafcfd", 
                              padding: "1.5rem", 
                              borderRadius: "8px",
                              border: "1px solid #f1f5f9" 
                            }}
                          >
                            {selectedReport.resultText}
                          </div>
                        )}
                      </div>

                      {/* Diagnostic Notes */}
                      {selectedReport.notes && (
                        <div style={{ backgroundColor: "rgba(90, 171, 107, 0.05)", borderRight: "4px solid var(--color-secondary)", padding: "1rem", borderRadius: "6px", marginBottom: "2rem", fontSize: "0.85rem" }}>
                          <strong style={{ color: "var(--color-secondary)" }}>ملاحظات أخصائي الفحص:</strong>
                          <p style={{ margin: "0.3rem 0 0 0", lineHeight: "1.4", color: "var(--color-text)" }}>{selectedReport.notes}</p>
                        </div>
                      )}

                      {/* Sign-off Stamps */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--color-secondary)", fontWeight: "bold", border: "2px solid var(--color-secondary)", padding: "0.3rem 0.8rem", borderRadius: "6px", textTransform: "uppercase" }}>
                          ✓ معتمد وموثق الكترونياً
                        </span>
                        
                        <div style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", display: "block" }}>أخصائي المعمل/الأشعة</span>
                          <strong style={{ color: "var(--color-dark)" }}>د. محمد صدقي عبدالقادر</strong>
                        </div>
                      </div>
                    </div>

                    {/* Print Trigger */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}>
                      <button 
                        onClick={() => window.print()}
                        className="btn btn-primary"
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.5rem" }}
                      >
                        <Printer size={16} />
                        طباعة التقرير
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(28,43,53,0.06) !important;
          border-color: rgba(42, 157, 181, 0.2) !important;
        }

        @media (max-width: 768px) {
          .portal-grid {
            grid-template-columns: 1fr !important;
          }
          .prescriptions-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-rx, #printable-rx *, #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-rx, #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
