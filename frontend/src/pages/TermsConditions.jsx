import React, { useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import {
  ShieldCheckIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const termsSections = [
  {
    id: 1,
    title: "Use of the Platform",
    icon: UserGroupIcon,
    content: [
      "You must be at least 18 years old and legally able to enter into a binding agreement to use our services.",
      "You agree to provide accurate and complete information when registering your intellectual property.",
      "You must not use the platform for any unlawful purposes or in violation of any applicable laws.",
      "Misuse of the platform, including but not limited to uploading false information or attempting to circumvent security measures, is strictly prohibited.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
    highlight: "Age Requirement: 18+",
  },
  {
    id: 2,
    title: "Intellectual Property Rights",
    icon: ShieldCheckIcon,
    content: [
      "All registered intellectual properties remain the sole property of their respective owners.",
      "IPGuardian does not claim any rights over your submissions or intellectual property.",
      "By using our platform, you retain full ownership and control over your registered IP.",
      "We provide blockchain-based verification services but do not substitute for legal registration.",
      "Users are responsible for ensuring their IP submissions do not infringe on existing rights.",
    ],
    highlight: "Full Ownership Retained",
  },
  {
    id: 3,
    title: "Limitations of Liability",
    icon: ExclamationTriangleIcon,
    content: [
      "IPGuardian is not liable for any loss or damage resulting from system outages or technical failures.",
      "We are not responsible for incorrect submissions or user errors in the registration process.",
      "The platform is not liable for unauthorized access to user accounts due to weak passwords or sharing credentials.",
      "Our services are provided 'as is' without warranties of any kind, express or implied.",
      "Maximum liability is limited to the fees paid for services in the 12 months preceding the claim.",
    ],
    highlight: "Limited Liability Protection",
  },
  {
    id: 4,
    title: "Privacy & Data Protection",
    icon: ScaleIcon,
    content: [
      "We collect and process personal data in accordance with our Privacy Policy and applicable laws.",
      "Your IP registration data is stored securely on blockchain networks for immutable verification.",
      "We do not share personal information with third parties without your explicit consent.",
      "You have the right to access, modify, or delete your personal data subject to legal requirements.",
      "Data retention periods comply with legal obligations and business requirements.",
    ],
    highlight: "GDPR Compliant",
  },
  {
    id: 5,
    title: "Platform Fees & Payments",
    icon: DocumentTextIcon,
    content: [
      "Registration fees are clearly displayed before transaction completion and are non-refundable.",
      "Blockchain transaction fees (gas fees) are separate from our service fees and may vary.",
      "We reserve the right to modify our fee structure with 30 days advance notice.",
      "Payment processing is handled by secure third-party providers and we do not store payment information.",
      "Failed transactions due to insufficient funds or technical issues may require resubmission with new fees.",
    ],
    highlight: "Transparent Pricing",
  },
  {
    id: 6,
    title: "Changes to Terms",
    icon: PencilSquareIcon,
    content: [
      "We reserve the right to modify these terms at any time to reflect changes in our services or legal requirements.",
      "All updates will be posted on this page and users will be notified via email when significant changes occur.",
      "Continued use of the platform after changes constitutes acceptance of the new terms.",
      "Major changes will include a 30-day notice period before taking effect.",
      "You may terminate your account if you disagree with any changes to these terms.",
    ],
    highlight: "30-Day Notice Period",
  },
];

export const TermsAndConditions = () => {
  const [expandedSections, setExpandedSections] = useState(new Set([1]));
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    setExpandedSections(new Set(termsSections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <>
      <ResponsiveNavbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-[#2d336b] via-[#4a5394] to-[#7886c7] text-white py-24 overflow-hidden mt-14 rounded-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <DocumentTextIcon className="h-16 w-16 text-white/90" />
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            Welcome to IPGuardian. By accessing or using our platform, you agree
            to be bound by the following terms and conditions. Please read them
            carefully.
          </motion.p>

          {/* Last Updated */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-4 text-blue-200"
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Last Updated: October 7, 2025</span>
            <ClockIcon className="h-5 w-5 ml-4" />
            <span>Effective Immediately</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Controls */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-12 p-6 bg-white rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 font-medium">
                Quick Navigation
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-[#2d336b] text-white rounded-lg hover:bg-[#1e2347] transition-colors duration-200 text-sm font-medium"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
              >
                Collapse All
              </button>
            </div>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {termsSections.map((section, index) => {
              const isExpanded = expandedSections.has(section.id);
              const IconComponent = section.icon;

              return (
                <motion.div
                  key={section.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-0 border-0 outline-0"
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2d336b] to-[#7886c7] rounded-xl flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#2d336b] mb-1">
                            {section.id}. {section.title}
                          </h2>
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {section.highlight}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUpIcon className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="pl-16">
                        <ul className="space-y-4">
                          {section.content.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: itemIndex * 0.1,
                              }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 leading-relaxed">
                                {item}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Acceptance Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 p-8 bg-gradient-to-br from-[#2d336b] to-[#7886c7] rounded-2xl text-white"
          >
            <div className="text-center">
              <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-white/90" />
              <h3 className="text-2xl font-bold mb-4">
                Agreement & Acceptance
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                By using IPGuardian, you acknowledge that you have read,
                understood, and agree to be bound by these terms and conditions.
                If you do not agree with any part of these terms, please do not
                use our services.
              </p>

              <div className="flex items-center justify-center gap-4 mb-6">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-white/50 bg-transparent focus:ring-2 focus:ring-white/50"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-white font-medium cursor-pointer"
                >
                  I have read and agree to the Terms & Conditions
                </label>
              </div>

              <motion.button
                whileHover={{ scale: acceptedTerms ? 1.05 : 1 }}
                whileTap={{ scale: acceptedTerms ? 0.95 : 1 }}
                disabled={!acceptedTerms}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  acceptedTerms
                    ? "bg-white text-[#2d336b] hover:bg-blue-50 shadow-lg"
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                {acceptedTerms
                  ? "Continue to Platform"
                  : "Please Accept Terms to Continue"}
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 text-center"
          >
            <h4 className="text-lg font-semibold text-[#2d336b] mb-2">
              Questions about our Terms?
            </h4>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms & Conditions, please
              don't hesitate to contact us.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="text-gray-500">📧 legal@ipguardian.com</span>
              <span className="text-gray-500">📞 +1 (555) 123-4567</span>
              <span className="text-gray-500">
                🌐 www.ipguardian.com/support
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <ResponsiveFooter />
    </>
  );
};
