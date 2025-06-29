import React from "react";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

export const IPDetails = () => {
  const ipInfo = {
    title: "Trademark - Logo Design",
    id: "IP-00123",
    type: "Trademark",
    status: "Active",
    registeredDate: "2024-08-01",
    description:
      "This trademark protects the logo design of the brand and ensures exclusive usage rights.",
  };

  const ownerInfo = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    country: "United States",
  };

  const transactionHistory = [
    {
      to: "Alice Johnson",
      date: "2025-01-12",
      details: "Transferred ownership rights",
    },
    {
      to: "Creative Studios Ltd.",
      date: "2025-04-28",
      details: "Leased for commercial usage",
    },
  ];

  return (
    <>
    <ResponsiveNavbar />
    <div className="bg-[#f9faff] min-h-screen font-sans mt-18 mb-10">
      {/* Hero Section */}
      <div className="bg-[#2d336b] text-white py-10 px-6 text-center shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{ipInfo.title}</h1>
        <p className="text-[#a9b5df] font-medium text-sm md:text-base">
          {ipInfo.id} • Type: {ipInfo.type}
        </p>
      </div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IP Info */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-[#a9b5df] hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-[#2d336b] mb-4">IP Details</h2>
          <ul className="space-y-3 text-[#2d336b] text-sm md:text-base">
            <li>
              <strong>ID:</strong> {ipInfo.id}
            </li>
            <li>
              <strong>Type:</strong> {ipInfo.type}
            </li>
            <li>
              <strong>Status:</strong> {ipInfo.status}
            </li>
            <li>
              <strong>Registered Date:</strong> {ipInfo.registeredDate}
            </li>
            <li>
              <strong>Description:</strong> {ipInfo.description}
            </li>
          </ul>
        </div>

        {/* Owner Info */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-[#a9b5df] hover:shadow-2xl transition">
          <h2 className="text-xl font-bold text-[#2d336b] mb-4">
            Owner Details
          </h2>
          <ul className="space-y-3 text-[#2d336b] text-sm md:text-base">
            <li>
              <strong>Name:</strong> {ownerInfo.name}
            </li>
            <li>
              <strong>Email:</strong> {ownerInfo.email}
            </li>
            <li>
              <strong>Phone:</strong> {ownerInfo.phone}
            </li>
            <li>
              <strong>Country:</strong> {ownerInfo.country}
            </li>
          </ul>
        </div>
      </div>

      {/* Transaction History */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-[#2d336b] mb-6 text-center">
          Transaction History
        </h2>

        <div className="grid gap-6">
          {transactionHistory.length > 0 ? (
            transactionHistory.map((tx, index) => (
              <div
                key={index}
                className="relative bg-white border-l-[6px] border-[#7886c7] shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl p-6 group"
              >
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#2d336b] rounded-full border-2 border-white group-hover:scale-110 transition-transform"></div>
                <div className="text-sm sm:text-base text-[#2d336b] space-y-1">
                  <p>
                    <span className="font-semibold">To:</span>{" "}
                    <span className="text-[#2d336b] font-medium">{tx.to}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Details:</span>{" "}
                    <span>{tx.details}</span>
                  </p>
                  <p className="text-xs text-[#7886c7] mt-1">
                    Date: <span className="italic">{tx.date}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#7886c7] text-center">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
    <ResponsiveFooter />
    </>
  );
};
