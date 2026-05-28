import React, { useEffect, useState } from "react";
import { HospitalProvider } from "./context/HospitalContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import PatientPortal from "./pages/PatientPortal";


const getInitialTabFromUrl = () => {
  const hash = window.location.hash.replace("#", "").toLowerCase();
  const path = window.location.pathname.replace("/", "").toLowerCase();

  if (hash === "admin" || path === "admin") return "admin";
  if (hash === "portal" || path === "portal") return "portal";
  return "home";
};


function MainApp() {
  const [currentTab, setCurrentTab] = useState(getInitialTabFromUrl);
  
  // Shared state for deep linking/pre-filling booking
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const navigateToTab = (tabId) => {
    setCurrentTab(tabId);
    if (tabId === "admin") {
      window.location.hash = "admin";
    } else if (window.location.hash === "#admin") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      const nextTab = getInitialTabFromUrl();
      if (nextTab === "admin" || nextTab === "portal") {
        setCurrentTab(nextTab);
      }
    };

    handleRouteChange();
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const renderPage = () => {
    switch (currentTab) {
      case "home":
        return (
          <Home
            setCurrentTab={navigateToTab}
            selectedDoctorId={selectedDoctorId}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        );
      case "services":
        return (
          <Services
            setCurrentTab={navigateToTab}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
          />
        );
      case "doctors":
        return (
          <Doctors
            setCurrentTab={navigateToTab}
            selectedSpecialtyId={selectedSpecialtyId}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
            selectedDoctorId={selectedDoctorId}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        );
      case "booking":
        return (
          <Booking
            selectedSpecialtyId={selectedSpecialtyId}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
            selectedDoctorId={selectedDoctorId}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        );
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "portal":
        return <PatientPortal />;
      case "admin":
        return <Admin setCurrentTab={navigateToTab} />;
      default:
        return (
          <Home
            setCurrentTab={navigateToTab}
            selectedDoctorId={selectedDoctorId}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header component */}
      <Header currentTab={currentTab} setCurrentTab={navigateToTab} />
      
      {/* Main page content area */}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {/* Footer component */}
      <Footer setCurrentTab={navigateToTab} />
    </div>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <MainApp />
    </HospitalProvider>
  );
}
