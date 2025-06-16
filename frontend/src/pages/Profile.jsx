import React, { useState } from "react";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

export const UserDashboard = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    country: "United States",
    address: "1234 Innovation Blvd, NY",
    dateOfBirth: "1995-06-15",
    registeredIPs: 5,
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // Save logic here (API call)
    setEditMode(false);
  };

  return (
    <>
      <ResponsiveNavbar />
      <section className="bg-[#f9faff] px-6 py-12 lg:px-24 text-[#2d336b] font-sans mt-18 mb-16 rounded-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#2d336b]">Welcome to Your Dashboard</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-[#a9b5df] rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 text-[#2d336b]">Profile Information</h2>
              <div className="space-y-5">
                {Object.entries(user).map(([key, value]) => {
                  if (key === "registeredIPs") return null;

                  const isDateField = key === "dateOfBirth";
                  const inputType = isDateField && editMode ? "date" : "text";

                  return (
                    <div key={key}>
                      <label className="block mb-1 text-sm font-medium capitalize text-[#2d336b]">
                        {key.replace(/([A-Z])/g, " $1").replace("dateOfBirth", "Date of Birth")}
                      </label>
                      <input
                        type={inputType}
                        name={key}
                        value={value}
                        disabled={!editMode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border outline-none transition duration-200 ${
                          editMode ? "border-[#7886c7] bg-white" : "border-gray-300 bg-gray-100"
                        }`}
                      />
                    </div>
                  );
                })}

                <div className="flex space-x-4 pt-4">
                  {editMode ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#7886c7] text-white font-semibold rounded-lg hover:bg-[#2d336b]"
                      >
                        Save
                      </button>
                      <button
                        onClick={toggleEdit}
                        className="px-4 py-2 bg-gray-300 font-semibold rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={toggleEdit}
                      className="px-4 py-2 bg-[#a9b5df] text-[#2d336b] font-semibold rounded-lg hover:bg-[#7886c7] hover:text-white"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#a9b5df] rounded-2xl p-8 shadow-lg flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-[#2d336b]">Your Registered IPs</h2>
                <p className="text-lg text-[#2d336b] mb-6">
                  You have <strong className="text-[#2d336b]">{user.registeredIPs}</strong> registered intellectual properties.
                </p>
              </div>
              <button className="mt-auto px-5 py-3 bg-[#2d336b] text-white font-semibold rounded-lg hover:bg-[#1f264b] transition">
                Manage IP Assets
              </button>
            </div>
          </div>
        </div>
      </section>
      <ResponsiveFooter />
    </>
  );
};
