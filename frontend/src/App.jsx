import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResponsiveNavbar } from "../src/components/Navbar.jsx";
import { HeroSection } from "../src/components/Hero.jsx";
import {LoginForm } from "../src/pages/Login.jsx";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <ResponsiveNavbar />
        <HeroSection />
        <Router>
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
