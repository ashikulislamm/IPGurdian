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
  FolderOpenIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";

export const IPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Fetch attached files for the IP
  const fetchAttachedFiles = async (ipId) => {
    if (!ipId) return;
    
    try {
      setFilesLoading(true);
      
      const response = await fetch(
        `http://localhost:5000/api/files/public/ip/${ipId}/files`
      );
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAttachedFiles(result.files || []);
        } else {
          setAttachedFiles([]);
        }
      } else {
        setAttachedFiles([]);
      }
    } catch (error) {
      console.error("Error fetching attached files:", error);
      setAttachedFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

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
            const formattedIP = {
              ...foundIP,
              formattedDate: new Date(foundIP.createdAt || foundIP.registrationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            };
            setIpData(formattedIP);
            
            // Fetch files for this IP
            fetchAttachedFiles(foundIP._id);
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

  // Helper functions for file handling
  const getFileIcon = (mimetype) => {
    if (!mimetype) return '📎';
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.startsWith('video/')) return '🎥';
    if (mimetype.startsWith('audio/')) return '🎵';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('document') || mimetype.includes('word')) return '📝';
    if (mimetype.includes('spreadsheet') || mimetype.includes('excel')) return '📊';
    if (mimetype.includes('zip') || mimetype.includes('rar')) return '📦';
    return '📎';
  };

  const handleFileDownload = (file) => {
    if (file.gatewayUrl) {
      window.open(file.gatewayUrl, '_blank');
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
              className="inline-flex items-center gap-2 bg-[#2d336b] text-white px-6 py-3 rounded-lg hover:bg-[#1e2347] transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-[#7886c7]"
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

            {/* Attached Files Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-[#2d336b] mb-6 flex items-center gap-3">
                <FolderOpenIcon className="h-7 w-7 text-[#7886c7]" />
                Attached Files
                {attachedFiles.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {attachedFiles.length}
                  </span>
                )}
              </h3>

              {filesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7886c7] mr-3"></div>
                  <span className="text-gray-600">Loading files...</span>
                </div>
              ) : attachedFiles.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-gray-50 hover:bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getFileIcon(file.mimetype)}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate text-sm">
                                {file.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {file.size} • {file.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        {file.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {file.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => window.open(file.gatewayUrl, '_blank')}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                          </button>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 border-t border-gray-200 pt-2">
                          <div className="flex items-center justify-between">
                            <span>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</span>
                            <span>{file.downloadCount || 0} downloads</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* File count summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        <strong>{attachedFiles.length}</strong> file{attachedFiles.length !== 1 ? 's' : ''} attached
                      </span>
                      <span>
                        Total downloads: <strong>
                          {attachedFiles.reduce((sum, file) => sum + (file.downloadCount || 0), 0)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-700 mb-2">No Files Attached</h4>
                  <p className="text-gray-500">
                    This intellectual property registration does not have any attached files.
                  </p>
                </div>
              )}
            </motion.div>

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
