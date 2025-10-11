import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  ArrowLeftIcon,
  TagIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

export const IPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch IP details from API
  const fetchIPDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get from marketplace API (for public IPs)
      const marketplaceResponse = await fetch(
        `http://localhost:5000/api/ip/marketplace?limit=100`
      );

      if (marketplaceResponse.ok) {
        const marketplaceResult = await marketplaceResponse.json();
        if (marketplaceResult.success && marketplaceResult.data) {
          const foundIP = marketplaceResult.data.find(ip => ip._id === id);
          if (foundIP) {
            setIpData({
              ...foundIP,
              formattedDate: new Date(foundIP.createdAt || foundIP.registrationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            });
            return;
          }
        }
      }

      // If not found in marketplace, it might be a private IP
      setError("IP not found or not publicly accessible");
    } catch (error) {
      console.error("Error fetching IP details:", error);
      setError("Failed to fetch IP details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIPDetails();
    }
  }, [id]);

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
        return "text-green-600 bg-green-100 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  if (loading) {
    return (
      <>
        <ResponsiveNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7886c7] mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading IP details...</p>
          </div>
        </div>
        <ResponsiveFooter />
      </>
    );
  }

  if (error || !ipData) {
    return (
      <>
        <ResponsiveNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
          <div className="text-center py-16 max-w-md mx-auto">
            <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              IP Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "The requested intellectual property could not be found or is not publicly accessible."}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-[#2d336b] text-white px-6 py-3 rounded-lg hover:bg-[#1e2347] transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Go Back
            </button>
          </div>
        </div>
        <ResponsiveFooter />
      </>
    );
  }

  return (
    <>
      <ResponsiveNavbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gray-50 mt-16 rounded-b-3xl"
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#2d336b] to-[#7886c7] text-white py-16 px-6 rounded-t-3xl shadow-lg">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">{getIPTypeIcon(ipData.ipType)}</span>
                <h1 className="text-3xl md:text-5xl font-bold">{ipData.title}</h1>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm mb-4">
                <span className="bg-white/20 px-4 py-2 rounded-full capitalize">
                  {ipData.ipType}
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  {ipData.category}
                </span>
                <span
                  className={`px-4 py-2 rounded-full border font-medium ${getStatusColor(ipData.status)}`}
                >
                  {ipData.status}
                </span>
              </div>

              {ipData.userId && (
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <UserIcon className="h-5 w-5" />
                  <span>Owned by</span>
                  <span className="font-semibold text-white">{ipData.userId.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Description Section - Full Width */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#2d336b] mb-6 flex items-center gap-3">
                <DocumentTextIcon className="h-7 w-7 text-[#7886c7]" />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {ipData.description}
              </p>
              
              {ipData.tags && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-[#7886c7]" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {ipData.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#f0f2ff] text-[#2d336b] px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* IP Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#2d336b] mb-6 flex items-center gap-3">
                <ShieldCheckIcon className="h-7 w-7 text-[#7886c7]" />
                IP Information
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                      Type
                    </label>
                    <div className="flex items-center gap-2 text-gray-800">
                      <span className="text-xl">{getIPTypeIcon(ipData.ipType)}</span>
                      <span className="font-semibold capitalize text-lg">{ipData.ipType}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                      Category
                    </label>
                    <p className="text-gray-800 font-semibold text-lg">{ipData.category}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                    Registration Date
                  </label>
                  <div className="flex items-center gap-2 text-gray-800">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-semibold">{ipData.formattedDate}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-block px-4 py-2 rounded-full border font-medium ${getStatusColor(ipData.status)}`}
                  >
                    {ipData.status}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                    Wallet Address
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-mono text-sm break-all">{ipData.creator}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Information */}
            {ipData.userId && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-[#2d336b] mb-6 flex items-center gap-3">
                  <UserIcon className="h-7 w-7 text-[#7886c7]" />
                  Owner Details
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#2d336b] to-[#7886c7] rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserIcon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-[#2d336b]">{ipData.userId.name}</h4>
                    <p className="text-gray-600">{ipData.userId.email}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blockchain Verification */}
            {ipData.transactionHash && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-[#2d336b] mb-6 flex items-center gap-3">
                  <LinkIcon className="h-7 w-7 text-[#7886c7]" />
                  Blockchain Verification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                      Transaction Hash
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-mono text-sm break-all">{ipData.transactionHash}</p>
                    </div>
                  </div>

                  {ipData.blockNumber && (
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide block mb-2">
                        Block Number
                      </label>
                      <p className="text-gray-800 font-mono font-bold text-2xl">#{ipData.blockNumber}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <a
                    href={`https://etherscan.io/tx/${ipData.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <LinkIcon className="h-5 w-5" />
                    View on Blockchain Explorer
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      <ResponsiveFooter />
    </>
  );
};
