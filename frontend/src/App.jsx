import { useState } from "react";
import { ResponsiveNavbar } from "../src/components/Navbar.jsx";
import { HeroSection } from "../src/components/Hero.jsx";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <ResponsiveNavbar />
        <HeroSection />
      </div>
    </>
  );
}

export default App;
