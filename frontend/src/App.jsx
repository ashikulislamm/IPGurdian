import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../src/pages/Home.jsx";
import { LoginForm } from "../src/pages/Login.jsx";
import { Contact } from "../src/pages/Contact.jsx";
import { RegisterForm } from "../src/pages/Register.jsx";
import { TermsAndConditions } from "./pages/TermsConditions.jsx";
import { UserDashboard } from "./pages/Profile.jsx";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
