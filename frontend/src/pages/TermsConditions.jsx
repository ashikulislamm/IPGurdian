import React from "react";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";

const termsSections = [
  {
    title: "1. Use of the Platform",
    content:
      "You must be at least 18 years old and legally able to enter into a binding agreement to use our services. You agree not to misuse the platform in any way.",
  },
  {
    title: "2. Intellectual Property Rights",
    content:
      "All registered intellectual properties remain the sole property of their respective owners. IPGuardian does not claim any rights over your submissions.",
  },
  {
    title: "3. Limitations of Liability",
    content:
      "IPGuardian is not liable for any loss or damage resulting from system outages, incorrect submissions, or unauthorized access.",
  },
  {
    title: "4. Changes to Terms",
    content:
      "We reserve the right to modify these terms at any time. Updates will be posted here and take immediate effect.",
  },
];

export const TermsAndConditions = () => {
  return (
    <>
      <ResponsiveNavbar />
      <section className="bg-white text-[#2d336b] px-6 py-12 lg:px-24 text-left mt-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="mb-6 text-[#000000]">
            Welcome to IPGuardian. By accessing or using our platform, you agree
            to be bound by the following terms and conditions.
          </p>
          {termsSections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-[#000000]">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
      <ResponsiveFooter />
    </>
  );
};
