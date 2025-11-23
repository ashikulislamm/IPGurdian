import React from "react";
import { motion } from "framer-motion";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline";

export const PrivacyPolicy = () => {
  return (
    <>
      <ResponsiveNavbar />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-[#2d336b] via-[#4a5394] to-[#7886c7] text-white py-24 overflow-hidden mt-14 rounded-lg"
      >
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <ShieldCheckIcon className="h-12 w-12 text-white/90" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Your privacy matters to us. This policy explains what we collect,
            how we use it, and the choices you have.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-3 text-blue-200 text-xs sm:text-sm"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Last Updated: November 18, 2025</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-8">
          {/* What we collect */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <EyeIcon className="h-6 w-6 text-[#2d336b]" />
              <h2 className="text-xl font-semibold text-[#2d336b]">Information We Collect</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 style-none">
              <li>Account details: name, email, and password (hashed).</li>
              <li>Wallet information: linked wallet address and link status timestamps.</li>
              <li>IP registration data and NFT metadata you submit.</li>
              <li>Usage data: basic analytics (pages visited, actions) to improve UX.</li>
            </ul>
          </div>

          {/* How we use it */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <LockClosedIcon className="h-6 w-6 text-[#2d336b]" />
              <h2 className="text-xl font-semibold text-[#2d336b]">How We Use Your Data</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To create and manage your account and sessions.</li>
              <li>To link your wallet for ownership and on-chain actions.</li>
              <li>To provide IP registration, minting, and marketplace services.</li>
              <li>To protect the platform against fraud and abuse.</li>
            </ul>
          </div>

          {/* Sharing and retention */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#2d336b] mb-3">Sharing & Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell your personal data. We may share data with trusted
              service providers strictly to operate the platform (e.g., email
              delivery, analytics) under confidentiality obligations. Blockchain
              records are public by design; only the data you choose to commit
              on-chain (like ownership proofs or NFT mints) will be publicly visible.
              We retain data only as long as necessary for legal and operational needs.
            </p>
          </div>

          {/* Your rights */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#2d336b] mb-3">Your Choices & Rights</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access, update, or delete your profile information.</li>
              <li>Link or unlink your wallet at any time.</li>
              <li>Request export or deletion of your personal data, subject to law.</li>
              <li>Control what you publish on-chain before minting or registering.</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#2d336b] mb-3">Contact Us</h2>
            <p className="text-gray-700">If you have privacy questions:</p>
            <div className="mt-2 text-gray-600 text-sm space-y-1">
              <p>📧 privacy@ipguardian.com</p>
              <p>🌐 www.ipguardian.com/privacy</p>
            </div>
          </div>
        </div>
      </section>

      <ResponsiveFooter />
    </>
  );
};
