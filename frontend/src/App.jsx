import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../src/pages/Home.jsx";
import { LoginForm } from "../src/pages/Login.jsx";
import { Contact } from "../src/pages/Contact.jsx";
import { RegisterForm } from "../src/pages/Register.jsx";
import { TermsAndConditions } from "./pages/TermsConditions.jsx";
import { UserDashboard } from "./pages/Profile.jsx";
import { IPDetails } from "./pages/IPDetails.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { Web3Provider } from "./Context/Web3Context-private.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <AuthProvider>
        <Web3Provider>
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
              <Route path="/profile" element={<UserDashboard />} />
              <Route path="/ip-details/:id" element={<IPDetails />} />
            </Routes>
          </Router>
        </Web3Provider>
      </AuthProvider>
    </div>
  );
}

export default App;
