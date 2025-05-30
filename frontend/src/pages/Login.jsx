import React from 'react';
import LoginPicture from '../assets/Loginillustration.svg' // replace with your actual image path

export const LoginForm = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full bg-[#1E293B] text-white rounded-2xl shadow-lg overflow-hidden md:flex">
        {/* Form section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-blue-400">Flowbite</h2>
          <h1 className="text-3xl font-bold mt-4">Welcome back</h1>
          <p className="text-gray-400 mt-1 mb-6 text-sm">
            Start your website in seconds. Don’t have an account?{' '}
            <a href="#" className="text-blue-400 hover:underline">
              Sign up.
            </a>
          </p>

          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-[#334155] border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-[#334155] border border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 transition-all py-2 rounded-lg font-medium"
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
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-[#334155] text-sm py-2 rounded-lg hover:bg-gray-600">
              <img src="https://www.svgrepo.com/show/349378/apple.svg" alt="Apple" className="w-5 h-5" />
              Sign in with Apple
            </button>
          </div>
        </div>

        {/* Illustration section */}
        <div className="hidden md:flex md:w-1/2 bg-[#0F172A] items-center justify-center p-4">
          <img src={LoginPicture} alt="Illustration" className="max-w-[80%] h-auto" />
        </div>
      </div>
    </div>
  );
};
