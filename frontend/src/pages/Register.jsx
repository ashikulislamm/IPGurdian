import React, { useState } from "react";
import axios from "axios";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlusIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    dob: "",
    password: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setPopup({ show: true, message: "Registered successfully!", success: true });
      setForm({ name: "", email: "", phone: "", country: "", address: "", dob: "", password: "" });
    } catch (err) {
      setPopup({ show: true, message: err.response?.data?.msg || "Something went wrong", success: false });
    } finally {
      setTimeout(() => setPopup({ show: false, message: "", success: true }), 4000);
      setLoading(false);
    }
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 mt-16]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl w-full rounded-3xl shadow-xl ring-1 ring-gray-200 overflow-hidden grid md:grid-cols-2 bg-white"
          style={{ fontFamily: "var(--Primary-font)" }}
        >
          {/* Form section */}
          <div className="relative p-10 md:p-14 flex flex-col justify-center">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 60% 40%, #2d336b 0, transparent 65%)"}} />
            <div className="relative z-10">
              <h2 className="text-sm font-semibold tracking-wide text-[#2d336b]/80 uppercase">IPGurdian</h2>
              <h1 className="text-4xl font-bold mt-3 bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-transparent bg-clip-text">Create Your Account</h1>
              <p className="text-gray-600 mt-3 mb-8 text-sm flex flex-wrap gap-1 text-center">
                Already have an account?
                <Link to="/login" className="font-semibold text-[#2d336b] hover:text-[#1e2347] transition-colors">Sign In</Link>
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {["name", "email", "phone", "country", "address"].map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent bg-gray-50/50 text-gray-800 placeholder-gray-400"
                      placeholder={field === 'email' ? 'name@company.com' : field}
                      required
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent bg-gray-50/50 text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent bg-gray-50/50 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#7886c7]/30 ${loading ? 'bg-[#7886c7]/70 cursor-wait' : 'bg-gradient-to-r from-[#2d336b] to-[#7886c7] hover:from-[#242a58] hover:to-[#5d6bb0] text-white'}`}
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-5 w-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-5 w-5" />
                      <span>Create Account</span>
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          {/* Illustration section */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d336b] via-[#4a5394] to-[#7886c7]" />
            <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{backgroundImage:'linear-gradient(135deg, rgba(255,255,255,.25) 0%, rgba(255,255,255,0) 70%)'}} />
            <div className="relative h-full flex items-center justify-center p-10">
              <img src={LoginPicture} alt="Illustration" className="w-[78%] rounded-2xl shadow-2xl ring-1 ring-white/20" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup */}
      {popup.show && (
        <div
          className={`fixed top-6 right-6 px-5 py-4 rounded-xl shadow-lg z-50 transition-all duration-300 flex items-center gap-3 ${popup.success ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}
        >
          <span className="text-sm font-medium">{popup.message}</span>
        </div>
      )}

      <ResponsiveFooter />
    </>
  );
};
