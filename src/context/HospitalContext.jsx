import React, { createContext, useContext, useState, // Load data from Supabase first. mockData is only a fallback if Supabase returns empty tables.
  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const data = await apiLoadHospitalData();
        if (!mounted) return;

        const nextDoctors = Array.isArray(data.doctors) && data.doctors.length ? data.doctors : INITIAL_DOCTORS;
        const nextSlides = Array.isArray(data.slides) && data.slides.length ? data.slides : INITIAL_SLIDES;
        const nextAboutSections = Array.isArray(data.aboutSections) && data.aboutSections.length ? data.aboutSections : INITIAL_ABOUT_SECTIONS;
        const nextSettings = Array.isArray(data.settings) && data.settings.length ? data.settings[0] : DEFAULT_SETTINGS;
        const nextBookings = Array.isArray(data.bookings) ? data.bookings : INITIAL_BOOKINGS;
        const nextUsers = Array.isArray(data.users) && data.users.length ? data.users : INITIAL_USERS;
        const nextPrescriptions = Array.isArray(data.prescriptions) ? data.prescriptions : INITIAL_PRESCRIPTIONS;
        const nextReports = Array.isArray(data.reports) ? data.reports : INITIAL_REPORTS;

        setDoctors(nextDoctors);
        setSlides(nextSlides);
        setAboutSections(nextAboutSections);
        setSettings(nextSettings);
        setBookings(nextBookings);
        setUsers(nextUsers);
        setPrescriptions(nextPrescriptions);
        setReports(nextReports);
        setSupabaseError("");

        const localUser = localStorage.getItem("fhh_current_user");
        if (localUser) setCurrentUser(safeParseStorage(localUser, null));
      } catch (error) {
        console.error("Supabase hydrate failed:", error);
        if (!mounted) return;
        setSupabaseError(error.message || "فشل الاتصال بقاعدة البيانات");
        setDoctors(INITIAL_DOCTORS);
        setSlides(INITIAL_SLIDES);
        setAboutSections(INITIAL_ABOUT_SECTIONS);
        setSettings(DEFAULT_SETTINGS);
        setBookings(INITIAL_BOOKINGS);
        setUsers(INITIAL_USERS);
        setPrescriptions(INITIAL_PRESCRIPTIONS);
        setReports(INITIAL_REPORTS);
      }
    };

    hydrate();

    
  const persistDoctors = async (nextDoctors) => {
    setDoctors(nextDoctors);
    await apiSaveHospitalData("doctors", nextDoctors);
  };

  const persistSlides = async (nextSlides) => {
    setSlides(nextSlides);
    await apiSaveHospitalData("slides", nextSlides);
  };

  const persistAboutSections = async (nextAboutSections) => {
    setAboutSections(nextAboutSections);
    await apiSaveHospitalData("aboutSections", Array.isArray(nextAboutSections) ? nextAboutSections : [nextAboutSections]);
  };

  const persistSettings = async (nextSettings) => {
    setSettings(nextSettings);
    await apiSaveHospitalData("settings", [nextSettings]);
  };

  const persistBookings = async (nextBookings) => {
    setBookings(nextBookings);
    await apiSaveHospitalData("bookings", nextBookings);
  };

  const persistUsers = async (nextUsers) => {
    setUsers(nextUsers);
    await apiSaveHospitalData("users", nextUsers);
  };

  const persistPrescriptions = async (nextPrescriptions) => {
    setPrescriptions(nextPrescriptions);
    await apiSaveHospitalData("prescriptions", nextPrescriptions);
  };

  const persistReports = async (nextReports) => {
    setReports(nextReports);
    await apiSaveHospitalData("reports", nextReports);
  };

return () => {
      mounted = false;
    };
  }, []);

useEffect } from "react";
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

const HospitalContext = createContext();


const apiLoadHospitalData = async () => {
  const response = await fetch("/api/hospital-data", {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "فشل تحميل البيانات من Supabase");
  }

  return payload.data || {};
};

const apiSaveHospitalData = async (key, items) => {
  const response = await fetch("/api/hospital-data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ key, items })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `فشل حفظ ${key} في Supabase`);
  }

  return payload.data || [];
};



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

const apiRequest = async (payload) => {
  const response = await fetch("/api/hospital-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `API request failed: ${response.status}`);
  }

  return data;
};

const getCollectionFallback = (key) => {
  const fallbacks = {
    [DATA_KEYS.specialties]: INITIAL_SPECIALTIES,
    [DATA_KEYS.doctors]: INITIAL_DOCTORS,
    [DATA_KEYS.slides]: INITIAL_SLIDES,
    [DATA_KEYS.aboutSections]: INITIAL_ABOUT_SECTIONS,
    [DATA_KEYS.settings]: DEFAULT_SETTINGS,
    [DATA_KEYS.users]: INITIAL_USERS,
    [DATA_KEYS.prescriptions]: INITIAL_PRESCRIPTIONS,
    [DATA_KEYS.reports]: INITIAL_REPORTS
  };

  return fallbacks[key];
};

const saveCloudCollection = async (key, value) => {
  await apiRequest({
    action: "saveCollection",
    key,
    label: LABELS[key] || key,
    value
  });
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
  
  const [supabaseError, setSupabaseError] = useState("");
const [cloudLoading, setCloudLoading] = useState(true);
  const [cloudError, setCloudError] = useState("");

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await apiRequest({ action: "listBookings" });
      const nextBookings = safeParse(data.bookings, INITIAL_BOOKINGS);
      setBookings(nextBookings);
    } catch (error) {
      console.error("Supabase bookings load failed:", error);
      setCloudError("تعذر تحميل الحجوزات من Supabase. تأكد من متغيرات البيئة في Vercel.");
      setBookings(INITIAL_BOOKINGS);
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
        const data = await apiRequest({ action: "load" });
        const collections = data.collections || {};

        const nextSpecialties = safeParse(collections[DATA_KEYS.specialties], INITIAL_SPECIALTIES);
        const nextDoctors = safeParse(collections[DATA_KEYS.doctors], INITIAL_DOCTORS);
        const nextSlides = safeParse(collections[DATA_KEYS.slides], INITIAL_SLIDES);
        const nextAboutSections = safeParse(collections[DATA_KEYS.aboutSections], INITIAL_ABOUT_SECTIONS);
        const nextSettings = safeParse(collections[DATA_KEYS.settings], DEFAULT_SETTINGS);
        const nextUsers = safeParse(collections[DATA_KEYS.users], INITIAL_USERS);
        const nextPrescriptions = safeParse(collections[DATA_KEYS.prescriptions], INITIAL_PRESCRIPTIONS);
        const nextReports = safeParse(collections[DATA_KEYS.reports], INITIAL_REPORTS);
        const nextBookings = safeParse(data.bookings, INITIAL_BOOKINGS);

        if (!mounted) return;

        setSpecialties(nextSpecialties);
        setDoctors(nextDoctors);
        setSlides(nextSlides);
        setAboutSections(nextAboutSections);
        setSettings(nextSettings);
        setUsers(nextUsers);
        setPrescriptions(nextPrescriptions);
        setReports(nextReports);
        setBookings(nextBookings);

        const localUser = safeParse(localStorage.getItem("fhh_current_user"), null);
        if (localUser?.username && localUser?.role) setCurrentUser(localUser);
      } catch (error) {
        console.error("Hospital Supabase hydration failed:", error);
        if (!mounted) return;
        setCloudError("تعذر تحميل بيانات Supabase. تأكد من SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في Vercel.");
      } finally {
        if (mounted) {
          setCloudLoading(false);
          setBookingsLoading(false);
        }
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

    const data = await apiRequest({ action: "addBooking", booking: payload });
    const saved = data.booking || payload;
    const nextBookings = [saved, ...bookings];
    setBookings(nextBookings);
    return saved;
  };

  const updateBookingStatus = async (id, status) => {
    const data = await apiRequest({ action: "updateBookingStatus", id, status });
    const saved = data.booking;
    const nextBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, ...(saved || {}), status } : booking
    );
    setBookings(nextBookings);
  };

  const deleteBooking = async (id) => {
    await apiRequest({ action: "deleteBooking", id });
    const nextBookings = bookings.filter((booking) => booking.id !== id);
    setBookings(nextBookings);
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
