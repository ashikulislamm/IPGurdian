import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  LinkIcon,
  TagIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

const Marketplace = () => {
  const navigate = useNavigate();
  const [publicIPs, setPublicIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch public IPs
  const fetchPublicIPs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filter !== "all") {
        params.append("status", filter);
      }

      if (typeFilter !== "all") {
        params.append("ipType", typeFilter);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      params.append("limit", "50");

      const apiUrl = `http://localhost:5000/api/ip/marketplace?${params}`;
      console.log("🚀 Fetching marketplace data from:", apiUrl);

      const response = await fetch(apiUrl);

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("📦 API result:", result);

      if (result.success) {
        console.log("✅ Found", result.data?.length || 0, "public IPs");

        // Format dates for display
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
        setPublicIPs(formattedIPs);
      } else {
        console.error("❌ API returned error:", result.error);
        setPublicIPs([]);
      }
    } catch (error) {
      console.error("💥 Error fetching public IPs:", error.message);
      console.error("💥 Full error:", error);
      setPublicIPs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicIPs();
  }, [filter, typeFilter, searchTerm]);

  // Navigate to IP details page
  const viewIPDetails = (ipId) => {
    navigate(`/ip-details/${ipId}`);
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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };



  return (
    <>
      <ResponsiveNavbar />
      <div className="mt-16"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gray-50 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2d336b] mb-4">
              Registered IPs Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and explore intellectual property registered on our
              platform. All IPs listed here are verified on the blockchain and
              made publicly available by their creators.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7886c7] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="copyright">Copyright</option>
                <option value="trademark">Trademark</option>
                <option value="patent">Patent</option>
                <option value="design">Design</option>
                <option value="trade-secret">Trade Secret</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7886c7] mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading marketplace...</p>
            </div>
          ) : publicIPs.length === 0 ? (
            <div className="flex justify-center">
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <EyeIcon className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No public IPs found
                </h3>
                <p className="text-gray-600 px-4">
                  {searchTerm || filter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters to see more results"
                    : "No intellectual properties have been made public yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {publicIPs.map((ip) => (
                    <motion.div
                      key={ip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => viewIPDetails(ip._id)}
                    >
                      <div className="p-8">
                        <div className="text-center mb-6">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="text-3xl">
                              {getIPTypeIcon(ip.ipType)}
                            </span>
                            <span className="text-sm font-medium text-gray-600 capitalize">
                              {ip.ipType}
                            </span>
                          </div>
                          <div className="flex justify-center mb-4">
                            <span
                              className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(
                                ip.status
                              )}`}
                            >
                              {ip.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-xl text-[#2d336b] mb-3 leading-tight">
                            {truncateText(ip.title, 50)}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {truncateText(ip.description, 120)}
                          </p>
                        </div>

                        <div className="space-y-3 text-center">
                          <div className="flex items-center justify-center text-sm text-gray-600">
                            <span className="font-medium">Category:</span>
                            <span className="ml-2 text-[#2d336b] font-semibold">
                              {ip.category}
                            </span>
                          </div>

                          <div className="flex items-center justify-center text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{ip.formattedDate}</span>
                          </div>

                          {ip.tags && (
                            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                              {ip.tags
                                .split(",")
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-[#f0f2ff] text-[#2d336b] px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              {ip.tags.split(",").length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{ip.tags.split(",").length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                        <div className="text-center space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-semibold text-gray-700">
                                {ip.userId?.name || 'Unknown Owner'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              Wallet: {ip.creator.slice(0, 8)}...
                              {ip.creator.slice(-6)}
                            </div>
                          </div>
                          <button className="text-[#7886c7] hover:text-[#2d336b] text-sm font-semibold transition-all duration-200 hover:scale-105">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          {!loading && publicIPs.length > 0 && (
            <div className="text-center mt-12">
              <div className="bg-white rounded-2xl shadow-sm py-6 px-8 inline-block">
                <p className="text-gray-600 text-lg font-medium">
                  Showing {publicIPs.length} public intellectual properties
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      <ResponsiveFooter />
    </>
  );
};

export default Marketplace;
