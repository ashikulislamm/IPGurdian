import React, { useState, useContext } from "react";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { motion } from "framer-motion";
import { LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [popup, setPopup] = useState({ show: false, message: "", success: true });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        setPopup({ show: true, message: "Login successful!", success: true });
        setTimeout(() => {
          setPopup({ show: false, message: "", success: true });
          navigate("/dashboard");
        }, 1200);
      } else {
        setPopup({
          show: true,
          message: result.error || "Login failed",
          success: false,
        });
        setTimeout(() => setPopup({ show: false, message: "", success: true }), 4000);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.message || "Login failed",
        success: false,
      });
      setTimeout(() => setPopup({ show: false, message: "", success: true }), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl w-full rounded-3xl shadow-xl ring-1 ring-gray-200 overflow-hidden grid md:grid-cols-2 bg-white"
          style={{ fontFamily: "var(--Primary-font)" }}
        >
          {/* Form Side */}
          <div className="relative p-10 md:p-14 flex flex-col justify-center">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage:"radial-gradient(circle at 30% 20%, #2d336b 0, transparent 60%)"}} />
            <div className="relative z-10">
              <h2 className="text-sm font-semibold tracking-wide text-[#2d336b]/80 uppercase">IPGurdian</h2>
              <h1 className="text-4xl font-bold mt-3 bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-transparent bg-clip-text">Welcome Back</h1>
              <p className="text-gray-600 mt-3 mb-8 text-sm flex flex-wrap gap-1">
                Don’t have an account?
                <Link to="/register" className="font-semibold text-[#2d336b] hover:text-[#1e2347] transition-colors">Sign up</Link>
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent bg-gray-50/50 text-gray-800 placeholder-gray-400"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent bg-gray-50/50 text-gray-800 placeholder-gray-400"
                    placeholder="••••••••"
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-5 w-5" />
                      <span>Sign in to your account</span>
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Illustration Side */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d336b] via-[#4a5394] to-[#7886c7]" />
            <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{backgroundImage:'linear-gradient(135deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,0) 60%)'}} />
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
