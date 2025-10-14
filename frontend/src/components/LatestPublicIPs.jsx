import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  ArrowRightIcon,
  EyeIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const LatestPublicIPs = () => {
  const [latestIPs, setLatestIPs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest public IPs
  const fetchLatestIPs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/ip/marketplace?limit=4&sortBy=registrationDate&sortOrder=desc"
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // Format the data for display
          const formattedIPs = result.data.map((ip) => ({
            ...ip,
            formattedDate: new Date(
              ip.createdAt || ip.registrationDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          }));
          setLatestIPs(formattedIPs);
        }
      }
    } catch (error) {
      console.error("Error fetching latest IPs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestIPs();
  }, []);

  const getIPTypeIcon = (ipType) => {
    switch (ipType) {
      case "copyright":
        return "©";
      case "trademark":
        return "™";
      case "patent":
        return "⚖️";
      case "design":
        return "🎨";
      case "trade-secret":
        return "🔐";
      default:
        return "📄";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <SparklesIcon className="h-8 w-8 text-[#7886c7]" />
            <h2 className="text-4xl font-bold text-[#2d336b]">
              Latest Public IPs
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the most recently registered intellectual properties made
            public by our community. Each IP is verified on the blockchain for
            authenticity and ownership.
          </p>
        </motion.div>

        {/* Latest IPs Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7886c7] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading latest IPs...</p>
          </div>
        ) : latestIPs.length === 0 ? (
          <div className="text-center py-16">
            <EyeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Public IPs Yet
            </h3>
            <p className="text-gray-600">
              Be the first to register and share your intellectual property!
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {latestIPs.map((ip, index) => (
              <motion.div
                key={ip._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl">
                        {getIPTypeIcon(ip.ipType)}
                      </span>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {ip.ipType}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ip.status
                      )}`}
                    >
                      {ip.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3">
                    <h3 className="font-bold text-lg text-[#2d336b] leading-tight">
                      {truncateText(ip.title, 40)}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {truncateText(ip.description, 80)}
                    </p>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{ip.formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                  <div className="text-center space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <p className="font-semibold text-[#2d336b]">
                        {ip.category}
                      </p>
                    </div>
                    <Link
                      to={`/ip-details/${ip._id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-white px-4 py-2 rounded-lg hover:from-[#1e2347] hover:to-[#5d6bb0] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium group"
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>View Details</span>
                      <ArrowRightIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-white px-8 py-4 rounded-2xl hover:from-[#1e2347] hover:to-[#5d6bb0] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold group"
          >
            <span>Explore Full Marketplace</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Browse all public intellectual properties, use advanced filters, and
            discover amazing innovations from our community.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestPublicIPs;
