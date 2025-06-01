import React from "react";
import { HiBuildingOffice2, HiMapPin, HiPhone } from "react-icons/hi2";

export const InfoSection = () => {
  return (
    <section className="bg-[#0F172A] text-white py-12 px-6 mt-20 rounded-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {/* Company Info */}
        <div>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 p-3 rounded-md">
              <HiBuildingOffice2 className="text-white text-3xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg mb-1">Company information</h3>
          <p>IPGurdian LLC</p>
          <p>Tax ID: USXXXXXX</p>
        </div>

        {/* Address */}
        <div>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 p-3 rounded-md">
              <HiMapPin className="text-white text-3xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg mb-1">Address</h3>
          <p>Tejgoan, Dhaka</p>
          <p>Bangladesh , 1204</p>
        </div>

        {/* Contact */}
        <div>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 p-3 rounded-md">
              <HiPhone className="text-white text-3xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg mb-1">Email us</h3>
          <p>
            Email us for general queries
          </p>
          <p className="text-[#7886c7] font-semibold mt-1">
            hello@ipgurdian.com
          </p>
        </div>
      </div>
    </section>
  );
};
