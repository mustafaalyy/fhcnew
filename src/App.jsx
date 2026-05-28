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
  if (hash === "admin") return "admin";
  if (hash === "portal") return "portal";
  return "home";
};


class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Admin page crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "6rem 1rem", backgroundColor: "var(--color-light)", minHeight: "60vh" }}>
          <div className="container">
            <div className="luxury-card" style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
              <h2 style={{ color: "var(--color-danger)", marginBottom: "1rem" }}>حدث خطأ في لوحة التحكم</h2>
              <p style={{ color: "var(--color-text-light)", marginBottom: "1rem" }}>
                افتح Console لمعرفة تفاصيل الخطأ، أو أعد تحميل الصفحة.
              </p>
              <pre style={{ direction: "ltr", textAlign: "left", whiteSpace: "pre-wrap", background: "#111827", color: "#fff", padding: "1rem", borderRadius: "12px" }}>
                {String(this.state.error?.message || this.state.error || "")}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


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
    const handleHashRoute = () => {
      const nextTab = getInitialTabFromUrl();
      if (nextTab === "admin" || nextTab === "portal") setCurrentTab(nextTab);
    };
    handleHashRoute();
    window.addEventListener("hashchange", handleHashRoute);
    return () => window.removeEventListener("hashchange", handleHashRoute);
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
        return <AdminErrorBoundary><Admin setCurrentTab={navigateToTab} /></AdminErrorBoundary>;
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
