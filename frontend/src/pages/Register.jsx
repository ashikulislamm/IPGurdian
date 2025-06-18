import React from "react";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
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
            <h1
              className="text-3xl font-bold mt-4"
              style={{ color: "var(--Secondary-color)" }}
            >
              Create your account
            </h1>
            <p className="text-black mt-1 mb-6 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:underline font-bold"
                style={{ color: "var(--Secondary-color)" }}
              >
                Sign In.
              </Link>
            </p>

            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="name@company.com"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                  placeholder="Street, City, ZIP"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm text-black text-left">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg outline-none inputForm"
                />
              </div>

              <button
                type="submit"
                className="w-full transition-all py-2 rounded-lg font-bold bg-[#7886c7] hover:bg-[#2d336b]"
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
      <ResponsiveFooter />
    </>
  );
};
