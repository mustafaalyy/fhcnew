import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_SPECIALTIES,
  INITIAL_DOCTORS,
  INITIAL_SLIDES,
  INITIAL_ABOUT_SECTIONS,
  DEFAULT_SETTINGS,
  INITIAL_BOOKINGS,
  INITIAL_USERS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REPORTS
} from "../utils/mockData";

const SUPABASE_URL = "https://zyecuavgoesyisxjkzxu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZWN1YXZnb2VzeWlzeGprenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTk1NjUsImV4cCI6MjA5MjY3NTU2NX0.xVrRrfnFmZOUdIzzQDJyVvE3qcMkxib8JJuXFMc5SfE";
const HospitalContext = createContext();

const DATA_KEYS = {
  specialties: "app_specialties",
  doctors: "app_doctors",
  slides: "app_slides",
  aboutSections: "app_about_sections",
  settings: "app_settings",
  users: "app_users",
  prescriptions: "app_prescriptions",
  reports: "app_reports"
};

const LABELS = {
  [DATA_KEYS.specialties]: "بيانات التخصصات والعيادات",
  [DATA_KEYS.doctors]: "بيانات الأطباء",
  [DATA_KEYS.slides]: "سلايدر الصفحة الرئيسية",
  [DATA_KEYS.aboutSections]: "محتوى من نحن",
  [DATA_KEYS.settings]: "إعدادات الموقع",
  [DATA_KEYS.users]: "مستخدمي لوحة التحكم",
  [DATA_KEYS.prescriptions]: "روشتات المرضى",
  [DATA_KEYS.reports]: "تقارير المرضى"
};

const safeParse = (value, fallback) => {
  try {
    if (value === undefined || value === null || value === "") return fallback;
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    }

    if (fallback && typeof fallback === "object") {
      return parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
        ? { ...fallback, ...parsed }
        : fallback;
    }

    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};


const apiGet = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store"
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "API request failed");
  }
  return payload.data;
};

const apiPost = async (body) => {
  const response = await fetch("/api/hospital-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "API request failed");
  }
  return payload.data;
};



const localKey = (key) => `fhh_${key}`;

const saveLocal = (key, value) => {
  try {
    localStorage.setItem(localKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn("LocalStorage save failed:", key, error);
  }
};

const loadLocal = (key, fallback) => {
  try {
    return safeParse(localStorage.getItem(localKey(key)), fallback);
  } catch {
    return fallback;
  }
};

const sbFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Supabase request failed: ${res.status}`);
  }

  const body = await res.text();
  return body ? JSON.parse(body) : null;
};

// Upload logo to Supabase Storage and return public URL
const uploadLogoToStorage = async (file) => {
  const fileName = `logo_${Date.now()}.png`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/logos/${fileName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type || "image/png",
      "x-upsert": "true"
    },
    body: file
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage upload failed: ${err}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/logos/${fileName}`;
};

const loadSiteValue = async (key, fallback) => {
  const row = await apiGet(`/api/hospital-data?key=${encodeURIComponent(key)}`);
  if (!row) return null;
  return safeParse(row?.value, fallback);
};

const saveSiteValue = async (key, value) => {
  return await apiPost({
    action: "saveSiteValue",
    key,
    value,
    label: LABELS[key] || key
  });
};

const loadTableRows = async (tableName) => {
  try {
    const rows = await sbFetch(`${tableName}?select=*`);
    return Array.isArray(rows) && rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
};

const loadCloudCollection = async ({ key, fallback, tableName }) => {
  try {
    const fromSiteContent = await loadSiteValue(key, fallback);
    if (fromSiteContent) return fromSiteContent;

    if (tableName) {
      const tableRows = await loadTableRows(tableName);
      if (tableRows) {
        await saveSiteValue(key, tableRows);
        return tableRows;
      }
    }

    await saveSiteValue(key, fallback);
    return fallback;
  } catch (error) {
    console.warn("Cloud load fallback:", key, error);
    return fallback;
  }
};

const saveCloudCollection = async (key, value) => {
  try {
    await saveSiteValue(key, value);
  } catch (error) {
    console.error("Cloud save failed:", key, error);
    alert("فشل حفظ التعديل في قاعدة البيانات. راجع إعدادات Supabase/Vercel.");
    throw error;
  }
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};

export const HospitalProvider = ({ children }) => {
  const [specialties, setSpecialties] = useState(INITIAL_SPECIALTIES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [aboutSections, setAboutSections] = useState(INITIAL_ABOUT_SECTIONS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [currentUser, setCurrentUser] = useState(null);
  const [cloudLoading, setCloudLoading] = useState(true);
  const [cloudError, setCloudError] = useState("");

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await res.json();
      const normalized = Array.isArray(data) ? data.map(b => ({
        ...b,
        id: b.reference_code || b.id,
        patientName: b.patient_name || "",
        phone: b.patient_phone || "",
        age: b.patient_age || "",
        specialtyName: b.specialty || "",
        doctorId: b.doctor_id || "",
        doctorName: b.doctor_name || "",
        date: b.booking_date || "",
        time: b.booking_time || "",
        notes: b.complaint || "",
        status: b.status || "pending"
      })) : [];
      setBookings(normalized);
    } catch (error) {
      console.warn("fetchBookings error:", error);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      setCloudLoading(true);
      setCloudError("");

      // Load current user FIRST before any async calls
      const localUser = safeParse(localStorage.getItem("fhh_current_user"), null);
      if (localUser?.username && localUser?.role) {
        if (mounted) setCurrentUser(localUser);
      }

      try {
        const [
          nextSpecialties,
          nextDoctors,
          nextSlides,
          nextAboutSections,
          nextSettings,
          nextUsers,
          nextPrescriptions,
          nextReports
        ] = await Promise.all([
          loadCloudCollection({ key: DATA_KEYS.specialties, fallback: INITIAL_SPECIALTIES }),
          loadCloudCollection({ key: DATA_KEYS.doctors, fallback: INITIAL_DOCTORS, tableName: "doctors" }),
          loadCloudCollection({ key: DATA_KEYS.slides, fallback: INITIAL_SLIDES }),
          loadCloudCollection({ key: DATA_KEYS.aboutSections, fallback: INITIAL_ABOUT_SECTIONS }),
          loadCloudCollection({ key: DATA_KEYS.settings, fallback: DEFAULT_SETTINGS }),
          loadCloudCollection({ key: DATA_KEYS.users, fallback: INITIAL_USERS, tableName: "admin_users" }),
          loadCloudCollection({ key: DATA_KEYS.prescriptions, fallback: INITIAL_PRESCRIPTIONS }),
          loadCloudCollection({ key: DATA_KEYS.reports, fallback: INITIAL_REPORTS })
        ]);

        if (!mounted) return;

        setSpecialties(nextSpecialties);
        setDoctors(nextDoctors);
        setSlides(nextSlides);
        setAboutSections(nextAboutSections);
        setSettings(nextSettings);
        if (nextSettings?.logo) localStorage.setItem("fhh_logo", nextSettings.logo);
        setUsers(nextUsers);
        setPrescriptions(nextPrescriptions);
        setReports(nextReports);

        await fetchBookings();
      } catch (error) {
        console.error("Hospital cloud hydration failed:", error);
        if (!mounted) return;
        setCloudError("تعذر تحميل بعض البيانات من Supabase، تم استخدام النسخة المحلية مؤقتًا.");
      } finally {
        if (mounted) setCloudLoading(false);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (settings.primaryColor && settings.secondaryColor && settings.darkColor) {
      document.documentElement.style.setProperty("--color-primary", settings.primaryColor);
      document.documentElement.style.setProperty("--color-secondary", settings.secondaryColor);
      document.documentElement.style.setProperty("--color-dark", settings.darkColor);
    }
  }, [settings]);

  const login = (username, password) => {
    const foundUser = users.find(
      (u) =>
        String(u.username || "").trim().toLowerCase() === String(username || "").trim().toLowerCase() &&
        String(u.password || "") === String(password || "")
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem("fhh_current_user", JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }

    return { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fhh_current_user");
  };

  const addBooking = async (newBooking) => {
    const refCode = `FHH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    // Map to exact Supabase column names
    const payload = {
      patient_name: newBooking.patientName || "",
      patient_phone: newBooking.phone || "",
      patient_age: parseInt(newBooking.age) || 0,
      patient_gender: newBooking.gender || "male",
      specialty: newBooking.specialtyName || "",
      doctor_id: newBooking.doctorId || null,
      doctor_name: newBooking.doctorName || "",
      booking_date: newBooking.date || "",
      booking_time: newBooking.time || "",
      visit_type: "new",
      complaint: newBooking.notes || null,
      status: "pending",
      reference_code: refCode,
      created_at: new Date().toISOString()
    };
    // Local representation with camelCase for UI
    const localBooking = {
      id: refCode,
      patientName: payload.patient_name,
      phone: payload.patient_phone,
      age: payload.patient_age,
      specialtyName: payload.specialty,
      doctorId: payload.doctor_id,
      doctorName: payload.doctor_name,
      date: payload.booking_date,
      time: payload.booking_time,
      notes: payload.complaint,
      status: payload.status,
      reference_code: refCode,
      created_at: payload.created_at
    };
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const saved = Array.isArray(data) ? data[0] : data;
      if (saved && saved.id) localBooking.id = saved.id;
      setBookings((prev) => [localBooking, ...prev]);
      return localBooking;
    } catch (err) {
      console.error("addBooking error:", err);
      setBookings((prev) => [localBooking, ...prev]);
      return localBooking;
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      // Try by reference_code first, then by id
      await fetch(`${SUPABASE_URL}/rest/v1/bookings?reference_code=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error("updateBookingStatus error:", err);
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = async (id) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/bookings?reference_code=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal"
        }
      });
    } catch (err) {
      console.error("deleteBooking error:", err);
    }
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addDoctor = (doctor) => {
    const nextDoctor = {
      ...doctor,
      id: doctor.id || `dr-${String(doctor.name || Date.now()).replace(/\s+/g, "-").toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      rating: doctor.rating || 4.8,
      reviewsCount: doctor.reviewsCount || Math.floor(5 + Math.random() * 90)
    };
    const nextDoctors = [...doctors, nextDoctor];
    setDoctors(nextDoctors);
    saveCloudCollection(DATA_KEYS.doctors, nextDoctors);
  };

  const updateDoctor = (updatedDoctor) => {
    const nextDoctors = doctors.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor));
    setDoctors(nextDoctors);
    saveCloudCollection(DATA_KEYS.doctors, nextDoctors);
  };

  const deleteDoctor = (id) => {
    const nextDoctors = doctors.filter((doctor) => doctor.id !== id);
    setDoctors(nextDoctors);
    saveCloudCollection(DATA_KEYS.doctors, nextDoctors);
  };

  const updateSlides = (nextSlides) => {
    setSlides(nextSlides);
    saveCloudCollection(DATA_KEYS.slides, nextSlides);
  };

  const updateAboutSections = (nextAboutSections) => {
    setAboutSections(nextAboutSections);
    saveCloudCollection(DATA_KEYS.aboutSections, nextAboutSections);
  };

  const updateSettings = (nextSettings) => {
    const mergedSettings = { ...settings, ...nextSettings };
    setSettings(mergedSettings);
    if (mergedSettings.logo) {
      localStorage.setItem("fhh_logo", mergedSettings.logo);
    }
    saveCloudCollection(DATA_KEYS.settings, mergedSettings);
  };

  const addUser = (newUser) => {
    const nextUser = { ...newUser, id: newUser.id || `user-${Date.now()}` };
    const nextUsers = [...users, nextUser];
    setUsers(nextUsers);
    saveCloudCollection(DATA_KEYS.users, nextUsers);
  };

  const updateUser = (updatedUser) => {
    const nextUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
    setUsers(nextUsers);
    saveCloudCollection(DATA_KEYS.users, nextUsers);

    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem("fhh_current_user", JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (id) => {
    const nextUsers = users.filter((user) => user.id !== id);
    setUsers(nextUsers);
    saveCloudCollection(DATA_KEYS.users, nextUsers);
  };

  const addPrescription = (prescription) => {
    const nextPrescription = {
      ...prescription,
      id: prescription.id || `rx-${Math.floor(1000 + Math.random() * 9000)}`,
      date: prescription.date || new Date().toISOString().split("T")[0]
    };
    const nextPrescriptions = [nextPrescription, ...prescriptions];
    setPrescriptions(nextPrescriptions);
    saveCloudCollection(DATA_KEYS.prescriptions, nextPrescriptions);
    return nextPrescription;
  };

  const deletePrescription = (id) => {
    const nextPrescriptions = prescriptions.filter((prescription) => prescription.id !== id);
    setPrescriptions(nextPrescriptions);
    saveCloudCollection(DATA_KEYS.prescriptions, nextPrescriptions);
  };

  const addReport = (report) => {
    const nextReport = {
      ...report,
      id: report.id || `rep-${Math.floor(1000 + Math.random() * 9000)}`,
      date: report.date || new Date().toISOString().split("T")[0],
      status: report.status || "ready"
    };
    const nextReports = [nextReport, ...reports];
    setReports(nextReports);
    saveCloudCollection(DATA_KEYS.reports, nextReports);
    return nextReport;
  };

  const deleteReport = (id) => {
    const nextReports = reports.filter((report) => report.id !== id);
    setReports(nextReports);
    saveCloudCollection(DATA_KEYS.reports, nextReports);
  };

  const addSpecialty = (specialty) => {
    const nextSpecialty = { ...specialty, id: specialty.id || `spec-${Date.now()}` };
    const nextSpecialties = [...specialties, nextSpecialty];
    setSpecialties(nextSpecialties);
    saveCloudCollection(DATA_KEYS.specialties, nextSpecialties);
  };

  const updateSpecialty = (updatedSpecialty) => {
    const nextSpecialties = specialties.map((specialty) =>
      specialty.id === updatedSpecialty.id ? updatedSpecialty : specialty
    );
    setSpecialties(nextSpecialties);
    saveCloudCollection(DATA_KEYS.specialties, nextSpecialties);
  };

  const deleteSpecialty = (id) => {
    const nextSpecialties = specialties.filter((specialty) => specialty.id !== id);
    setSpecialties(nextSpecialties);
    saveCloudCollection(DATA_KEYS.specialties, nextSpecialties);
  };

  return (
    <HospitalContext.Provider
      value={{
        specialties,
        doctors,
        slides,
        aboutSections,
        settings,
        bookings,
        bookingsLoading,
        users,
        prescriptions,
        reports,
        currentUser,
        cloudLoading,
        cloudError,
        login,
        logout,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        fetchBookings,
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
        deleteReport,
        addSpecialty,
        updateSpecialty,
        deleteSpecialty,
        uploadLogoToStorage
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};