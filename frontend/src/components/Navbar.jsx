"use client";
import Logo from "../assets/FavIcon.png";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext.jsx";
import { useContext } from "react";
const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Company", href: "/company" },
  { name: "Contact", href: "/contact" },
];

export const ResponsiveNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.split(" ")[0];
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 mb-5">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="IPGurdian Logo"
              src={Logo}
              className="h-4 w-auto SiteLogo"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm/6 font-semibold hover:text-[#7886c7] transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="dropdown-menu-item flex items-center gap-3 text-sm font-medium text-gray-900 hover:text-[#7886c7] transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#7886c7]/20 font-sans"
              >
                <div className="w-8 h-8 bg-[#7886c7] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getFirstName(user.name).charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {getFirstName(user.name)}
                </span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  } flex-shrink-0`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#f9faff] hover:text-[#2d336b] transition-all duration-200 font-sans"
                    >
                      <UserIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="dropdown-menu-item flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full text-left font-sans"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm/6 font-semibold signUp">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">IPGurdian</span>
              <img alt="IPGurdian Logo" src={Logo} className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="px-3 py-3 bg-[#f9faff] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7886c7] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {getFirstName(user.name).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 -mx-3 rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 font-sans"
                      >
                        <UserIcon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base font-medium">
                          My Profile
                        </span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="dropdown-menu-item flex items-center gap-3 -mx-3 rounded-lg px-3 py-3 text-base font-medium text-gray-900 hover:bg-red-50 hover:text-red-600 w-full text-left font-sans"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-base font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
