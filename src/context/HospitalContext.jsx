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
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Inp5ZWN1YXZnb2VzeWlzeGprenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTk1NjUsImV4cCI6MjA5MjY3NTU2NX0.xVrRrfnFmZOUdIzzQDJyVvE3qcMkxib8JJuXFMc5SfE";

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
      const data = await apiGet("/api/hospital-data?resource=bookings");
      setBookings(Array.isArray(data) ? data : INITIAL_BOOKINGS);
    } catch (error) {
      console.warn("Supabase bookings fallback:", error);
      setBookings(INITIAL_BOOKINGS);
      setCloudError("تعذر تحميل الحجوزات من Supabase.");
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      setCloudLoading(true);
      setCloudError("");

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
        setUsers(nextUsers);
        setPrescriptions(nextPrescriptions);
        setReports(nextReports);

        const localUser = safeParse(localStorage.getItem("fhh_current_user"), null);
        if (localUser?.username && localUser?.role) setCurrentUser(localUser);

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
    const payload = {
      ...newBooking,
      id: newBooking.id || `FHH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      status: newBooking.status || "pending"
    };

    const saved = await apiPost({ action: "addBooking", booking: payload });
    const finalBooking = saved || payload;
    setBookings((prev) => [finalBooking, ...prev]);
    return finalBooking;
  };

  const updateBookingStatus = async (id, status) => {
    await apiPost({ action: "updateBookingStatus", id, status });
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status } : booking)));
  };

  const deleteBooking = async (id) => {
    await apiPost({ action: "deleteBooking", id });
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
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
        deleteSpecialty
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};
