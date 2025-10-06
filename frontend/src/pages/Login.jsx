import React, { useState, useContext } from "react";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";

export const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [popup, setPopup] = useState({ show: false, message: "", success: true });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(form.email, form.password);
    
    if (result.success) {
      setPopup({ show: true, message: "Login successful!", success: true });
      setTimeout(() => {
        setPopup({ show: false, message: "", success: true });
        navigate("/profile");
      }, 2000);
    } else {
      setPopup({
        show: true,
        message: result.error,
        success: false,
      });
      setTimeout(() => setPopup({ show: false, message: "", success: true }), 4000);
    }
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 mt-10">
        <div
          className="max-w-6xl w-full text-white rounded-2xl shadow-lg overflow-hidden md:flex"
          style={{ fontFamily: "var(--Primary-font)" }}
        >
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#f9faff]">
            <h2 className="text-2xl font-semibold text-black">IPGurdian</h2>
            <h1 className="text-3xl font-bold mt-4 text-[#2d336b]">
              Welcome back
            </h1>
            <p className="text-black mt-1 mb-6 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="hover:underline font-bold text-[#2d336b]"
              >
                Sign up.
              </Link>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full transition-all py-2 rounded-lg font-bold bg-[#7886c7] hover:bg-[#2d336b] text-white"
              >
                Sign in to your account
              </button>
            </form>
          </div>

          <div className="hidden md:flex md:w-1/2 items-center justify-center p-4">
            <img
              src={LoginPicture}
              alt="Illustration"
              className="max-w-[80%] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup.show && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            popup.success ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {popup.message}
        </div>
      )}

      <ResponsiveFooter />
    </>
  );
};
