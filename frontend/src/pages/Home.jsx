import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { HeroSection } from "../components/Hero.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { AboutSection } from "../components/AboutSection.jsx";
import { HowItWorks } from "../components/HowitWorks.jsx";
import { PartnersSection } from "../components/Partners.jsx";
import { LiveStats } from "../components/LiveStats.jsx";

export function Home() {
  return (
    <>
      <ResponsiveNavbar />
      <HeroSection />
      <AboutSection />
      <HowItWorks />
      <PartnersSection />
      <LiveStats />
      <ResponsiveFooter />
    </>
  );
}
