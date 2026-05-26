import React, { useState } from "react";
import { useHospital } from "../context/HospitalContext";
import { 
  Lock, User, LogOut, Check, X, Shield, Plus, Edit, Trash, Download, Settings, Users, FileText, Stethoscope, Image, CheckSquare
} from "lucide-react";

export default function Admin({ setCurrentTab }) {
  const {
    specialties,
    doctors,
    slides,
    aboutSections,
    settings,
    bookings,
    users,
    prescriptions,
    reports,
    currentUser,
    login,
    logout,
    updateBookingStatus,
    deleteBooking,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    updateSlides,
    updateAboutSections,
    updateSettings,
    addUser,
    updateUser,
    deleteUser,
    addPrescription,
    deletePrescription,
    addReport,
    deleteReport
  } = useHospital();

  // Login Form State
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard Active Tab state
  const [activeSubTab, setActiveSubTab] = useState("bookings");

  // Filter state for Bookings Tab
  const [bookingFilterStatus, setBookingFilterStatus] = useState("all");
  const [bookingSearchTerm, setBookingSearchTerm] = useState("");

  // Form States for CRUDs
  // Doctor form modal
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [docName, setDocName] = useState("");
  const [docSpecId, setDocSpecId] = useState("");
  const [docExperience, setDocExperience] = useState("");
  const [docImage, setDocImage] = useState("");
  const [docTags, setDocTags] = useState("");
  const [docCreds, setDocCreds] = useState("");
  const [docDays, setDocDays] = useState("");
  const [docHours, setDocHours] = useState("");

  // Slide form state
  const [slideTitle1, setSlideTitle1] = useState("");
  const [slideSub1, setSlideSub1] = useState("");
  const [slideImg1, setSlideImg1] = useState("");
  const [slideTitle2, setSlideTitle2] = useState("");
  const [slideSub2, setSlideSub2] = useState("");
  const [slideImg2, setSlideImg2] = useState("");
  const [slideTitle3, setSlideTitle3] = useState("");
  const [slideSub3, setSlideSub3] = useState("");
  const [slideImg3, setSlideImg3] = useState("");

  // About forms state
  const [aboutStory, setAboutStory] = useState("");
  const [aboutMission, setAboutMission] = useState("");
  const [aboutVision, setAboutVision] = useState("");

  // Settings form state
  const [setHospitalName, setSetHospitalName] = useState("");
  const [setPrimaryColor, setSetPrimaryColor] = useState("");
  const [setSecondaryColor, setSetSecondaryColor] = useState("");
  const [setDarkColor, setSetDarkColor] = useState("");
  const [setPhone, setSetPhone] = useState("");
  const [setEmergencyPhone, setSetEmergencyPhone] = useState("");
  const [setWhatsapp, setSetWhatsapp] = useState("");
  const [setAddress, setSetAddress] = useState("");
  const [setMapsUrl, setSetMapsUrl] = useState("");
  const [setMapsEmbed, setSetMapsEmbed] = useState("");
  const [setExpStat, setSetExpStat] = useState("");
  const [setPatStat, setSetPatStat] = useState("");
  const [setDocStat, setSetDocStat] = useState("");
  const [setSatStat, setSetSatStat] = useState("");

  // User form modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [usrUsername, setUsrUsername] = useState("");
  const [usrName, setUsrName] = useState("");
  const [usrRole, setUsrRole] = useState("receptionist");
  const [usrPassword, setUsrPassword] = useState("");
  const [usrDoctorId, setUsrDoctorId] = useState("");
  const [usrAllowedTabs, setUsrAllowedTabs] = useState(["bookings"]);

  // Specialties management state
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [specName, setSpecName] = useState("");
  const [specDesc, setSpecDesc] = useState("");
  const [specIcon, setSpecIcon] = useState("Stethoscope");
  const [specFeatures, setSpecFeatures] = useState("");
  const [localSpecialties, setLocalSpecialties] = useState(null);

  // Medical Records tab state
  const [selectedPatientBooking, setSelectedPatientBooking] = useState(null);
  const [medicalSearchTerm, setMedicalSearchTerm] = useState("");
  
  // New Prescription Form State
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [rxDiagnosis, setRxDiagnosis] = useState("");
  const [rxMedicines, setRxMedicines] = useState([{ name: "", dosage: "", frequency: "", period: "" }]);
  const [rxNotes, setRxNotes] = useState("");

  // New Report Form State
  const [showReportModal, setShowReportModal] = useState(false);
  const [repType, setRepType] = useState("lab"); // lab or radiology
  const [repTitle, setRepTitle] = useState("");
  const [repResultText, setRepResultText] = useState("");
  const [repNotes, setRepNotes] = useState("");
  const [repStatus, setRepStatus] = useState("ready");

  const handleAddMedicineRow = () => {
    setRxMedicines([...rxMedicines, { name: "", dosage: "", frequency: "", period: "" }]);
  };

  const handleRemoveMedicineRow = (index) => {
    setRxMedicines(rxMedicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = rxMedicines.map((med, idx) => 
      idx === index ? { ...med, [field]: value } : med
    );
    setRxMedicines(updated);
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientBooking) return;
    
    // Filter out empty medicines
    const cleanMedicines = rxMedicines.filter(m => m.name.trim() !== "");
    if (cleanMedicines.length === 0) {
      alert("يرجى إضافة دواء واحد على الأقل.");
      return;
    }

    const docName = currentUser.role === "doctor" ? currentUser.name : selectedPatientBooking.doctorName;
    const docId = currentUser.role === "doctor" ? currentUser.doctorId : selectedPatientBooking.doctorId;

    addPrescription({
      bookingId: selectedPatientBooking.id,
      patientName: selectedPatientBooking.patientName,
      phone: selectedPatientBooking.phone,
      doctorId: docId,
      doctorName: docName,
      diagnosis: rxDiagnosis,
      medicines: cleanMedicines,
      notes: rxNotes
    });

    alert("تم كتابة الروشتة وحفظها بنجاح في ملف المريض!");
    setShowPrescriptionModal(false);
    setRxDiagnosis("");
    setRxMedicines([{ name: "", dosage: "", frequency: "", period: "" }]);
    setRxNotes("");
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientBooking) return;

    if (!repTitle.trim() || !repResultText.trim()) {
      alert("يرجى تعبئة عنوان الفحص ونتائج التقرير.");
      return;
    }

    const docName = currentUser.role === "doctor" ? currentUser.name : selectedPatientBooking.doctorName;
    const docId = currentUser.role === "doctor" ? currentUser.doctorId : selectedPatientBooking.doctorId;

    addReport({
      bookingId: selectedPatientBooking.id,
      patientName: selectedPatientBooking.patientName,
      phone: selectedPatientBooking.phone,
      doctorId: docId,
      doctorName: docName,
      type: repType,
      title: repTitle,
      resultText: repResultText,
      notes: repNotes,
      status: repStatus
    });

    alert("تم إضافة التقرير الطبي وحفظه بنجاح!");
    setShowReportModal(false);
    setRepTitle("");
    setRepResultText("");
    setRepNotes("");
    setRepStatus("ready");
  };

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const result = login(usernameInput, passwordInput);
    if (result.success) {
      setUsernameInput("");
      setPasswordInput("");
      
      // Auto-set the active subtab depending on user role
      if (result.user.role === "doctor") {
        setActiveSubTab("bookings");
      } else if (result.user.role === "receptionist") {
        setActiveSubTab("bookings");
      } else {
        setActiveSubTab("bookings");
      }
      
      // Load current values in configuration editors
      loadEditorStates();
    } else {
      setLoginError(result.message);
    }
  };

  const loadEditorStates = () => {
    // Load slides values
    if (slides.length >= 3) {
      setSlideTitle1(slides[0].title); setSlideSub1(slides[0].subtitle); setSlideImg1(slides[0].image);
      setSlideTitle2(slides[1].title); setSlideSub2(slides[1].subtitle); setSlideImg2(slides[1].image);
      setSlideTitle3(slides[2].title); setSlideSub3(slides[2].subtitle); setSlideImg3(slides[2].image);
    }
    // Load About
    setAboutStory(aboutSections.story || "");
    setAboutMission(aboutSections.mission || "");
    setAboutVision(aboutSections.vision || "");
    // Load Settings
    setSetHospitalName(settings.hospitalName || "");
    setSetPrimaryColor(settings.primaryColor || "");
    setSetSecondaryColor(settings.secondaryColor || "");
    setSetDarkColor(settings.darkColor || "");
    setSetPhone(settings.phone || "");
    setSetEmergencyPhone(settings.emergencyPhone || "");
    setSetWhatsapp(settings.whatsapp || "");
    setSetAddress(settings.address || "");
    setSetMapsUrl(settings.mapsUrl || "");
    setSetMapsEmbed(settings.mapsEmbedSrc || "");
    setSetExpStat(settings.stats?.experience || "");
    setSetPatStat(settings.stats?.patients || "");
    setSetDocStat(settings.stats?.doctors || "");
    setSetSatStat(settings.stats?.satisfaction || "");
  };

  // CSV Export function
  const handleCSVExport = () => {
    const headers = ["رقم الحجز", "اسم المريض", "رقم الهاتف", "العمر", "التخصص", "الطبيب", "التاريخ", "التوقيت", "الحالة", "تاريخ التسجيل"];
    const rows = getFilteredBookings().map(b => [
      b.id,
      b.patientName,
      b.phone,
      b.age,
      b.specialtyName,
      b.doctorName,
      b.date,
      b.time,
      b.status === "confirmed" ? "مؤكد" : b.status === "cancelled" ? "ملغى" : "قيد الانتظار",
      b.createdAt
    ]);
    
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Arabic encoding
    csvContent += headers.join(",") + "\n";
    rows.forEach(row => {
      csvContent += row.map(val => `"${val.replace(/"/g, '""')}"`).join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fhh_bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings logic based on role & filter inputs
  const getFilteredBookings = () => {
    let list = bookings;
    
    // If logged in user is a doctor, they only see their own bookings!
    if (currentUser?.role === "doctor") {
      // Find matching doctor record
      const matchedDoctor = doctors.find((d) => d.id === currentUser.doctorId);
      list = bookings.filter((b) => b.doctorId === matchedDoctor?.id);
    }

    return list.filter((b) => {
      const matchesStatus = bookingFilterStatus === "all" ? true : b.status === bookingFilterStatus;
      const matchesSearch = bookingSearchTerm
        ? b.patientName.toLowerCase().includes(bookingSearchTerm.toLowerCase()) || 
          b.id.toLowerCase().includes(bookingSearchTerm.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  };

  // Save edits handlers
  const handleSaveSlides = (e) => {
    e.preventDefault();
    const updated = [
      { id: 1, title: slideTitle1, subtitle: slideSub1, image: slideImg1, ctaText: "احجز موعدك الآن", ctaLink: "/book" },
      { id: 2, title: slideTitle2, subtitle: slideSub2, image: slideImg2, ctaText: "تعرف على أطبائنا", ctaLink: "/doctors" },
      { id: 3, title: slideTitle3, subtitle: slideSub3, image: slideImg3, ctaText: "اتصل بنا فوراً", ctaLink: "/contact" }
    ];
    updateSlides(updated);
    alert("تم حفظ سلايدات الهيرو بنجاح وتحديث واجهة المستخدم!");
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutSections({
      ...aboutSections,
      story: aboutStory,
      mission: aboutMission,
      vision: aboutVision
    });
    alert("تم تحديث وحفظ بيانات 'عن المستشفى' بنجاح!");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      hospitalName: setHospitalName,
      logoText: setHospitalName,
      primaryColor: setPrimaryColor,
      secondaryColor: setSecondaryColor,
      darkColor: setDarkColor,
      phone: setPhone,
      emergencyPhone: setEmergencyPhone,
      whatsapp: setWhatsapp,
      address: setAddress,
      mapsUrl: setMapsUrl,
      mapsEmbedSrc: setMapsEmbed,
      stats: {
        experience: setExpStat,
        patients: setPatStat,
        doctors: setDocStat,
        satisfaction: setSatStat
      }
    });
    alert("تم حفظ وتحديث إعدادات النظام وخصائص الألوان بنجاح!");
  };

  // Doctors Form triggers
  const openAddDoctor = () => {
    setEditingDoctor(null);
    setDocName("");
    setDocSpecId(specialties[0]?.id || "");
    setDocExperience("");
    setDocImage("https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400");
    setDocTags("استشاري، طبيب ممتاز");
    setDocCreds("بكالوريوس طب وجراحة - جامعة القاهرة\nعضو نقابة الأطباء");
    setDocDays("الأحد، الثلاثاء");
    setDocHours("10:00 ص - 02:00 م");
    setShowDoctorModal(true);
  };

  const openEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDocName(doc.name);
    setDocSpecId(doc.specialtyId);
    setDocExperience(doc.experience);
    setDocImage(doc.image);
    setDocTags(doc.tags.join("، "));
    setDocCreds(doc.credentials.join("\n"));
    setDocDays(doc.schedule.days.join("، "));
    setDocHours(doc.schedule.hours.join("، "));
    setShowDoctorModal(true);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (!docName || !docExperience) return;

    const selectedSpec = specialties.find(s => s.id === docSpecId);

    const docPayload = {
      name: docName,
      specialtyId: docSpecId,
      specialtyName: selectedSpec?.name || "",
      experience: docExperience,
      image: docImage,
      tags: docTags.split(/[،,]/).map(t => t.trim()).filter(Boolean),
      credentials: docCreds.split("\n").map(c => c.trim()).filter(Boolean),
      schedule: {
        days: docDays.split(/[،,]/).map(d => d.trim()).filter(Boolean),
        hours: docHours.split(/[،,]/).map(h => h.trim()).filter(Boolean)
      }
    };

    if (editingDoctor) {
      updateDoctor({ ...editingDoctor, ...docPayload });
      alert("تم تعديل بيانات الطبيب بنجاح!");
    } else {
      addDoctor(docPayload);
      alert("تم إضافة الطبيب الجديد بنجاح!");
    }
    setShowDoctorModal(false);
  };

  // Simulated image file selection
  const handleSimulatedImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocImage(event.target.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  // User Form Triggers
  const openAddUser = () => {
    setEditingUser(null);
    setUsrUsername("");
    setUsrName("");
    setUsrRole("receptionist");
    setUsrPassword("");
    setUsrDoctorId("");
    setUsrAllowedTabs(["bookings"]);
    setShowUserModal(true);
  };

  const openEditUser = (usr) => {
    setEditingUser(usr);
    setUsrUsername(usr.username);
    setUsrName(usr.name);
    setUsrRole(usr.role);
    setUsrPassword(usr.password);
    setUsrDoctorId(usr.doctorId || "");
    setUsrAllowedTabs(usr.allowedTabs || ["bookings", "records"]);
    setShowUserModal(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!usrUsername || !usrPassword || !usrName) return;

    const finalTabs = usrRole === "superadmin"
      ? ["bookings", "records", "doctors", "content", "settings", "users", "specialties"]
      : usrAllowedTabs;

    const usrPayload = {
      username: usrUsername,
      name: usrName,
      role: usrRole,
      password: usrPassword,
      doctorId: usrRole === "doctor" ? usrDoctorId : undefined,
      allowedTabs: finalTabs
    };

    if (editingUser) {
      updateUser({ ...editingUser, ...usrPayload });
      alert("تم تعديل بيانات المستخدم بنجاح!");
    } else {
      addUser(usrPayload);
      alert("تم إضافة المستخدم الجديد بنجاح!");
    }
    setShowUserModal(false);
  };

  // Specialties management - uses localStorage directly since context has readonly specialties
  const getLocalSpecialties = () => {
    if (localSpecialties) return localSpecialties;
    const stored = localStorage.getItem("fhh_specialties_custom");
    if (stored) return JSON.parse(stored);
    return specialties; // fallback to context
  };

  const saveLocalSpecialties = (list) => {
    setLocalSpecialties(list);
    localStorage.setItem("fhh_specialties_custom", JSON.stringify(list));
  };

  const openAddSpec = () => {
    setEditingSpec(null);
    setSpecName(""); setSpecDesc(""); setSpecIcon("Stethoscope"); setSpecFeatures("");
    setShowSpecModal(true);
  };

  const openEditSpec = (spec) => {
    setEditingSpec(spec);
    setSpecName(spec.name); setSpecDesc(spec.description); setSpecIcon(spec.icon || "Stethoscope");
    setSpecFeatures((spec.features || []).join("\n"));
    setShowSpecModal(true);
  };

  const handleSpecSubmit = (e) => {
    e.preventDefault();
    const list = getLocalSpecialties();
    const payload = {
      name: specName,
      description: specDesc,
      icon: specIcon,
      features: specFeatures.split("\n").map(s => s.trim()).filter(Boolean)
    };
    if (editingSpec) {
      saveLocalSpecialties(list.map(s => s.id === editingSpec.id ? { ...s, ...payload } : s));
      alert("تم تعديل التخصص بنجاح!");
    } else {
      saveLocalSpecialties([...list, { ...payload, id: `spec-${Date.now()}` }]);
      alert("تم إضافة التخصص بنجاح!");
    }
    setShowSpecModal(false);
  };

  const deleteSpec = (id) => {
    if (!confirm("هل تريد حذف هذا التخصص؟")) return;
    saveLocalSpecialties(getLocalSpecialties().filter(s => s.id !== id));
  };

  // Tab permission helper
  const canAccessTab = (tabId) => {
    if (!currentUser) return false;
    if (currentUser.role === "superadmin") return true;
    const allowed = currentUser.allowedTabs || [];
    return allowed.includes(tabId);
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div style={{ backgroundColor: "var(--color-light)", padding: "6rem 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div 
          className="luxury-card animate-fade"
          style={{ width: "100%", maxWidth: "450px", padding: "3rem", border: "1px solid var(--color-border)" }}
        >
          <div style={{ display: "flex", justifyContent: "center", color: "var(--color-primary)", marginBottom: "1.5rem" }}>
            <Lock size={44} />
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: "bold", color: "var(--color-dark)", textAlign: "center", marginBottom: "0.5rem" }}>
            تسجيل دخول لوحة الإدارة
          </h2>
          <p style={{ color: "var(--color-text-light)", fontSize: "0.85rem", textAlign: "center", marginBottom: "2rem" }}>
            يرجى إدخال اسم المستخدم وكلمة المرور الخاصة بموظفي المستشفى أو الأطباء.
          </p>

          {loginError && (
            <div style={{ color: "var(--color-danger)", backgroundColor: "rgba(239, 68, 68, 0.08)", padding: "0.75rem", borderRadius: "var(--border-radius-sm)", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "1.25rem", textAlign: "center" }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                اسم المستخدم
              </label>
              <div style={{ position: "relative" }}>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: superadmin"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <User size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                كلمة المرور
              </label>
              <div style={{ position: "relative" }}>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}>
              دخول النظام
            </button>
          </form>

          {/* Quick Mock Accounts hints for review */}
          <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem", fontSize: "0.8rem", color: "var(--color-text-light)" }}>
            <span style={{ fontWeight: "bold", color: "var(--color-dark)", display: "block", marginBottom: "0.25rem" }}>حسابات تجريبية للمراجعة:</span>
            <ul style={{ paddingRight: "1rem", listStyleType: "circle" }}>
              <li>مدير النظام: <code>superadmin</code> / كلمة المرور: <code>admin</code></li>
              <li>موظف استقبال: <code>reception</code> / كلمة المرور: <code>reception</code></li>
              <li>طبيب (د. صدقي): <code>drsedky</code> / كلمة المرور: <code>sedky</code></li>
            </ul>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard Area
  return (
    <div style={{ backgroundColor: "var(--color-light)", padding: "3rem 0" }} className="admin-dashboard-wrapper">
      <div className="container">
        
        {/* Top welcome panel */}
        <div 
          style={{
            backgroundColor: "var(--color-white)",
            borderRadius: "var(--border-radius-md)",
            padding: "1.5rem 2rem",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--color-dark)" }}>
              أهلاً بك، {currentUser.name}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)" }}>
              صلاحية النظام الحالية: {" "}
              <strong style={{ color: "var(--color-primary)" }}>
                {currentUser.role === "superadmin" ? "مدير النظام العام (Super Admin)" : 
                 currentUser.role === "receptionist" ? "مسؤول الاستقبال والملفات" : 
                 "طبيب استشاري معالج"}
              </strong>
            </p>
          </div>

          <button 
            onClick={logout}
            className="btn btn-outline"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem", color: "var(--color-danger)", borderColor: "var(--color-danger)" }}
          >
            <LogOut size={16} />
            تسجيل خروج من الإدارة
          </button>
        </div>

        {/* Tab Selection Row (filtered by user roles) */}
        <div 
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "0.5rem",
            flexWrap: "wrap"
          }}
          className="admin-tab-nav"
        >
          {/* Bookings is visible if allowed */}
          {canAccessTab("bookings") && (
          <button
            onClick={() => setActiveSubTab("bookings")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--border-radius-sm)",
              fontWeight: "bold",
              fontSize: "0.95rem",
              backgroundColor: activeSubTab === "bookings" ? "var(--color-primary)" : "transparent",
              color: activeSubTab === "bookings" ? "var(--color-white)" : "var(--color-text)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <CheckSquare size={16} />
            إدارة الحجوزات
          </button>
          )}

          {/* Clinic & Medical Records tab */}
          {canAccessTab("records") && (
          <button
            onClick={() => setActiveSubTab("records")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--border-radius-sm)",
              fontWeight: "bold",
              fontSize: "0.95rem",
              backgroundColor: activeSubTab === "records" ? "var(--color-primary)" : "transparent",
              color: activeSubTab === "records" ? "var(--color-white)" : "var(--color-text)",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <FileText size={16} />
            العيادة والملفات الطبية
          </button>
          )}

          {/* Superadmin / allowed tabs */}
          {canAccessTab("doctors") && (
              <button
                onClick={() => setActiveSubTab("doctors")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  backgroundColor: activeSubTab === "doctors" ? "var(--color-primary)" : "transparent",
                  color: activeSubTab === "doctors" ? "var(--color-white)" : "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Stethoscope size={16} />
                إدارة الأطباء
              </button>
          )}

          {canAccessTab("specialties") && (
              <button
                onClick={() => setActiveSubTab("specialties")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  backgroundColor: activeSubTab === "specialties" ? "var(--color-primary)" : "transparent",
                  color: activeSubTab === "specialties" ? "var(--color-white)" : "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Stethoscope size={16} />
                التخصصات والعيادات
              </button>
          )}

          {canAccessTab("content") && (
              <button
                onClick={() => setActiveSubTab("content")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  backgroundColor: activeSubTab === "content" ? "var(--color-primary)" : "transparent",
                  color: activeSubTab === "content" ? "var(--color-white)" : "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Image size={16} />
                محتوى الموقع
              </button>
          )}

          {canAccessTab("settings") && (
              <button
                onClick={() => setActiveSubTab("settings")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  backgroundColor: activeSubTab === "settings" ? "var(--color-primary)" : "transparent",
                  color: activeSubTab === "settings" ? "var(--color-white)" : "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Settings size={16} />
                إعدادات النظام
              </button>
          )}

          {canAccessTab("users") && (
              <button
                onClick={() => setActiveSubTab("users")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  backgroundColor: activeSubTab === "users" ? "var(--color-primary)" : "transparent",
                  color: activeSubTab === "users" ? "var(--color-white)" : "var(--color-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <Users size={16} />
                إدارة المستخدمين
              </button>
          )}
        </div>

        {/* Tab panels */}
        <div className="luxury-card" style={{ padding: "2rem" }}>
          
          {/* TAB 1: Bookings Management */}
          {activeSubTab === "bookings" && (
            <div className="animate-fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }} className="bookings-toolbar">
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-dark)" }}>
                  سجل الحجوزات الطبية
                </h3>
                
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                  
                  {/* CSV Export */}
                  <button onClick={handleCSVExport} className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.3rem" }}>
                    <Download size={14} />
                    تصدير Excel / CSV
                  </button>

                  {/* Status Dropdown */}
                  <select 
                    className="form-input" 
                    style={{ padding: "0.5rem 1.5rem", width: "auto" }}
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                  >
                    <option value="all">كل الحجوزات</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكدة</option>
                    <option value="cancelled">ملغاة</option>
                  </select>

                  {/* Text search */}
                  <input 
                    type="text" 
                    placeholder="ابحث باسم المريض أو رقم الحجز..." 
                    className="form-input"
                    style={{ padding: "0.5rem 1rem", width: "230px" }}
                    value={bookingSearchTerm}
                    onChange={(e) => setBookingSearchTerm(e.target.value)}
                  />

                </div>
              </div>

              {/* Table list */}
              {getFilteredBookings().length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--color-border)", backgroundColor: "var(--color-light)" }}>
                        <th style={{ padding: "1rem", textAlign: "right" }}>رقم المرجع</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>اسم المريض</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>الهاتف</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>التخصص</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>الطبيب</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>تاريخ الموعد</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>توقيت الكشف</th>
                        <th style={{ padding: "1rem", textAlign: "right" }}>الحالة</th>
                        <th style={{ padding: "1rem", textAlign: "center" }} className="no-print">العمليات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredBookings().map((booking) => (
                        <tr key={booking.id} style={{ borderBottom: "1px solid var(--color-border)", transition: "var(--transition-fast)" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(42, 157, 181, 0.02)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                          <td style={{ padding: "1rem", fontWeight: "bold", color: "var(--color-primary)" }}>{booking.id}</td>
                          <td style={{ padding: "1rem", fontWeight: "bold" }}>{booking.patientName} (سن {booking.age})</td>
                          <td style={{ padding: "1rem" }}><a href={`tel:${booking.phone}`} style={{ color: "var(--color-text)", textDecoration: "underline" }}>{booking.phone}</a></td>
                          <td style={{ padding: "1rem" }}>{booking.specialtyName}</td>
                          <td style={{ padding: "1rem" }}>{booking.doctorName}</td>
                          <td style={{ padding: "1rem" }}>{booking.date}</td>
                          <td style={{ padding: "1rem" }}>{booking.time}</td>
                          <td style={{ padding: "1rem" }}>
                            <span 
                              style={{ 
                                padding: "0.25rem 0.6rem", 
                                borderRadius: "var(--border-radius-sm)", 
                                fontSize: "0.75rem", 
                                fontWeight: "bold",
                                backgroundColor: 
                                  booking.status === "confirmed" ? "rgba(90, 171, 107, 0.1)" :
                                  booking.status === "cancelled" ? "rgba(239, 68, 68, 0.1)" : 
                                  "rgba(251, 191, 36, 0.1)",
                                color:
                                  booking.status === "confirmed" ? "var(--color-secondary)" :
                                  booking.status === "cancelled" ? "var(--color-danger)" : 
                                  "var(--color-gold)"
                              }}
                            >
                              {booking.status === "confirmed" ? "مؤكد" : 
                               booking.status === "cancelled" ? "ملغى" : "قيد الانتظار"}
                            </span>
                          </td>
                          <td style={{ padding: "1rem", display: "flex", gap: "0.4rem", justifyContent: "center" }} className="no-print">
                            {booking.status === "pending" && (
                              <button 
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                style={{ color: "var(--color-secondary)", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid var(--color-secondary)" }}
                                title="تأكيد الموعد"
                              >
                                <Check size={14} />
                              </button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button 
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                style={{ color: "var(--color-danger)", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid var(--color-danger)" }}
                                title="إلغاء الموعد"
                              >
                                <X size={14} />
                              </button>
                            )}
                            
                            {/* Superadmin delete options */}
                            {currentUser.role === "superadmin" && (
                              <button 
                                onClick={() => { if(confirm("هل تريد حذف هذا الحجز تماماً؟")) deleteBooking(booking.id); }}
                                style={{ color: "#64748b", padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                                title="حذف السجل"
                              >
                                <Trash size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <p style={{ color: "var(--color-text-light)" }}>لا توجد أي طلبات حجز تطابق الخيارات المحددة.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB: Medical Records & Clinic */}
          {activeSubTab === "records" && (
            <div className="animate-fade">
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "1.5rem" }}>
                العيادة والملفات الطبية للمرضى
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "2rem" }} className="records-grid-layout">
                {/* Right Side: Patient search & Booking Select list */}
                <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "1.5rem" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>البحث عن مريض</label>
                    <input 
                      type="text" 
                      placeholder="ابحث بالاسم أو رقم الهاتف..." 
                      className="form-input"
                      value={medicalSearchTerm}
                      onChange={(e) => setMedicalSearchTerm(e.target.value)}
                    />
                  </div>

                  <div style={{ maxHeight: "450px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {bookings
                      .filter(b => {
                        // If doctor role, restrict to their patients by default, but let them search any
                        if (currentUser.role === "doctor" && !medicalSearchTerm) {
                          return b.doctorId === currentUser.doctorId;
                        }
                        const term = medicalSearchTerm.toLowerCase();
                        return b.patientName.toLowerCase().includes(term) || b.phone.includes(term) || b.id.toLowerCase().includes(term);
                      })
                      .map(b => (
                        <div 
                          key={b.id}
                          onClick={() => setSelectedPatientBooking(b)}
                          style={{
                            padding: "1rem",
                            borderRadius: "8px",
                            border: selectedPatientBooking?.id === b.id ? "2px solid var(--color-primary)" : "1px solid #e2e8f0",
                            backgroundColor: selectedPatientBooking?.id === b.id ? "rgba(42, 157, 181, 0.04)" : "#fff",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                            <strong style={{ color: "var(--color-dark)" }}>{b.patientName}</strong>
                            <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>{b.id}</span>
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text)" }}>هاتف: {b.phone}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "0.25rem" }}>
                            <span>عيادة: {b.specialtyName}</span>
                            <span>طبيب: {b.doctorName}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Left Side: Patient Details, Prescriptions, Reports */}
                <div>
                  {selectedPatientBooking ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      
                      {/* Patient metadata summary card */}
                      <div style={{ backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <h4 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-dark)", margin: 0 }}>{selectedPatientBooking.patientName}</h4>
                          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-text-light)" }}>
                            <span>السن: {selectedPatientBooking.age} سنة</span>
                            <span>رقم الهاتف: {selectedPatientBooking.phone}</span>
                            <span>تاريخ الموعد: {selectedPatientBooking.date}</span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {/* Write prescription triggers (only for Doctors/Superadmin) */}
                          {(currentUser.role === "doctor" || currentUser.role === "superadmin") && (
                            <button 
                              onClick={() => {
                                setRxMedicines([{ name: "", dosage: "", frequency: "", period: "" }]);
                                setRxDiagnosis("");
                                setRxNotes("");
                                setShowPrescriptionModal(true);
                              }}
                              className="btn btn-primary" 
                              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.3rem" }}
                            >
                              <Plus size={14} /> كتابة روشتة
                            </button>
                          )}

                          {/* Write Report triggers (Doctors/Reception/Superadmin) */}
                          {(currentUser.role === "doctor" || currentUser.role === "receptionist" || currentUser.role === "superadmin") && (
                            <button 
                              onClick={() => {
                                setRepTitle("");
                                setRepResultText("");
                                setRepNotes("");
                                setRepStatus("ready");
                                setShowReportModal(true);
                              }}
                              className="btn btn-secondary" 
                              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", gap: "0.3rem" }}
                            >
                              <Plus size={14} /> إضافة فحص/أشعة
                            </button>
                          )}
                        </div>
                      </div>

                      {/* File Contents lists split to Prescriptions & Reports */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="history-split">
                        
                        {/* Column 1: Prescriptions list */}
                        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
                          <h5 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--color-primary)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                            الروشتات المكتوبة للمريض
                          </h5>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
                            {prescriptions.filter(p => p.bookingId === selectedPatientBooking.id || p.phone === selectedPatientBooking.phone).length === 0 ? (
                              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textAlign: "center", padding: "1rem 0" }}>لا توجد روشتات صادرة.</p>
                            ) : (
                              prescriptions
                                .filter(p => p.bookingId === selectedPatientBooking.id || p.phone === selectedPatientBooking.phone)
                                .map(p => (
                                  <div key={p.id} style={{ padding: "0.85rem", borderRadius: "8px", border: "1px solid #f1f5f9", backgroundColor: "#fafcfd" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-text-light)", marginBottom: "0.25rem" }}>
                                      <span>تاريخ: {p.date}</span>
                                      <span>كود: {p.id}</span>
                                    </div>
                                    <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--color-dark)" }}>{p.doctorName}</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--color-text)", marginTop: "0.25rem" }}>التشخيص: {p.diagnosis || "متابعة دورية"}</div>
                                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                                      {p.medicines.map((m, idx) => (
                                        <span key={idx} style={{ fontSize: "0.7rem", backgroundColor: "rgba(42, 157, 181, 0.08)", color: "var(--color-primary)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                                          {m.name}
                                        </span>
                                      ))}
                                    </div>
                                    {currentUser.role === "superadmin" && (
                                      <button 
                                        onClick={() => { if(confirm("هل تريد حذف هذه الروشتة؟")) deletePrescription(p.id); }}
                                        style={{ marginTop: "0.5rem", background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontSize: "0.75rem", display: "block" }}
                                      >
                                        حذف الروشتة
                                      </button>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        </div>

                        {/* Column 2: Reports list */}
                        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
                          <h5 style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--color-secondary)", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                            التحاليل والأشعة الطبية
                          </h5>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "300px", overflowY: "auto" }}>
                            {reports.filter(r => r.bookingId === selectedPatientBooking.id || r.phone === selectedPatientBooking.phone).length === 0 ? (
                              <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", textAlign: "center", padding: "1rem 0" }}>لا توجد تقارير أو تحاليل.</p>
                            ) : (
                              reports
                                .filter(r => r.bookingId === selectedPatientBooking.id || r.phone === selectedPatientBooking.phone)
                                .map(r => (
                                  <div key={r.id} style={{ padding: "0.85rem", borderRadius: "8px", border: "1px solid #f1f5f9", backgroundColor: "#fafcfd" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--color-text-light)", marginBottom: "0.25rem" }}>
                                      <span>تاريخ: {r.date}</span>
                                      <span style={{ color: r.status === "ready" ? "var(--color-secondary)" : "#d97706", fontWeight: "bold" }}>
                                        {r.status === "ready" ? "✓ جاهز" : "⏳ معلق"}
                                      </span>
                                    </div>
                                    <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--color-dark)" }}>{r.title}</div>
                                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>النوع: {r.type === "lab" ? "مخبري" : "أشعة"}</div>
                                    <div style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem", color: "var(--color-text)", backgroundColor: "#fff", padding: "0.5rem", borderRadius: "4px", marginTop: "0.5rem", border: "1px solid #f1f5f9" }}>
                                      {r.resultText}
                                    </div>
                                    {currentUser.role === "superadmin" && (
                                      <button 
                                        onClick={() => { if(confirm("هل تريد حذف هذا التقرير؟")) deleteReport(r.id); }}
                                        style={{ marginTop: "0.5rem", background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontSize: "0.75rem", display: "block" }}
                                      >
                                        حذف التقرير
                                      </button>
                                    )}
                                  </div>
                                ))
                            )}
                          </div>
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div style={{ textAlign: "center", padding: "5rem 2rem", border: "1px dashed #cbd5e1", borderRadius: "12px", color: "var(--color-text-light)" }}>
                      <FileText size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                      <p style={{ margin: 0 }}>يرجى اختيار مريض من القائمة الجانبية لعرض وتحديث ملفه الطبي.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Doctors Management (Superadmin only) */}
          {activeSubTab === "doctors" && canAccessTab("doctors") && (
            <div className="animate-fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>الأطباء والاستشاريين الحاليين</h3>
                <button onClick={openAddDoctor} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem", gap: "0.3rem" }}>
                  <Plus size={16} />
                  إضافة طبيب جديد
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="admin-docs-grid">
                {doctors.map((doc) => (
                  <div key={doc.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-md)", padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <img src={doc.image} alt={doc.name} style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: "bold", fontSize: "1rem" }}>{doc.name}</h4>
                      <span style={{ fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: "bold" }}>{doc.specialtyName}</span>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => openEditDoctor(doc)} style={{ padding: "0.4rem", border: "1px solid #cbd5e1", borderRadius: "4px", color: "var(--color-primary)" }}>
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("هل تريد إزالة هذا الطبيب؟")) deleteDoctor(doc.id); }}
                        style={{ padding: "0.4rem", border: "1px solid var(--color-danger)", borderRadius: "4px", color: "var(--color-danger)" }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Site Content Management (Superadmin only) */}
          {activeSubTab === "content" && canAccessTab("content") && (
            <div className="animate-fade">
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                إدارة محتوى الموقع وسلايدات الهيرو
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }} className="content-editors-grid">
                
                {/* Hero Slides Editor Form */}
                <form onSubmit={handleSaveSlides}>
                  <h4 style={{ fontWeight: "bold", color: "var(--color-primary)", marginBottom: "1rem" }}>سلايدات الهيرو (3 سلايدات رئيسية):</h4>
                  
                  {/* Slide 1 */}
                  <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", padding: "1rem", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--color-dark)" }}>السلايد الأول (الرئيسي):</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <input type="text" placeholder="العنوان الكبير..." className="form-input" value={slideTitle1} onChange={(e) => setSlideTitle1(e.target.value)} />
                      <input type="text" placeholder="الوصف الفرعي..." className="form-input" value={slideSub1} onChange={(e) => setSlideSub1(e.target.value)} />
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="text" placeholder="رابط صورة الخلفية..." className="form-input" value={slideImg1} onChange={(e) => setSlideImg1(e.target.value)} />
                        <label style={{ flexShrink: 0, padding: "0.75rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: "0.8rem", backgroundColor: "var(--color-light)" }}>
                          رفع
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onload = ev => setSlideImg1(ev.target.result); r.readAsDataURL(f); }}} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", padding: "1rem", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--color-dark)" }}>السلايد الثاني:</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <input type="text" placeholder="العنوان الكبير..." className="form-input" value={slideTitle2} onChange={(e) => setSlideTitle2(e.target.value)} />
                      <input type="text" placeholder="الوصف الفرعي..." className="form-input" value={slideSub2} onChange={(e) => setSlideSub2(e.target.value)} />
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="text" placeholder="رابط صورة الخلفية..." className="form-input" value={slideImg2} onChange={(e) => setSlideImg2(e.target.value)} />
                        <label style={{ flexShrink: 0, padding: "0.75rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: "0.8rem", backgroundColor: "var(--color-light)" }}>
                          رفع
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onload = ev => setSlideImg2(ev.target.result); r.readAsDataURL(f); }}} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-sm)", padding: "1rem", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", color: "var(--color-dark)" }}>السلايد الثالث:</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <input type="text" placeholder="العنوان الكبير..." className="form-input" value={slideTitle3} onChange={(e) => setSlideTitle3(e.target.value)} />
                      <input type="text" placeholder="الوصف الفرعي..." className="form-input" value={slideSub3} onChange={(e) => setSlideSub3(e.target.value)} />
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input type="text" placeholder="رابط صورة الخلفية..." className="form-input" value={slideImg3} onChange={(e) => setSlideImg3(e.target.value)} />
                        <label style={{ flexShrink: 0, padding: "0.75rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: "0.8rem", backgroundColor: "var(--color-light)" }}>
                          رفع
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onload = ev => setSlideImg3(ev.target.result); r.readAsDataURL(f); }}} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">حفظ وتحديث السلايدر</button>
                </form>

                {/* About Sections Editor Form */}
                <form onSubmit={handleSaveAbout}>
                  <h4 style={{ fontWeight: "bold", color: "var(--color-secondary)", marginBottom: "1rem" }}>تحديث محتوى "عن المستشفى":</h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                        قصة نشأة المستشفى من 2009
                      </label>
                      <textarea rows="5" className="form-input" style={{ resize: "none" }} value={aboutStory} onChange={(e) => setAboutStory(e.target.value)}></textarea>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                        رسالتنا
                      </label>
                      <textarea rows="3" className="form-input" style={{ resize: "none" }} value={aboutMission} onChange={(e) => setAboutMission(e.target.value)}></textarea>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)", marginBottom: "0.4rem" }}>
                        رؤيتنا
                      </label>
                      <textarea rows="3" className="form-input" style={{ resize: "none" }} value={aboutVision} onChange={(e) => setAboutVision(e.target.value)}></textarea>
                    </div>

                    <button type="submit" className="btn btn-secondary">حفظ التغييرات</button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* TAB 4: Settings Management (Superadmin only) */}
          {activeSubTab === "settings" && canAccessTab("settings") && (
            <div className="animate-fade">
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
                إعدادات النظام العامة
              </h3>

              <form onSubmit={handleSaveSettings} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }} className="settings-editors-grid">
                
                {/* Left panel: Info & Colors */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontWeight: "bold", color: "var(--color-primary)" }}>الهوية البصرية وبيانات التواصل:</h4>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>اسم المستشفى</label>
                    <input type="text" className="form-input" value={setHospitalName} onChange={(e) => setSetHospitalName(e.target.value)} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.4rem" }}>اللون الرئيسي (تيل)</label>
                      <input type="color" className="form-input" style={{ padding: "0.2rem" }} value={setPrimaryColor} onChange={(e) => setSetPrimaryColor(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.4rem" }}>اللون الثانوي (أخضر)</label>
                      <input type="color" className="form-input" style={{ padding: "0.2rem" }} value={setSecondaryColor} onChange={(e) => setSetSecondaryColor(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.4rem" }}>اللون الداكن (نيفي)</label>
                      <input type="color" className="form-input" style={{ padding: "0.2rem" }} value={setDarkColor} onChange={(e) => setSetDarkColor(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>رقم الهاتف (الاستعلامات)</label>
                    <input type="text" className="form-input" value={setPhone} onChange={(e) => setSetPhone(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>رقم الطوارئ</label>
                    <input type="text" className="form-input" value={setEmergencyPhone} onChange={(e) => setSetEmergencyPhone(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>رقم واتساب للتواصل</label>
                    <input type="text" className="form-input" value={setWhatsapp} onChange={(e) => setSetWhatsapp(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>العنوان التفصيلي</label>
                    <input type="text" className="form-input" value={setAddress} onChange={(e) => setSetAddress(e.target.value)} />
                  </div>
                </div>

                {/* Right panel: Maps & Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ fontWeight: "bold", color: "var(--color-secondary)" }}>إحصائيات الواجهة والموقع الجغرافي:</h4>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>إحصائية 1 (الخبرة)</label>
                    <input type="text" className="form-input" value={setExpStat} onChange={(e) => setSetExpStat(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>إحصائية 2 (المرضى)</label>
                    <input type="text" className="form-input" value={setPatStat} onChange={(e) => setSetPatStat(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>إحصائية 3 (الأطباء)</label>
                    <input type="text" className="form-input" value={setDocStat} onChange={(e) => setSetDocStat(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>إحصائية 4 (الرضا)</label>
                    <input type="text" className="form-input" value={setSatStat} onChange={(e) => setSetSatStat(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>رابط خرائط جوجل (Google Maps URL)</label>
                    <input type="text" className="form-input" value={setMapsUrl} onChange={(e) => setSetMapsUrl(e.target.value)} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.4rem" }}>رابط التضمين (Embed Maps URL)</label>
                    <input type="text" className="form-input" value={setMapsEmbed} onChange={(e) => setSetMapsEmbed(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
                    حفظ الإعدادات بالكامل
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB: Specialties & Clinics Management */}
          {activeSubTab === "specialties" && canAccessTab("specialties") && (
            <div className="animate-fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>إدارة التخصصات والعيادات</h3>
                <button onClick={openAddSpec} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem", gap: "0.3rem" }}>
                  <Plus size={16} />
                  إضافة تخصص جديد
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {getLocalSpecialties().map((spec) => {
                  const IconComp = require ? null : null; // just use name
                  return (
                    <div key={spec.id} className="luxury-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h4 style={{ fontWeight: "700", color: "var(--color-dark)", marginBottom: "0.25rem" }}>{spec.name}</h4>
                          <span style={{ fontSize: "0.78rem", color: "var(--color-text-light)", fontFamily: "monospace" }}>أيقونة: {spec.icon || "Stethoscope"}</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                          <button onClick={() => openEditSpec(spec)} style={{ padding: "0.35rem", border: "1px solid #cbd5e1", borderRadius: "4px", color: "var(--color-primary)" }}>
                            <Edit size={13} />
                          </button>
                          <button onClick={() => deleteSpec(spec.id)} style={{ padding: "0.35rem", border: "1px solid var(--color-danger)", borderRadius: "4px", color: "var(--color-danger)" }}>
                            <Trash size={13} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", lineHeight: "1.5" }}>{spec.description}</p>
                      {spec.features && spec.features.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {spec.features.slice(0, 3).map((f, i) => (
                            <span key={i} style={{ fontSize: "0.75rem", backgroundColor: "rgba(42,157,181,0.08)", color: "var(--color-primary)", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>
                              {f}
                            </span>
                          ))}
                          {spec.features.length > 3 && <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>+{spec.features.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: User Management (Superadmin only) */}
          {activeSubTab === "users" && canAccessTab("users") && (
            <div className="animate-fade">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>حسابات المستخدمين وصلاحياتهم</h3>
                <button onClick={openAddUser} className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem", gap: "0.3rem" }}>
                  <Plus size={16} />
                  إضافة مستخدم جديد
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--color-border)", backgroundColor: "var(--color-light)" }}>
                      <th style={{ padding: "1rem", textAlign: "right" }}>الاسم التعريفي</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>اسم المستخدم</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>الصلاحية</th>
                      <th style={{ padding: "1rem", textAlign: "right" }}>كلمة المرور</th>
                      <th style={{ padding: "1rem", textAlign: "center" }}>العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "1rem", fontWeight: "bold" }}>{usr.name}</td>
                        <td style={{ padding: "1rem" }}>{usr.username}</td>
                        <td style={{ padding: "1rem" }}>
                          <span style={{ fontWeight: "bold", color: usr.role === "superadmin" ? "var(--color-primary)" : usr.role === "receptionist" ? "var(--color-secondary)" : "#8b5cf6" }}>
                            {usr.role === "superadmin" ? "سوبر أدمن" : usr.role === "receptionist" ? "استقبال" : "طبيب معالج"}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontFamily: "monospace" }}>{usr.password}</td>
                        <td style={{ padding: "1rem", display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                          <button onClick={() => openEditUser(usr)} style={{ padding: "0.4rem", border: "1px solid #cbd5e1", borderRadius: "4px", color: "var(--color-primary)" }}>
                            <Edit size={14} />
                          </button>
                          
                          {/* Protect against deleting self */}
                          {usr.id !== currentUser.id && (
                            <button 
                              onClick={() => { if(confirm("هل تريد حذف هذا المستخدم؟")) deleteUser(usr.id); }}
                              style={{ padding: "0.4rem", border: "1px solid var(--color-danger)", borderRadius: "4px", color: "var(--color-danger)" }}
                            >
                              <Trash size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* DOCTOR CREATE/EDIT MODAL OVERLAY */}
      {showDoctorModal && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="luxury-card animate-fade" style={{ width: "100%", maxWidth: "600px", maxH: "90vh", overflowY: "auto", padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              {editingDoctor ? `تعديل بيانات الطبيب: ${editingDoctor.name}` : "إضافة طبيب جديد"}
            </h3>

            <form onSubmit={handleDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>اسم الطبيب بالكامل</label>
                <input type="text" required className="form-input" value={docName} onChange={(e) => setDocName(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-double-col">
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>التخصص الطبي</label>
                  <select className="form-input" value={docSpecId} onChange={(e) => setDocSpecId(e.target.value)}>
                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>تاجات الاختصاص (مفصولة بفواصل)</label>
                  <input type="text" className="form-input" placeholder="استشاري، قلب وأوعية..." value={docTags} onChange={(e) => setDocTags(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>صورة الطبيب (ملف أو رابط)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="text" className="form-input" placeholder="رابط صورة الطبيب..." value={docImage} onChange={(e) => setDocImage(e.target.value)} />
                  <label style={{ flexShrink: 0, padding: "0.75rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontSize: "0.8rem", backgroundColor: "var(--color-light)", display: "inline-block" }}>
                    رفع ملف
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleSimulatedImageUpload} />
                  </label>
                </div>
                {docImage && (
                  <img src={docImage} alt="preview" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginTop: "0.5rem" }} />
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>نبذة عن الخبرة المهنية</label>
                <textarea rows="2" required className="form-input" style={{ resize: "none" }} value={docExperience} onChange={(e) => setDocExperience(e.target.value)}></textarea>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>المؤهلات العلمية (سطر لكل مؤهل)</label>
                <textarea rows="3" placeholder="دكتوراه من جامعة..." className="form-input" style={{ resize: "none" }} value={docCreds} onChange={(e) => setDocCreds(e.target.value)}></textarea>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="form-double-col">
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>أيام التواجد (مفصولة بفواصل)</label>
                  <input type="text" placeholder="الأحد، الاثنين" className="form-input" value={docDays} onChange={(e) => setDocDays(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>ساعات العيادة (مفصولة بفواصل)</label>
                  <input type="text" placeholder="10:00 ص - 02:00 م" className="form-input" value={docHours} onChange={(e) => setDocHours(e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowDoctorModal(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.5rem" }}>إلغاء</button>
                <button type="submit" className="btn btn-secondary" style={{ padding: "0.5rem 2rem" }}>حفظ</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* NEW PRESCRIPTION MODAL OVERLAY */}
      {showPrescriptionModal && selectedPatientBooking && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="luxury-card animate-fade" style={{ width: "100%", maxWidth: "650px", maxHeight: "90vh", overflowY: "auto", padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--color-primary)" }}>
              كتابة روشتة طبية الكترونية جديدة للمريض: {selectedPatientBooking.patientName}
            </h3>

            <form onSubmit={handlePrescriptionSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>التشخيص الطبي (Diagnosis)</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="مثال: التهاب معوي حاد، ارتفاع ضغط الدم..." 
                  value={rxDiagnosis} 
                  onChange={(e) => setRxDiagnosis(e.target.value)} 
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>الأدوية والجرعات المقررة (Medications)</label>
                  <button 
                    type="button" 
                    onClick={handleAddMedicineRow}
                    className="btn btn-outline" 
                    style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", gap: "0.2rem" }}
                  >
                    + إضافة دواء
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {rxMedicines.map((med, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }} className="medication-row">
                      <input 
                        type="text" 
                        required 
                        placeholder="اسم الدواء" 
                        className="form-input" 
                        style={{ flex: 2 }}
                        value={med.name} 
                        onChange={(e) => handleMedicineChange(idx, "name", e.target.value)} 
                      />
                      <input 
                        type="text" 
                        placeholder="الجرعة" 
                        className="form-input" 
                        style={{ flex: 1 }}
                        value={med.dosage} 
                        onChange={(e) => handleMedicineChange(idx, "dosage", e.target.value)} 
                      />
                      <input 
                        type="text" 
                        placeholder="التكرار" 
                        className="form-input" 
                        style={{ flex: 1.5 }}
                        value={med.frequency} 
                        onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)} 
                      />
                      <input 
                        type="text" 
                        placeholder="المدة" 
                        className="form-input" 
                        style={{ flex: 1 }}
                        value={med.period} 
                        onChange={(e) => handleMedicineChange(idx, "period", e.target.value)} 
                      />
                      {rxMedicines.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMedicineRow(idx)}
                          style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontSize: "0.85rem" }}
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>تعليمات ونصائح الطبيب للمريض</label>
                <textarea 
                  rows="3" 
                  className="form-input" 
                  placeholder="مثال: يرجى تقليل الملح والراحة التامة..." 
                  style={{ resize: "none" }} 
                  value={rxNotes} 
                  onChange={(e) => setRxNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowPrescriptionModal(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.5rem" }}>إلغاء</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 2rem" }}>حفظ وإصدار الروشتة</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* NEW DIAGNOSTIC REPORT MODAL OVERLAY */}
      {showReportModal && selectedPatientBooking && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="luxury-card animate-fade" style={{ width: "100%", maxWidth: "550px", padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", color: "var(--color-secondary)" }}>
              إضافة تقرير طبي وفحص جديد: {selectedPatientBooking.patientName}
            </h3>

            <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>نوع الفحص</label>
                  <select className="form-input" value={repType} onChange={(e) => setRepType(e.target.value)}>
                    <option value="lab">فحص معملي / تحاليل</option>
                    <option value="radiology">أشعة تشخيصية</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>حالة التقرير</label>
                  <select className="form-input" value={repStatus} onChange={(e) => setRepStatus(e.target.value)}>
                    <option value="ready">جاهز ومعتمد</option>
                    <option value="pending">مسودة / قيد المراجعة</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>عنوان التقرير</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="مثال: تحليل صورة دم كاملة CBC، أشعة X-Ray على الكتف" 
                  value={repTitle} 
                  onChange={(e) => setRepTitle(e.target.value)} 
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>نتائج التحليل/الأشعة بالتفصيل</label>
                <textarea 
                  rows="5" 
                  required
                  className="form-input" 
                  placeholder={repType === 'lab' ? "نسبة الهيموجلوبين: 14 g/dL\nصفائح دموية: 250,000" : "العظام والمفاصل: تبين وجود كسر بسيط..."}
                  style={{ resize: "none", fontFamily: repType === 'lab' ? 'monospace' : 'Tajawal, sans-serif' }} 
                  value={repResultText} 
                  onChange={(e) => setRepResultText(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>توصيات وملاحظات الأخصائي</label>
                <textarea 
                  rows="2" 
                  className="form-input" 
                  placeholder="مثال: ينصح بالمتابعة الطبية، النتائج مستقرة وطبيعية..." 
                  style={{ resize: "none" }} 
                  value={repNotes} 
                  onChange={(e) => setRepNotes(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.5rem" }}>إلغاء</button>
                <button type="submit" className="btn btn-secondary" style={{ padding: "0.5rem 2rem" }}>حفظ الفحص الطبي</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* USER CREATE/EDIT MODAL OVERLAY */}
      {showUserModal && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="luxury-card animate-fade" style={{ width: "100%", maxWidth: "450px", padding: "2.5rem" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              {editingUser ? `تعديل المستخدم: ${editingUser.name}` : "إضافة مستخدم جديد"}
            </h3>

            <form onSubmit={handleUserSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>اسم الموظف / الطبيب</label>
                <input type="text" required placeholder="مثال: منى علي" className="form-input" value={usrName} onChange={(e) => setUsrName(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>اسم المستخدم (Username)</label>
                <input type="text" required placeholder="مثال: mona123" className="form-input" value={usrUsername} onChange={(e) => setUsrUsername(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>الصلاحية والدور</label>
                <select className="form-input" value={usrRole} onChange={(e) => setUsrRole(e.target.value)}>
                  <option value="superadmin">سوبر أدمن / مدير نظام</option>
                  <option value="receptionist">موظف استقبال</option>
                  <option value="doctor">طبيب معالج</option>
                </select>
              </div>

              {/* If doctor role, associate it with a doctor profile ID */}
              {usrRole === "doctor" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>اربطه مع ملف الطبيب:</label>
                  <select className="form-input" value={usrDoctorId} onChange={(e) => setUsrDoctorId(e.target.value)}>
                    <option value="">-- اختر ملف الطبيب الممثل له --</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {/* Tab permissions (non-superadmin only) */}
              {usrRole !== "superadmin" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.5rem" }}>التبويبات المسموح بها:</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", backgroundColor: "var(--color-light)", padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid var(--color-border)" }}>
                    {[
                      { id: "bookings",    label: "إدارة الحجوزات" },
                      { id: "records",     label: "العيادة والملفات الطبية" },
                      { id: "doctors",     label: "إدارة الأطباء" },
                      { id: "specialties", label: "التخصصات والعيادات" },
                      { id: "content",     label: "محتوى الموقع" },
                      { id: "settings",    label: "إعدادات النظام" },
                      { id: "users",       label: "إدارة المستخدمين" },
                    ].map(tab => (
                      <label key={tab.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={usrAllowedTabs.includes(tab.id)}
                          onChange={(e) => {
                            if (e.target.checked) setUsrAllowedTabs(prev => [...prev, tab.id]);
                            else setUsrAllowedTabs(prev => prev.filter(t => t !== tab.id));
                          }}
                        />
                        {tab.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>كلمة المرور</label>
                <input type="text" required placeholder="مثال: pass123" className="form-input" value={usrPassword} onChange={(e) => setUsrPassword(e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowUserModal(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.5rem" }}>إلغاء</button>
                <button type="submit" className="btn btn-secondary" style={{ padding: "0.5rem 2rem" }}>حفظ</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SPECIALTY CREATE/EDIT MODAL */}
      {showSpecModal && (
        <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="luxury-card animate-fade" style={{ width: "100%", maxWidth: "500px", padding: "2.5rem", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              {editingSpec ? `تعديل: ${editingSpec.name}` : "إضافة تخصص طبي جديد"}
            </h3>

            <form onSubmit={handleSpecSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>اسم التخصص</label>
                <input type="text" required className="form-input" placeholder="مثال: طب القلب والأوعية" value={specName} onChange={(e) => setSpecName(e.target.value)} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>وصف مختصر</label>
                <textarea rows="2" required className="form-input" style={{ resize: "none" }} placeholder="وصف الخدمات المقدمة في هذا التخصص..." value={specDesc} onChange={(e) => setSpecDesc(e.target.value)}></textarea>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>
                  اسم الأيقونة (من Lucide React)
                </label>
                <input type="text" className="form-input" placeholder="مثال: Heart, Brain, Eye, Baby..." value={specIcon} onChange={(e) => setSpecIcon(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "var(--color-text-light)", display: "block", marginTop: "0.3rem" }}>
                  أمثلة: Heart، Stethoscope، Eye، Baby، Bone، Brain، Activity، Syringe، Microscope
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>
                  الخدمات الفرعية (سطر لكل خدمة)
                </label>
                <textarea rows="4" className="form-input" style={{ resize: "none" }} placeholder={"قسطرة القلب التشخيصية\nرسم القلب الكهربائي\nالإيكو القلبي"} value={specFeatures} onChange={(e) => setSpecFeatures(e.target.value)}></textarea>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowSpecModal(false)} className="btn btn-outline" style={{ padding: "0.5rem 1.5rem" }}>إلغاء</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.5rem 2rem" }}>حفظ التخصص</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .bookings-toolbar {
            flex-direction: column;
            align-items: flex-start !important;
          }
          .bookings-toolbar > div {
            width: 100%;
          }
          .bookings-toolbar select, .bookings-toolbar input {
            flex: 1;
          }
          .settings-editors-grid, .content-editors-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 576px) {
          .admin-docs-grid {
            grid-template-columns: 1fr !important;
          }
          .form-double-col {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      `}</style>

    </div>
  );
}
