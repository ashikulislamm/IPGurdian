import React from "react";
// react icons
import { CgFacebook } from "react-icons/cg";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";
export const ResponsiveFooter = () => {
  return (
    <footer className="bg-white boxShadow rounded-xl w-full p-6 md:p-9">
      <div className="flex justify-center gap-[30px] flex-wrap w-full sm:px-32">
        <div className="flex justify-center sm:justify-between gap-[30px] w-full flex-wrap">
          <Link
            to="/terms-and-conditions"
            className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold"
          >
            Terms & Conditions
          </Link>
          <p className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold">
            Privacy Policy
          </p>
          <p className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold">
            Our Team
          </p>
          <Link
            to="/register"
            className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold"
          >
            Register
          </Link>
          <p className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold">
            Blog
          </p>
          <Link
            to="/contact"
            className="text-[0.9rem] text-[#000000] hover:text-[#7886c7] cursor-pointer transition-all duration-200 font-bold"
          >
            Contact Us
          </Link>
        </div>

        <div className="flex items-center flex-wrap gap-[10px] text-[#424242]">
          <a className="text-[1.3rem] p-2.5 cursor-pointer rounded-full hover:text-white hover:bg-[#2d336b] transition-all duration-300">
            <CgFacebook />
          </a>
          <a className="text-[1.2rem] p-2.5 cursor-pointer rounded-full hover:text-white hover:bg-[#2d336b] transition-all duration-300">
            <BsTwitter />
          </a>
          <a className="text-[1.2rem] p-2.5 cursor-pointer rounded-full hover:text-white hover:bg-[#2d336b] transition-all duration-300">
            <BsInstagram />
          </a>
          <a className="text-[1.2rem] p-2.5 cursor-pointer rounded-full hover:text-white hover:bg-[#2d336b] transition-all duration-300">
            <BsLinkedin />
          </a>
        </div>

        <div className="border-t border-gray-400 pt-[20px] flex items-center w-full flex-wrap gap-[20px] justify-center">
          <p className="text-[0.8rem] sm:text-[0.9rem] text-gray-600 font-medium">
            © 2025 IPGurdian. All Rights Reserved.{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};
