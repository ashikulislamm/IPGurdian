import React, { useState } from "react";
import axios from "axios";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link } from "react-router-dom";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      setPopup({
        show: true,
        message: "Registered successfully!",
        success: true,
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        country: "",
        address: "",
        dob: "",
        password: "",
      });
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.msg || "Something went wrong",
        success: false,
      });
    }

    setTimeout(
      () => setPopup({ show: false, message: "", success: true }),
      4000
    );
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 mt-10">
        <div
          className="max-w-6xl w-full text-white rounded-2xl shadow-lg overflow-hidden md:flex"
          style={{ fontFamily: "var(--Primary-font)" }}
        >
          {/* Form section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#f9faff]">
            <h2 className="text-2xl font-semibold text-black">IPGurdian</h2>
            <h1 className="text-3xl font-bold mt-4 text-[#2d336b]">
              Create your account
            </h1>
            <p className="text-black mt-1 mb-6 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:underline font-bold text-[#2d336b]"
              >
                Sign In.
              </Link>
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {["name", "email", "phone", "country", "address"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-sm text-black text-left capitalize">
                    {field.replace("dob", "Date of Birth")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                    placeholder={field === "email" ? "name@company.com" : field}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
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
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full transition-all py-2 rounded-lg font-bold bg-[#7886c7] hover:bg-[#2d336b] text-white"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Illustration section */}
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
