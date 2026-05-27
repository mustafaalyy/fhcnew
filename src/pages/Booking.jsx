import React, { useState, useEffect } from "react";
import { useHospital } from "../context/HospitalContext";
import { Check, Calendar, ArrowLeft, ArrowRight, User, Stethoscope, Clock, CheckCircle, Printer } from "lucide-react";
import * as Icons from "lucide-react";

export default function Booking({ selectedSpecialtyId, setSelectedSpecialtyId, selectedDoctorId, setSelectedDoctorId }) {
  const { specialties, doctors, addBooking } = useHospital();
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Auto-advance step if filters are passed from other pages
  useEffect(() => {
    if (selectedSpecialtyId && step === 1) {
      setStep(2);
    }
    if (selectedDoctorId && step === 2) {
      setStep(3);
    }
  }, [selectedSpecialtyId, selectedDoctorId]);

  // List of doctors filtered by chosen specialty
  const filteredDoctors = doctors.filter((doc) => doc.specialtyId === selectedSpecialtyId);
  const selectedSpecialtyObj = specialties.find((s) => s.id === selectedSpecialtyId);
  const selectedDoctorObj = doctors.find((d) => d.id === selectedDoctorId);

  // Generate next 7 dates for the calendar (excluding Fridays as weekend)
  const getNext7Days = () => {
    const dates = [];
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    let addedCount = 0;
    let dayOffset = 0;
    
    while (addedCount < 7) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      
      const dayIndex = d.getDay();
      
      // Skip Friday (index 5)
      if (dayIndex !== 5) {
        const dateStr = d.toISOString().split("T")[0];
        dates.push({
          dateString: dateStr,
          dayName: dayNames[dayIndex],
          dayOfMonth: d.getDate(),
          monthName: months[d.getMonth()]
        });
        addedCount++;
      }
      dayOffset++;
    }
    return dates;
  };

  const bookingDates = getNext7Days();

  // Mock available time slots
  const timeSlots = [
    "10:00 ص", "11:00 ص", "11:30 ص", "12:30 م",
    "01:30 م", "05:00 م", "06:00 م", "07:30 م", "08:30 م"
  ];

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      if (step === 2) setSelectedSpecialtyId("");
      if (step === 3) setSelectedDoctorId("");
      setStep(step - 1);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!patientName || !phone || !age) {
      alert("يرجى ملء جميع البيانات الأساسية المطلوبة.");
      return;
    }

    const bookingPayload = {
      patientName,
      phone,
      age,
      notes,
      specialtyId: selectedSpecialtyId,
      specialtyName: selectedSpecialtyObj?.name || "",
      doctorId: selectedDoctorId,
      doctorName: selectedDoctorObj?.name || "",
      date: selectedDate,
      time: selectedTime,
      status: "pending"
    };

    const newBooking = await addBooking(bookingPayload);
    setConfirmedBooking(newBooking);
    setStep(5);
  };

  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (confirmedBooking?.id) {
      navigator.clipboard.writeText(confirmedBooking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSpecialtyId("");
    setSelectedDoctorId("");
    setSelectedDate("");
    setSelectedTime("");
    setPatientName("");
    setPhone("");
    setAge("");
    setNotes("");
    setConfirmedBooking(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: "var(--color-light)", padding: "4rem 0" }} className="booking-page-wrapper">
      <div className="container">
        
        {/* Step Indicator Header (visible if not confirmed yet) */}
        {step <= 4 && (
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", maxWidth: "600px", margin: "0 auto" }} className="booking-steps-nav">
              
              {/* Connecting line */}
              <div 
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "10px",
                  left: "10px",
                  height: "2px",
                  backgroundColor: "var(--color-border)",
                  zIndex: 1
                }}
              >
                <div 
                  style={{
                    height: "100%",
                    width: `${((step - 1) / 3) * 100}%`,
                    backgroundColor: "var(--color-primary)",
                    transition: "var(--transition-smooth)"
                  }}
                ></div>
              </div>

              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    zIndex: 2,
                    position: "relative" 
                  }}
                >
                  <div 
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: step >= num ? "var(--color-primary)" : "var(--color-white)",
                      color: step >= num ? "var(--color-white)" : "var(--color-text-light)",
                      border: `2px solid ${step >= num ? "var(--color-primary)" : "var(--color-border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      transition: "var(--transition-smooth)"
                    }}
                  >
                    {step > num ? <Check size={18} /> : num}
                  </div>
                  <span 
                    style={{ 
                      fontSize: "0.8rem", 
                      fontWeight: step === num ? "bold" : "normal", 
                      color: step === num ? "var(--color-dark)" : "var(--color-text-light)",
                      marginTop: "0.5rem"
                    }}
                  >
                    {num === 1 && "التخصص"}
                    {num === 2 && "الطبيب"}
                    {num === 3 && "التاريخ والوقت"}
                    {num === 4 && "بيانات المريض"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main layout */}
        {step <= 4 ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }} className="booking-layout">
            
            {/* Left side Wizard panel */}
            <div className="luxury-card" style={{ display: "flex", flexDirection: "column", minHeight: "450px" }}>
              
              {/* STEP 1: Specialty Selection */}
              {step === 1 && (
                <div className="animate-fade">
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
                    خطوة 1: اختر التخصص الطبي المطلوب
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="booking-specialties-grid">
                    {specialties.map((spec) => {
                      const IconComp = Icons[spec.icon] || Icons.Stethoscope;
                      return (
                        <div
                          key={spec.id}
                          onClick={() => {
                            setSelectedSpecialtyId(spec.id);
                            handleNextStep();
                          }}
                          style={{
                            padding: "1.5rem",
                            borderRadius: "var(--border-radius-md)",
                            border: `2px solid ${selectedSpecialtyId === spec.id ? "var(--color-primary)" : "var(--color-border)"}`,
                            backgroundColor: selectedSpecialtyId === spec.id ? "rgba(42, 157, 181, 0.04)" : "var(--color-white)",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "var(--transition-smooth)"
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; }}
                          onMouseLeave={(e) => { 
                            if (selectedSpecialtyId !== spec.id) e.currentTarget.style.borderColor = "var(--color-border)"; 
                          }}
                        >
                          <div style={{ color: "var(--color-primary)", display: "inline-flex", marginBottom: "0.75rem" }}>
                            <IconComp size={28} />
                          </div>
                          <h4 style={{ fontWeight: "700", color: "var(--color-dark)", fontSize: "1rem" }}>{spec.name}</h4>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Doctor Selection */}
              {step === 2 && (
                <div className="animate-fade">
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
                    خطوة 2: اختر الطبيب الاستشاري
                  </h3>
                  
                  {filteredDoctors.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="booking-docs-grid">
                      {filteredDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctorId(doc.id);
                            handleNextStep();
                          }}
                          style={{
                            display: "flex",
                            gap: "1rem",
                            padding: "1rem",
                            borderRadius: "var(--border-radius-md)",
                            border: `2px solid ${selectedDoctorId === doc.id ? "var(--color-primary)" : "var(--color-border)"}`,
                            backgroundColor: selectedDoctorId === doc.id ? "rgba(42, 157, 181, 0.04)" : "var(--color-white)",
                            cursor: "pointer",
                            transition: "var(--transition-smooth)",
                            alignItems: "center"
                          }}
                        >
                          <img 
                            src={doc.image} 
                            alt={doc.name} 
                            style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                          />
                          <div>
                            <h4 style={{ fontWeight: "bold", color: "var(--color-dark)", fontSize: "1.05rem" }}>{doc.name}</h4>
                            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)", display: "block", marginBottom: "0.25rem" }}>
                              {doc.tags[0]}
                            </span>
                            <div style={{ display: "flex", gap: "0.25rem", color: "var(--color-gold)" }}>
                              <Icons.Star size={12} fill="var(--color-gold)" />
                              <span style={{ fontSize: "0.75rem", color: "var(--color-dark)", fontWeight: "bold" }}>{doc.rating}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                      <p style={{ color: "var(--color-text-light)", marginBottom: "1.5rem" }}>
                        عذراً، لا يوجد أطباء متاحين حالياً في هذا التخصص. يرجى اختيار تخصص آخر.
                      </p>
                      <button onClick={handlePrevStep} className="btn btn-outline">العودة للتخصصات</button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Date and Time selection */}
              {step === 3 && (
                <div className="animate-fade">
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
                    خطوة 3: اختر موعد الكشف والزيارة
                  </h3>
                  
                  {/* Calendar Dates Grid */}
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-dark)" }}>
                    اختر تاريخ الكشف:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", marginBottom: "2rem" }} className="booking-dates-grid">
                    {bookingDates.map((item) => (
                      <div
                        key={item.dateString}
                        onClick={() => setSelectedDate(item.dateString)}
                        style={{
                          padding: "0.85rem 0.5rem",
                          borderRadius: "var(--border-radius-md)",
                          border: `2px solid ${selectedDate === item.dateString ? "var(--color-primary)" : "var(--color-border)"}`,
                          backgroundColor: selectedDate === item.dateString ? "var(--color-primary)" : "var(--color-white)",
                          color: selectedDate === item.dateString ? "var(--color-white)" : "var(--color-text)",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "var(--transition-smooth)"
                        }}
                      >
                        <span style={{ display: "block", fontSize: "0.75rem", opacity: selectedDate === item.dateString ? 0.9 : 0.7 }}>
                          {item.dayName}
                        </span>
                        <span style={{ display: "block", fontSize: "1.3rem", fontWeight: "bold", margin: "0.25rem 0" }}>
                          {item.dayOfMonth}
                        </span>
                        <span style={{ display: "block", fontSize: "0.75rem", opacity: selectedDate === item.dateString ? 0.9 : 0.7 }}>
                          {item.monthName}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  {selectedDate && (
                    <div className="animate-fade">
                      <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--color-dark)" }}>
                        اختر ساعة الكشف المتاحة:
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }} className="booking-times-grid">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              padding: "0.6rem",
                              borderRadius: "var(--border-radius-sm)",
                              border: `1px solid ${selectedTime === slot ? "var(--color-secondary)" : "var(--color-border)"}`,
                              backgroundColor: selectedTime === slot ? "var(--color-secondary)" : "var(--color-white)",
                              color: selectedTime === slot ? "var(--color-white)" : "var(--color-text)",
                              cursor: "pointer",
                              textAlign: "center",
                              fontWeight: "600",
                              fontSize: "0.85rem",
                              transition: "var(--transition-smooth)"
                            }}
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Patient details */}
              {step === 4 && (
                <div className="animate-fade">
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
                    خطوة 4: أدخل بيانات المريض لتأكيد الحجز
                  </h3>
                  
                  <form onSubmit={handleConfirmBooking} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }} className="patient-inputs-grid">
                      <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                          اسم المريض بالكامل *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="الاسم ثلاثي أو رباعي..."
                          className="form-input"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                          العمر (بالسنوات) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="مثال: 32"
                          className="form-input"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                        رقم الهاتف للتواصل وتأكيد الحجز *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="رقم الهاتف المحمول (مثال: 01012345678)"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.5rem" }}>
                        ملاحظات أو أعراض طبية (اختياري)
                      </label>
                      <textarea
                        rows="3"
                        placeholder="اكتب هنا أي تفاصيل أو تاريخ مرضي يهم الطبيب معرفته..."
                        className="form-input"
                        style={{ resize: "none" }}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>

                    {/* Notice */}
                    <div style={{ padding: "0.85rem", backgroundColor: "rgba(90, 171, 107, 0.06)", borderRadius: "var(--border-radius-sm)", borderRight: "4px solid var(--color-secondary)", fontSize: "0.85rem" }}>
                      بمجرد تأكيد الحجز، سيتم إصدار رقم مرجعي للحفظ. سيتصل بك فريق الاستقبال خلال ساعتين لتأكيد حضورك ومراجعة الموعد.
                    </div>
                  </form>
                </div>
              )}

              {/* Wizard Navigation Buttons */}
              <div 
                style={{ 
                  marginTop: "auto", 
                  paddingTop: "2rem", 
                  borderTop: "1px solid var(--color-border)", 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center" 
                }}
              >
                {step > 1 ? (
                  <button onClick={handlePrevStep} className="btn btn-outline" style={{ gap: "0.4rem" }}>
                    <ArrowRight size={16} />
                    السابق
                  </button>
                ) : (
                  <div></div>
                )}

                {step === 4 ? (
                  <button 
                    onClick={handleConfirmBooking}
                    className="btn btn-secondary" 
                    style={{ padding: "0.75rem 2.5rem" }}
                  >
                    تأكيد حجز الموعد
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary"
                    disabled={
                      (step === 1 && !selectedSpecialtyId) ||
                      (step === 2 && !selectedDoctorId) ||
                      (step === 3 && (!selectedDate || !selectedTime))
                    }
                    style={{
                      opacity: 
                        (step === 1 && !selectedSpecialtyId) ||
                        (step === 2 && !selectedDoctorId) ||
                        (step === 3 && (!selectedDate || !selectedTime))
                          ? 0.5 
                          : 1,
                      cursor: 
                        (step === 1 && !selectedSpecialtyId) ||
                        (step === 2 && !selectedDoctorId) ||
                        (step === 3 && (!selectedDate || !selectedTime))
                          ? "not-allowed" 
                          : "pointer",
                      gap: "0.4rem"
                    }}
                  >
                    التالي
                    <ArrowLeft size={16} />
                  </button>
                )}
              </div>

            </div>

            {/* Right side Booking Summary Sidebar */}
            <div 
              style={{
                alignSelf: "start",
                backgroundColor: "var(--color-dark)",
                color: "var(--color-white)",
                borderRadius: "var(--border-radius-md)",
                padding: "2rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
                ملخص الحجز الحالي
              </h3>
              
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem", paddingRight: "0" }}>
                
                {/* Specialty summary */}
                <li style={{ display: "flex", gap: "0.75rem" }}>
                  <Stethoscope size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>التخصص الطبي</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                      {selectedSpecialtyObj ? selectedSpecialtyObj.name : "لم يتم الاختيار بعد"}
                    </span>
                  </div>
                </li>

                {/* Doctor summary */}
                <li style={{ display: "flex", gap: "0.75rem" }}>
                  <User size={18} style={{ color: "var(--color-secondary)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>الطبيب المعالج</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                      {selectedDoctorObj ? selectedDoctorObj.name : "لم يتم الاختيار بعد"}
                    </span>
                  </div>
                </li>

                {/* Date summary */}
                <li style={{ display: "flex", gap: "0.75rem" }}>
                  <Calendar size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>تاريخ الزيارة</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                      {selectedDate ? selectedDate : "لم يتم الاختيار بعد"}
                    </span>
                  </div>
                </li>

                {/* Time summary */}
                <li style={{ display: "flex", gap: "0.75rem" }}>
                  <Clock size={18} style={{ color: "var(--color-secondary)", flexShrink: 0, marginTop: "0.2rem" }} />
                  <div>
                    <span style={{ display: "block", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>توقيت الكشف</span>
                    <span style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                      {selectedTime ? selectedTime : "لم يتم الاختيار بعد"}
                    </span>
                  </div>
                </li>

              </ul>
            </div>

          </div>
        ) : (
          
          /* Confirmation / Receipt screen (Step 5) */
          <div className="luxury-card animate-fade print-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem", textAlign: "center" }}>
            <div style={{ color: "var(--color-secondary)", display: "inline-flex", marginBottom: "1.5rem" }} className="no-print">
              <CheckCircle size={64} />
            </div>

            <h2 style={{ fontSize: "2rem", color: "var(--color-dark)", fontWeight: "bold", marginBottom: "0.5rem" }}>
              تم تسجيل طلب الحجز بنجاح!
            </h2>
            <p style={{ color: "var(--color-text-light)", marginBottom: "2.5rem" }} className="no-print">
              شكراً لثقتكم بمستشفى Family Health Care. يرجى حفظ الموعد والرقم المرجعي الموضحين بالأسفل.
            </p>

            {/* Receipt layout */}
            <div 
              style={{
                border: "2px dashed var(--color-border)",
                borderRadius: "var(--border-radius-md)",
                padding: "2rem",
                textAlign: "right",
                backgroundColor: "#fff",
                marginBottom: "2.5rem",
                boxShadow: "var(--shadow-sm)"
              }}
              className="receipt-body"
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-dark)" }}>تأكيد موعد طبي</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>Family Health Care Hospital</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: "0.85rem", color: "var(--color-text-light)" }}>رقم الحجز المرجعي</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--color-primary)" }}>{confirmedBooking?.id}</span>
                    <button
                      onClick={handleCopyId}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        backgroundColor: copied ? "rgba(90,171,107,0.15)" : "rgba(42,157,181,0.1)",
                        color: copied ? "var(--color-secondary)" : "var(--color-primary)",
                        border: "1px solid currentColor",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      {copied ? "✓ تم النسخ" : "نسخ"}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-light)" }}>اسم المريض:</span>
                  <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{confirmedBooking?.patientName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-light)" }}>التخصص المطلوب:</span>
                  <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{confirmedBooking?.specialtyName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-light)" }}>الطبيب المعالج:</span>
                  <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{confirmedBooking?.doctorName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-light)" }}>التاريخ:</span>
                  <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{confirmedBooking?.date}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-light)" }}>الوقت المحدد:</span>
                  <span style={{ fontWeight: "600", color: "var(--color-dark)" }}>{confirmedBooking?.time}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }} className="no-print">
              <button onClick={handlePrint} className="btn btn-dark" style={{ gap: "0.5rem" }}>
                <Printer size={16} />
                طباعة تفاصيل الحجز
              </button>
              
              <button onClick={handleReset} className="btn btn-outline">
                حجز موعد جديد
              </button>
            </div>

          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .booking-layout {
            grid-template-columns: 1fr !important;
          }
          .booking-specialties-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .booking-dates-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.4rem !important;
          }
          .booking-times-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        /* Print Specific Styles */
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .receipt-body {
            border: 1px solid #000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}