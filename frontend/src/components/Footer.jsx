import React from "react";
import { Link } from "react-router-dom";
// social icons
import { CgFacebook } from "react-icons/cg";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

export const ResponsiveFooter = () => {
  return (
    <footer className="bg-white w-full border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top: Grid with brand, two link columns, and address */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-[#2d336b]">IPGurdian</h3>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto md:mx-0">
              Simple tools to register IP, mint NFTs, and manage ownership securely.
            </p>
          </div>

          {/* Links Column 1 */}
          
          <nav aria-label="Footer Navigation - Column 1">
            <ul className="space-y-3 text-[0.95rem] text-center md:text-left">
              <li>
                <Link to="/marketplace" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  Registered IPs
                </Link>
              </li>
              <li>
                <Link to="/nft-marketplace" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  NFT Marketplace
                </Link>
              </li>
              <li>
                <Link to="/company" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  Company
                </Link>
              </li>
            </ul>
          </nav>

          {/* Links Column 2 */}
          <nav aria-label="Footer Navigation - Column 2">
            <ul className="space-y-3 text-[0.95rem] text-center md:text-left">
              <li>
                <Link to="/privacy-policy" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#000000] hover:text-[#7886c7] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company Address */}
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-[#2d336b] tracking-wide">Company</h4>
            <address className="not-italic mt-3 text-sm text-gray-600 leading-6">
              IPGurdian HQ<br />
              12/A Innovation Park<br />
              Dhaka, Bangladesh
            </address>
            <p className="mt-3 text-sm text-gray-600">
              <a href="mailto:support@ipgurdian.com" className="hover:text-[#7886c7] transition-colors">
                support@ipgurdian.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-200" />

        {/* Bottom */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-600">© 2025 IPGurdian. All rights reserved.</p>

          <div className="flex items-center gap-3 text-[#424242]">
            <a href="#" aria-label="Facebook" className="p-2 rounded-full hover:text-white hover:bg-[#2d336b] transition-colors">
              <CgFacebook className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="p-2 rounded-full hover:text-white hover:bg-[#2d336b] transition-colors">
              <BsTwitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-full hover:text-white hover:bg-[#2d336b] transition-colors">
              <BsInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-full hover:text-white hover:bg-[#2d336b] transition-colors">
              <BsLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
