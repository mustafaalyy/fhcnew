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

// ─── Supabase ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://zyecuavgoesyisxjkzxu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5ZWN1YXZnb2VzeWlzeGprenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTk1NjUsImV4cCI6MjA5MjY3NTU2NX0.xVrRrfnFmZOUdIzzQDJyVvE3qcMkxib8JJuXFMc5SfE";

const sbFetch = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
// ─────────────────────────────────────────────────────────────────────────────

const HospitalContext = createContext();

const safeParseStorage = (value, fallback) => {
  try {
    if (!value) return fallback;
    const parsed = JSON.parse(value);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    }
    if (fallback && typeof fallback === "object") {
      return parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
        ? parsed : fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error("useHospital must be used within a HospitalProvider");
  return context;
};

export const HospitalProvider = ({ children }) => {
  const [specialties] = useState(INITIAL_SPECIALTIES);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [aboutSections, setAboutSections] = useState(INITIAL_ABOUT_SECTIONS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [currentUser, setCurrentUser] = useState(null);

  // ── Load bookings from Supabase ──────────────────────────────────────────
  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const data = await sbFetch("bookings?select=*&order=created_at.desc", {
        prefer: "return=representation"
      });
      setBookings(data || []);
    } catch (e) {
      console.error("Supabase fetch error:", e);
      // fallback to localStorage if Supabase fails
      const local = localStorage.getItem("fhh_bookings");
      setBookings(safeParseStorage(local, INITIAL_BOOKINGS));
    } finally {
      setBookingsLoading(false);
    }
  };

  // ── Init from localStorage (non-booking data) ────────────────────────────
  useEffect(() => {
    const localDoctors   = localStorage.getItem("fhh_doctors");
    const localSlides    = localStorage.getItem("fhh_slides");
    const localAbout     = localStorage.getItem("fhh_about");
    const localSettings  = localStorage.getItem("fhh_settings");
    const localUsers     = localStorage.getItem("fhh_users");
    const localUser      = localStorage.getItem("fhh_current_user");

    setDoctors(safeParseStorage(localDoctors, INITIAL_DOCTORS));
    setSlides(safeParseStorage(localSlides, INITIAL_SLIDES));
    setAboutSections(safeParseStorage(localAbout, INITIAL_ABOUT_SECTIONS));
    setSettings(safeParseStorage(localSettings, DEFAULT_SETTINGS));
    setUsers(safeParseStorage(localUsers, INITIAL_USERS));

    const localPrescriptions = localStorage.getItem("fhh_prescriptions");
    const localReports = localStorage.getItem("fhh_reports");
    setPrescriptions(safeParseStorage(localPrescriptions, INITIAL_PRESCRIPTIONS));
    setReports(safeParseStorage(localReports, INITIAL_REPORTS));

    if (localUser) setCurrentUser(JSON.parse(localUser));

    // Load bookings from Supabase
    fetchBookings();
  }, []);

  // ── Sync colors ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (settings.primaryColor && settings.secondaryColor && settings.darkColor) {
      document.documentElement.style.setProperty("--color-primary", settings.primaryColor);
      document.documentElement.style.setProperty("--color-secondary", settings.secondaryColor);
      document.documentElement.style.setProperty("--color-dark", settings.darkColor);
    }
  }, [settings]);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const login = (username, password) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
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

  // ── Booking Operations (Supabase) ────────────────────────────────────────
  const addBooking = async (newBooking) => {
    const payload = {
      ...newBooking,
      id: `FHH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
      status: newBooking.status || "pending"
    };
    try {
      const [inserted] = await sbFetch("bookings", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setBookings((prev) => [inserted, ...prev]);
      return inserted;
    } catch (e) {
      console.error("addBooking error:", e);
      // fallback: save locally
      setBookings((prev) => [payload, ...prev]);
      return payload;
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await sbFetch(`bookings?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch (e) {
      console.error("updateBookingStatus error:", e);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }
  };

  const deleteBooking = async (id) => {
    try {
      await sbFetch(`bookings?id=eq.${id}`, {
        method: "DELETE",
        prefer: "return=minimal"
      });
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error("deleteBooking error:", e);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // ── Doctor Operations ────────────────────────────────────────────────────
  const addDoctor = (doctor) => {
    const newDoc = {
      ...doctor,
      id: `dr-${doctor.name.replace(/\s+/g, "-").toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      rating: 4.8,
      reviewsCount: Math.floor(5 + Math.random() * 90)
    };
    const updated = [...doctors, newDoc];
    setDoctors(updated);
    localStorage.setItem("fhh_doctors", JSON.stringify(updated));
  };

  const updateDoctor = (updatedDoc) => {
    const updated = doctors.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
    setDoctors(updated);
    localStorage.setItem("fhh_doctors", JSON.stringify(updated));
  };

  const deleteDoctor = (id) => {
    const updated = doctors.filter((d) => d.id !== id);
    setDoctors(updated);
    localStorage.setItem("fhh_doctors", JSON.stringify(updated));
  };

  // ── Content Operations ───────────────────────────────────────────────────
  const updateSlides = (newSlides) => {
    setSlides(newSlides);
    localStorage.setItem("fhh_slides", JSON.stringify(newSlides));
  };

  const updateAboutSections = (updatedAbout) => {
    setAboutSections(updatedAbout);
    localStorage.setItem("fhh_about", JSON.stringify(updatedAbout));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("fhh_settings", JSON.stringify(newSettings));
  };

  // ── User Operations ──────────────────────────────────────────────────────
  const addUser = (newUser) => {
    const updated = [...users, { ...newUser, id: `user-${Math.floor(Math.random() * 1000)}` }];
    setUsers(updated);
    localStorage.setItem("fhh_users", JSON.stringify(updated));
  };

  const updateUser = (updatedUser) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    localStorage.setItem("fhh_users", JSON.stringify(updated));
  };

  const deleteUser = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("fhh_users", JSON.stringify(updated));
  };

  // ── Prescription Operations ──────────────────────────────────────────────
  const addPrescription = (prescription) => {
    const newRx = {
      ...prescription,
      id: `rx-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0]
    };
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    localStorage.setItem("fhh_prescriptions", JSON.stringify(updated));
    return newRx;
  };

  const deletePrescription = (id) => {
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("fhh_prescriptions", JSON.stringify(updated));
  };

  // ── Report Operations ────────────────────────────────────────────────────
  const addReport = (report) => {
    const newRep = {
      ...report,
      id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      status: report.status || "ready"
    };
    const updated = [newRep, ...reports];
    setReports(updated);
    localStorage.setItem("fhh_reports", JSON.stringify(updated));
    return newRep;
  };

  const deleteReport = (id) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("fhh_reports", JSON.stringify(updated));
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
        deleteReport
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};
