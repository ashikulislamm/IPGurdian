import React, { useState } from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";
import UserAvatar from "../assets/profile.png";

const menuItems = [
  {
    name: "User Information",
    icon: <UserIcon className="h-5 w-5" />,
    key: "user",
  },
  {
    name: "Settings",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    key: "settings",
  },
  {
    name: "Registered IPs",
    icon: <FolderIcon className="h-5 w-5" />,
    key: "ips",
  },
  {
    name: "IP Trading History",
    icon: <ArrowPathIcon className="h-5 w-5" />,
    key: "history",
  },
  {
    name: "Logout",
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
    key: "logout",
  },
];

export const UserDashboard = () => {
  const [activePanel, setActivePanel] = useState("user");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const avatar = UserAvatar;
  const username = "John Doe";

  const panels = {
    user: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl mx-auto bg-white p-8 rounded-2xl"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Avatar */}
          <img
            src={UserAvatar}
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-[#a9b5df] shadow-lg object-cover"
          />

          {/* Details */}
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-bold text-[#2d336b]">About Me</h2>
            <p className="text-[#ec4d4d] font-medium">
              IPGuardian Creator based in Bangladesh
            </p>
            <p className="text-gray-600 leading-relaxed">
              I build secure and decentralized solutions for protecting
              intellectual property. My mission is to empower creators through
              robust blockchain verification and seamless licensing processes.
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 gap-y-4 text-sm text-[#2d336b]">
              <div>
                <span className="font-semibold">Full Name:</span> John Doe
              </div>
              <div>
                <span className="font-semibold">Email:</span> john@example.com
              </div>
              <div>
                <span className="font-semibold">Phone:</span> +1234567890
              </div>
              <div>
                <span className="font-semibold">Country:</span> United States
              </div>
              <div>
                <span className="font-semibold">Date of Birth:</span> 4th April
                1998
              </div>
              <div>
                <span className="font-semibold">Address:</span> California, USA
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center bg-[#f3f4fa] p-6 rounded-xl shadow-md">
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">120</p>
            <p className="text-sm text-gray-600">IPs Registered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">45</p>
            <p className="text-sm text-gray-600">IPs Transferred</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">10</p>
            <p className="text-sm text-gray-600">Pending Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">98%</p>
            <p className="text-sm text-gray-600">Approval Rate</p>
          </div>
        </div>
      </motion.div>
    ),
    settings: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-[#2d336b]">
          Edit Profile Settings
        </h2>

        {/* Avatar Section */}
        <div className="flex items-center mb-6 gap-6">
          <img
            src={UserAvatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#a9b5df]"
          />
          <div>
            <label className="block mb-1 text-sm font-semibold text-[#2d336b]">
              Change Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-[#2d336b] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[#7886c7] hover:file:bg-[#2d336b]"
            />
          </div>
        </div>

        {/* Edit Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2d336b]">
          <div>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="country"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="United States"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div className="md:col-span-2">
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="address"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="California, USA"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="dob">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          {/* Bio Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="bio">
              Bio / Description
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us something about yourself..."
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#7886c7] text-white font-semibold py-3 rounded-lg hover:bg-[#2d336b] transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    ),
    ips: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">
          Registered IPs
        </h2>
        <ul className="space-y-3 text-[#2d336b]">
          <li className="p-4 border rounded-lg bg-white shadow">
            Trademark - Logo Design (ID# 00123)
          </li>
          <li className="p-4 border rounded-lg bg-white shadow">
            Patent - Mobile Charging Mechanism (ID# 00456)
          </li>
          <li className="p-4 border rounded-lg bg-white shadow">
            Copyright - Music Composition (ID# 00891)
          </li>
        </ul>
      </motion.div>
    ),
    history: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">
          IP Trading History
        </h2>
        <div className="space-y-4 text-[#2d336b]">
          <div className="bg-white p-4 rounded-lg shadow border">
            <p>
              <strong>Transferred:</strong> Design Patent
            </p>
            <p>
              <strong>To:</strong> Alice Johnson
            </p>
            <p>
              <strong>Date:</strong> 12 May 2025
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <p>
              <strong>Transferred:</strong> Software Copyright
            </p>
            <p>
              <strong>To:</strong> Creative Studios Ltd.
            </p>
            <p>
              <strong>Date:</strong> 28 April 2025
            </p>
          </div>
        </div>
      </motion.div>
    ),
    logout: (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#2d336b]">
          You have been logged out.
        </h2>
        <p className="text-center text-[#7886c7]">
          Redirecting to login page...
        </p>
      </motion.div>
    ),
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="mt-16"></div>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f9faff]">
        {/* Sidebar */}
        <div className="bg-[#2d336b] text-white lg:w-64 p-4 relative rounded-lg lg:rounded-r-none lg:rounded-tl-3xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <p className="text-sm font-medium">{username}</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white focus:outline-none hover:bg-[#7886c7] p-2 rounded-lg"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <ul
            className={`space-y-2 mt-6 ${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setActivePanel(item.key);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  activePanel === item.key
                    ? "bg-[#a9b5df] text-[#2d336b] font-semibold"
                    : "hover:bg-[#7886c7] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="sm:inline">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-tl-3xl">
          {panels[activePanel]}
        </main>
      </div>
      <ResponsiveFooter />
    </>
  );
};
