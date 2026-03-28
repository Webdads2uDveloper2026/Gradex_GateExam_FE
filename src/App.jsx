import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import OTPVerify from "./pages/OTPVerify";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import AdminQuestions from "./pages/AdminQuestions";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

function App() {

  const [studentPhone, setStudentPhone] = useState(
    localStorage.getItem("studentPhone") || "",
  );
  const [isVerified, setIsVerified] = useState(
    localStorage.getItem("isVerified") === "true",
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("studentLanguage") || "English",
  );

  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken"),
  );

  const completeLogin = (phone, lang) => {
    localStorage.setItem("studentPhone", phone);
    localStorage.setItem("studentLanguage", lang);
    setStudentPhone(phone);
    setLanguage(lang);
  };

  const setVerified = () => {
    localStorage.setItem("isVerified", "true");
    setIsVerified(true);
  };

  const onAdminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  };

  const onAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  };

  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <Router>
      <div className="app-container min-h-screen">
        {!isAdminRoute && <Header />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/register"
            element={<Register onNext={completeLogin} />}
          />
          <Route
            path="/otp"
            element={
              studentPhone ? (
                <OTPVerify phone={studentPhone} onVerified={setVerified} />
              ) : (
                <Navigate to="/register" />
              )
            }
          />
          <Route
            path="/assessment"
            element={
              isVerified ? (
                <Assessment phone={studentPhone} language={language} />
              ) : (
                <Navigate to="/otp" />
              )
            }
          />
          <Route path="/results" element={<Results />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={onAdminLogin} />}
          />
          {/* <Route
            path="/login"
            element={<AdminLogin onLogin={onAdminLogin} />}
          /> */}
          <Route
            path="/admin"
            element={
              adminToken ? (
                <Admin onLogout={onAdminLogout} />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/questions"
            element={
              adminToken ? (
                <AdminQuestions onLogout={onAdminLogout} />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
