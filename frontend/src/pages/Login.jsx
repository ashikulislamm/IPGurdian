import React from "react";
import LoginPicture from "../assets/Loginillustration.jpg";
import { ResponsiveNavbar } from "../components/Navbar.jsx";
import { ResponsiveFooter } from "../components/Footer.jsx";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 mt-10">
        <div
          className="max-w-6xl w-full text-white rounded-2xl shadow-lg overflow-hidden md:flex"
          style={{
            fontFamily: "var(--Primary-font)",
          }}
        >
          {/* Form section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 bg-[#f9faff]">
            <h2
              className="text-2xl font-semibold"
              style={{
                color: "black",
                fontFamily: "var(--Primary-font)",
              }}
            >
              IPGuridan
            </h2>
            <h1
              className="text-3xl font-bold mt-4"
              style={{
                color: "var(--Secondary-color)",
                fontFamily: "var(--Primary-font)",
              }}
            >
              Welcome back
            </h1>
            <p className="text-black mt-1 mb-6 text-sm ">
              Start your website in seconds. Don’t have an account?{" "}
              <Link
                to="/register"
                className="hover:underline font-bold"
                style={{ color: "var(--Secondary-color)" }}
              >
                Sign up.
              </Link>
            </p>

            <form className="space-y-4">
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
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 borde rounded-lg outline-none inputForm"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a
                  href="#"
                  className="hover:underline"
                  style={{ color: "var(--Secondary-color)" }}
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full transition-all py-2 rounded-lg font-bold bg-[#7886c7] hover:bg-[#2d336b]"
              >
                Sign in to your account
              </button>
            </form>

            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-600" />
              <span className="mx-4 text-gray-400">or</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-[#334155] text-sm py-2 rounded-lg hover:bg-gray-600">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-[#334155] text-sm py-2 rounded-lg hover:bg-gray-600">
                <img
                  src="https://www.svgrepo.com/show/508761/apple.svg"
                  alt="Apple"
                  className="w-5 h-5"
                />
                Sign in with Apple
              </button>
            </div>
          </div>

          {/* Illustration section */}
          <div
            className="hidden md:flex md:w-1/2 items-center justify-center p-4"
            style={{}}
          >
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
