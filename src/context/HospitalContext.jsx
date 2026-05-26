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


const HospitalContext = createContext();

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};

export const HospitalProvider = ({ children }) => {
  const [specialties] = useState(INITIAL_SPECIALTIES);
  const [doctors, setDoctors] = useState([]);
  const [slides, setSlides] = useState([]);
  const [aboutSections, setAboutSections] = useState({});
  const [settings, setSettings] = useState({});
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize from LocalStorage or mockData
  useEffect(() => {
    const localDoctors = localStorage.getItem("fhh_doctors");
    const localSlides = localStorage.getItem("fhh_slides");
    const localAbout = localStorage.getItem("fhh_about");
    const localSettings = localStorage.getItem("fhh_settings");
    const localBookings = localStorage.getItem("fhh_bookings");
    const localUsers = localStorage.getItem("fhh_users");
    const localUser = localStorage.getItem("fhh_current_user");

    if (localDoctors) setDoctors(JSON.parse(localDoctors));
    else {
      setDoctors(INITIAL_DOCTORS);
      localStorage.setItem("fhh_doctors", JSON.stringify(INITIAL_DOCTORS));
    }

    if (localSlides) setSlides(JSON.parse(localSlides));
    else {
      setSlides(INITIAL_SLIDES);
      localStorage.setItem("fhh_slides", JSON.stringify(INITIAL_SLIDES));
    }

    if (localAbout) setAboutSections(JSON.parse(localAbout));
    else {
      setAboutSections(INITIAL_ABOUT_SECTIONS);
      localStorage.setItem("fhh_about", JSON.stringify(INITIAL_ABOUT_SECTIONS));
    }

    if (localSettings) setSettings(JSON.parse(localSettings));
    else {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem("fhh_settings", JSON.stringify(DEFAULT_SETTINGS));
    }

    if (localBookings) setBookings(JSON.parse(localBookings));
    else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem("fhh_bookings", JSON.stringify(INITIAL_BOOKINGS));
    }

    if (localUsers) setUsers(JSON.parse(localUsers));
    else {
      setUsers(INITIAL_USERS);
      localStorage.setItem("fhh_users", JSON.stringify(INITIAL_USERS));
    }

    const localPrescriptions = localStorage.getItem("fhh_prescriptions");
    const localReports = localStorage.getItem("fhh_reports");

    if (localPrescriptions) setPrescriptions(JSON.parse(localPrescriptions));
    else {
      setPrescriptions(INITIAL_PRESCRIPTIONS);
      localStorage.setItem("fhh_prescriptions", JSON.stringify(INITIAL_PRESCRIPTIONS));
    }

    if (localReports) setReports(JSON.parse(localReports));
    else {
      setReports(INITIAL_REPORTS);
      localStorage.setItem("fhh_reports", JSON.stringify(INITIAL_REPORTS));
    }

    if (localUser) {
      setCurrentUser(JSON.parse(localUser));
    }
  }, []);

  // Sync state changes with CSS Variables dynamically!
  useEffect(() => {
    if (settings.primaryColor && settings.secondaryColor && settings.darkColor) {
      document.documentElement.style.setProperty("--color-primary", settings.primaryColor);
      document.documentElement.style.setProperty("--color-secondary", settings.secondaryColor);
      document.documentElement.style.setProperty("--color-dark", settings.darkColor);
    }
  }, [settings]);

  // Auth Operations
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

  // Booking Operations
  const addBooking = (newBooking) => {
    const updatedBookings = [
      {
        ...newBooking,
        id: `FHH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      },
      ...bookings
    ];
    setBookings(updatedBookings);
    localStorage.setItem("fhh_bookings", JSON.stringify(updatedBookings));
    return updatedBookings[0];
  };

  const updateBookingStatus = (id, status) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    localStorage.setItem("fhh_bookings", JSON.stringify(updated));
  };

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("fhh_bookings", JSON.stringify(updated));
  };

  // Doctor Operations
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

  // Content Operations (Hero slides, About section)
  const updateSlides = (newSlides) => {
    setSlides(newSlides);
    localStorage.setItem("fhh_slides", JSON.stringify(newSlides));
  };

  const updateAboutSections = (updatedAbout) => {
    setAboutSections(updatedAbout);
    localStorage.setItem("fhh_about", JSON.stringify(updatedAbout));
  };

  // Setting Operations
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("fhh_settings", JSON.stringify(newSettings));
  };

  // User Operations
  const addUser = (newUser) => {
    const updated = [
      ...users,
      { ...newUser, id: `user-${Math.floor(Math.random() * 1000)}` }
    ];
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

  // Prescription Operations
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

  // Diagnostic Report Operations
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
        users,
        prescriptions,
        reports,
        currentUser,
        login,
        logout,
        addBooking,
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
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};
