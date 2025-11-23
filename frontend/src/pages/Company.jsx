import React from "react";
import { motion } from "framer-motion";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";
import {
  ShieldCheckIcon,
  CubeTransparentIcon,
  ClockIcon,
  GlobeAltIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  UsersIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Company = () => {
  // Mission data array
  const missionData = [
    {
      icon: ShieldCheckIcon,
      title: "Protection",
      description:
        "Secure your intellectual property with immutable blockchain technology that provides cryptographic proof of creation and ownership.",
    },
    {
      icon: CubeTransparentIcon,
      title: "Transparency",
      description:
        "Every registration is recorded on the blockchain, creating a transparent and verifiable history that cannot be altered or disputed.",
    },
    {
      icon: GlobeAltIcon,
      title: "Accessibility",
      description:
        "Global access to IP protection without the complexity and high costs of traditional legal processes, making it available to creators everywhere.",
    },
  ];

  // How it works steps data
  const howItWorksSteps = [
    {
      step: 1,
      title: "Upload & Register",
      description:
        "Upload your creative work, provide essential details, and submit for blockchain registration.",
      hasArrow: true,
    },
    {
      step: 2,
      title: "Blockchain Verification",
      description:
        "Our system creates a cryptographic hash and timestamp, recording it immutably on the blockchain.",
      hasArrow: true,
    },
    {
      step: 3,
      title: "Generate Certificate",
      description:
        "Receive a blockchain-backed certificate of authenticity with verifiable proof of creation.",
      hasArrow: true,
    },
    {
      step: 4,
      title: "Protect & Trade",
      description:
        "Your IP is now protected! Optionally list it on our marketplace for licensing or sale.",
      hasArrow: false,
    },
  ];

  // Features data array
  const featuresData = [
    {
      icon: ClockIcon,
      title: "Instant Protection",
      description:
        "Get your IP protected in minutes, not months. Our blockchain technology provides immediate, verifiable proof of creation and ownership.",
    },
    {
      icon: LockClosedIcon,
      title: "Unbreakable Security",
      description:
        "Military-grade encryption and blockchain immutability ensure your IP records can never be altered, deleted, or disputed.",
    },
    {
      icon: ChartBarIcon,
      title: "Cost Effective",
      description:
        "Save thousands compared to traditional IP protection methods. Our platform makes professional IP protection affordable for everyone.",
    },
    {
      icon: DocumentCheckIcon,
      title: "Legal Recognition",
      description:
        "Our blockchain certificates are recognized by courts and legal systems worldwide as valid proof of IP ownership and creation dates.",
    },
    {
      icon: UsersIcon,
      title: "Global Community",
      description:
        "Join thousands of creators, inventors, and businesses who trust IPGuardian to protect their most valuable intellectual assets.",
    },
    {
      icon: GlobeAltIcon,
      title: "Marketplace Integration",
      description:
        "Not just protection - monetize your IP through our integrated marketplace. License, sell, or collaborate with confidence.",
    },
  ];

  // Statistics data array
  const statisticsData = [
    { value: "10K+", label: "IPs Protected" },
    { value: "5K+", label: "Active Users" },
    { value: "50+", label: "Countries" },
    { value: "99.9%", label: "Uptime" },
  ];

  // IP Types data array (already exists but optimized)
  const ipTypesData = [
    {
      icon: "©",
      title: "Copyrights",
      desc: "Books, music, art, software, and creative works",
    },
    {
      icon: "™",
      title: "Trademarks",
      desc: "Brand names, logos, slogans, and business identity",
    },
    {
      icon: "⚖️",
      title: "Patents",
      desc: "Inventions, processes, and technical innovations",
    },
    {
      icon: "🎨",
      title: "Designs",
      desc: "Industrial designs, patterns, and visual creations",
    },
    {
      icon: "🔐",
      title: "Trade Secrets",
      desc: "Confidential business information and processes",
    },
    {
      icon: "📄",
      title: "Digital Assets",
      desc: "NFTs, digital art, and blockchain-native content",
    },
  ];

  return (
    <>
      <ResponsiveNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2d336b] via-[#7886c7] to-[#a9b5df] flex items-center mt-18 rounded-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              IP<span className="text-[#a9b5df]">Guardian</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing Intellectual Property Protection Through
              Blockchain Technology
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto opacity-90">
              The world's first comprehensive platform that combines
              cutting-edge blockchain security with user-friendly IP management,
              ensuring your creative works and innovations are protected with
              immutable, timestamped proof of ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-[#2d336b] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#2d336b] transition-all duration-300"
              >
                Explore Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d336b] mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              To democratize intellectual property protection by making it
              accessible, affordable, and secure for creators worldwide. We
              believe every innovation, artistic work, and creative idea
              deserves protection, regardless of the creator's resources or
              location.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 bg-[#7886c7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2d336b] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#f9faff] rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d336b] mb-6">
              How IPGuardian Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our streamlined process makes IP protection simple, fast, and
              secure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorksSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
                className={`text-center ${item.hasArrow ? "relative" : ""}`}
              >
                <div className="w-20 h-20 bg-[#2d336b] text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#2d336b] mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                {item.hasArrow && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#a9b5df]"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose IPGuardian */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d336b] mb-6">
              Why Choose IPGuardian?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're revolutionizing IP protection with cutting-edge technology
              and user-centric design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#f9faff] p-8 rounded-2xl border border-[#a9b5df]/20 text-center"
                >
                  <IconComponent className="h-12 w-12 text-[#7886c7] mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-[#2d336b] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-[#2d336b] to-[#7886c7] rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the growing community of creators who have secured their
              intellectual property with IPGuardian
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statisticsData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {item.value}
                </div>
                <div className="text-white/90">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IP Types Supported */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d336b] mb-6">
              All Types of IP Supported
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Whether you're an artist, inventor, writer, or entrepreneur, we
              protect all forms of intellectual property
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ipTypesData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#f9faff] p-6 rounded-2xl border border-[#a9b5df]/20 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#2d336b] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#7886c7] to-[#a9b5df] mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Protect Your IP?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of creators who have secured their intellectual
              property with blockchain technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-[#2d336b] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Start Protecting Now
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#2d336b] transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <ResponsiveFooter />
    </>
  );
};

export default Company;
