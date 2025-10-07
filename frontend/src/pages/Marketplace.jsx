import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  LinkIcon,
  TagIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

const Marketplace = () => {
  const [publicIPs, setPublicIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedIP, setSelectedIP] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("📦 API result:", result);
      
      if (result.success) {
        console.log("✅ Found", result.data?.length || 0, "public IPs");
        
        // Format dates for display
        const formattedIPs = result.data.map(ip => ({
          ...ip,
          formattedDate: new Date(ip.createdAt || ip.registrationDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short", 
            day: "numeric"
          })
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

  // View IP details
  const viewIPDetails = (ip) => {
    setSelectedIP(ip);
    setShowDetails(true);
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

  // IP Details Modal
  if (showDetails && selectedIP) {
    return (
      <>
        <ResponsiveNavbar />
        <div className="mt-16"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen bg-gray-50 py-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-white p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      {selectedIP.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <span className="text-lg">
                          {getIPTypeIcon(selectedIP.ipType)}
                        </span>
                        {selectedIP.ipType}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full">
                        {selectedIP.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedIP.status === "confirmed"
                            ? "bg-green-500/90"
                            : selectedIP.status === "pending"
                            ? "bg-yellow-500/90"
                            : "bg-red-500/90"
                        }`}
                      >
                        {selectedIP.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 self-start sm:self-center"
                  >
                    <span className="hidden sm:inline">Back to Marketplace</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-8">
                {/* Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 text-[#2d336b] flex items-center gap-2">
                    <DocumentTextIcon className="h-6 w-6 text-[#7886c7]" />
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {selectedIP.description}
                  </p>

                  {selectedIP.tags && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                        <TagIcon className="h-4 w-4" />
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedIP.tags.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#f0f2ff] text-[#2d336b] px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-[#2d336b] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                      <UserIcon className="h-6 w-6 text-[#7886c7]" />
                      IP Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Type
                        </label>
                        <div className="flex items-center gap-3 text-gray-800 mt-1">
                          <span className="text-2xl">
                            {getIPTypeIcon(selectedIP.ipType)}
                          </span>
                          <span className="font-semibold capitalize text-lg">
                            {selectedIP.ipType}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Category
                        </label>
                        <p className="text-gray-800 font-semibold text-lg mt-1">
                          {selectedIP.category}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Registration Date
                        </label>
                        <p className="text-gray-800 font-semibold flex items-center gap-2 text-base mt-1">
                          <ClockIcon className="h-5 w-5 text-gray-500" />
                          {selectedIP.formattedDate || new Date(selectedIP.createdAt || selectedIP.registrationDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short", 
                            day: "numeric"
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Creator
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border mt-1">
                          <p className="text-gray-800 font-mono text-sm break-all">
                            {selectedIP.creator}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-[#2d336b] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                      <LinkIcon className="h-6 w-6 text-[#7886c7]" />
                      Blockchain Verification
                    </h3>
                    
                    {selectedIP.transactionHash ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Transaction Hash
                          </label>
                          <div className="bg-gray-50 p-3 rounded-lg border mt-1">
                            <p className="text-gray-800 font-mono text-sm break-all">
                              {selectedIP.transactionHash}
                            </p>
                          </div>
                        </div>
                        
                        {selectedIP.blockNumber && (
                          <div>
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                              Block Number
                            </label>
                            <p className="text-gray-800 font-mono font-bold text-lg mt-1">
                              #{selectedIP.blockNumber}
                            </p>
                          </div>
                        )}

                        <div className="pt-4">
                          <a
                            href={`https://etherscan.io/tx/${selectedIP.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <LinkIcon className="h-5 w-5" />
                            View on Blockchain
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <LinkIcon className="h-12 w-12 mx-auto" />
                        </div>
                        <p className="text-gray-500">
                          Blockchain verification pending
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <ResponsiveFooter />
      </>
    );
  }

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
              IP Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and explore intellectual property registered on our platform. 
              All IPs listed here are verified on the blockchain and made publicly available by their creators.
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7886c7] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading marketplace...</p>
            </div>
          ) : publicIPs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="text-gray-400 mb-4">
                <EyeIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No public IPs found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "No intellectual properties have been made public yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicIPs.map((ip) => (
                <motion.div
                  key={ip._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => viewIPDetails(ip)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {getIPTypeIcon(ip.ipType)}
                          </span>
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {ip.ipType}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-[#2d336b] mb-2 overflow-hidden">
                          {truncateText(ip.title, 50)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {truncateText(ip.description, 120)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          ip.status
                        )}`}
                      >
                        {ip.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{ip.category}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{ip.formattedDate}</span>
                      </div>

                      {ip.tags && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {ip.tags.split(",").slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="bg-[#f0f2ff] text-[#2d336b] px-2 py-1 rounded text-xs font-medium"
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

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-mono truncate">
                        {ip.creator.slice(0, 10)}...{ip.creator.slice(-8)}
                      </div>
                      <button className="text-[#7886c7] hover:text-[#2d336b] text-sm font-medium transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && publicIPs.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Showing {publicIPs.length} public intellectual properties
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <ResponsiveFooter />
    </>
  );
};

export default Marketplace;