import React, { useState } from "react";
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

function MainApp() {
  const [currentTab, setCurrentTab] = useState("home");
  
  // Shared state for deep linking/pre-filling booking
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  const renderPage = () => {
    switch (currentTab) {
      case "home":
        return (
          <Home
            setCurrentTab={setCurrentTab}
            selectedDoctorId={selectedDoctorId}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        );
      case "services":
        return (
          <Services
            setCurrentTab={setCurrentTab}
            setSelectedSpecialtyId={setSelectedSpecialtyId}
          />
        );
      case "doctors":
        return (
          <Doctors
            setCurrentTab={setCurrentTab}
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
        return <Admin setCurrentTab={setCurrentTab} />;
      default:
        return (
          <Home
            setCurrentTab={setCurrentTab}
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
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {/* Main page content area */}
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>

      {/* Footer component */}
      <Footer setCurrentTab={setCurrentTab} />
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
