import React, { useState, useEffect, useContext } from "react";
import {
  UserIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  PlusIcon,
  DocumentPlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  ClockIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ResponsiveNavbar } from "../components/Navbar";
import { ResponsiveFooter } from "../components/Footer";
import { AuthContext } from "../Context/AuthContext";
import { useWeb3 } from "../Context/Web3Context-simple.jsx";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../assets/profile.png";

const menuItems = [
  {
    name: "User Information",
    icon: <UserIcon className="h-5 w-5" />,
    key: "user",
  },
  {
    name: "Settings",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    key: "settings",
  },
  {
    name: "Register New IP",
    icon: <DocumentPlusIcon className="h-5 w-5" />,
    key: "registerip",
  },
  {
    name: "Registered IPs",
    icon: <FolderIcon className="h-5 w-5" />,
    key: "ips",
  },
  {
    name: "IP Trading History",
    icon: <ArrowPathIcon className="h-5 w-5" />,
    key: "history",
  },
  {
    name: "Logout",
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
    key: "logout",
  },
];

const SettingsPanel = ({ userData, setUserData, setPopup }) => {
  const { updateUserProfile, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    country: userData?.country || "",
    address: userData?.address || "",
    dateOfBirth: userData?.dateOfBirth
      ? userData.dateOfBirth.split("T")[0]
      : "",
    bio: userData?.bio || "",
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        country: userData.country || "",
        address: userData.address || "",
        dateOfBirth: userData.dateOfBirth
          ? userData.dateOfBirth.split("T")[0]
          : "",
        bio: userData.bio || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit bio to 500 characters
    if (name === "bio" && value.length > 500) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateUserProfile(formData);

    if (result.success) {
      setUserData(result.data);
      setPopup({
        show: true,
        message: result.message || "Profile updated successfully!",
        success: true,
      });
    } else {
      setPopup({
        show: true,
        message: result.error || "Failed to update profile",
        success: false,
      });
    }

    // Hide popup after 4 seconds
    setTimeout(() => {
      setPopup({ show: false, message: "", success: true });
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#2d336b]">
        Edit Profile Settings
      </h2>

      {/* Avatar Section */}
      <div className="flex items-center mb-6 gap-6">
        <img
          src={UserAvatar}
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-[#a9b5df]"
        />
        <div>
          <label className="block mb-1 text-sm font-semibold text-[#2d336b]">
            Change Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-[#2d336b] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[#7886c7] hover:file:bg-[#2d336b]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Avatar upload coming soon
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2d336b]"
      >
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter your country"
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-semibold mb-1"
            htmlFor="dateOfBirth"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1" htmlFor="bio">
            Bio / About Me
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself, your work, and your interests..."
            className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] resize-vertical"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              This will be displayed on your profile page.
            </p>
            <p
              className={`text-xs ${
                formData.bio.length > 450
                  ? "text-orange-500"
                  : formData.bio.length === 500
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {formData.bio.length}/500
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#7886c7] hover:bg-[#2d336b]"
            } text-white`}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Enhanced RegisterIPPanel with blockchain integration
const RegisterIPPanel = ({ setPopup }) => {
  // Use Web3 context
  const { contract, signer, isConnected, account, chainId, isSupportedNetwork } = useWeb3();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ipType: "copyright",
    category: "",
    tags: "",
    file: null,
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockchainTx, setBlockchainTx] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "IP title is required";
    } else if (formData.title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!formData.ipType) {
      errors.ipType = "IP type is required";
    }

    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 50) {
      errors.description = "Description must be at least 50 characters";
    } else if (formData.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    if (formData.file && formData.file.size > 10 * 1024 * 1024) {
      errors.file = "File size must be less than 10MB";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setPopup({
          show: true,
          message: "File size must be less than 10MB",
          success: false,
        });
        return;
      }
      setFormData({ ...formData, file });
    }

    // Clear validation error
    if (validationErrors.file) {
      setValidationErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setPopup({
        show: true,
        message: "Please fix the validation errors before submitting",
        success: false,
      });
      return;
    }

    // Mock blockchain functionality for testing
    console.log("Mock IP registration for testing");

    setIsSubmitting(true);

    try {
      // Simulate blockchain registration for testing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPopup({
        show: true,
        message: "IP registered successfully (test mode)!",
        success: true,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        ipType: "copyright",
        category: "",
        tags: "",
        file: null,
        isPublic: false,
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Registration error:", error);
      setPopup({
        show: true,
        message: `Failed to register IP: ${error.message}`,
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }

    // Hide popup after 6 seconds
    setTimeout(() => {
      setPopup({ show: false, message: "", success: true });
    }, 6000);
  };

  // Helper function to generate file hash
  const generateFileHash = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-[#2d336b]">
        Register New Intellectual Property
      </h2>

      {/* Wallet Connection Status - Temporarily disabled */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Test Mode:</strong> Blockchain wallet connection temporarily disabled for debugging.
        </p>
      </div>

      {/* Blockchain Transaction Success */}
      {blockchainTx && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-green-800 mb-2">
                Blockchain Registration Successful!
              </h3>
              <div className="text-sm text-green-600 space-y-1">
                <p>
                  <strong>Transaction Hash:</strong>
                  <a
                    href={`https://etherscan.io/tx/${blockchainTx.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 underline hover:no-underline"
                  >
                    {blockchainTx.transactionHash.slice(0, 10)}...
                  </a>
                </p>
                <p>
                  <strong>Block Number:</strong> {blockchainTx.blockNumber}
                </p>
                <p>
                  <strong>Gas Used:</strong> {blockchainTx.gasUsed}
                </p>
                {blockchainTx.ipId && (
                  <p>
                    <strong>IP ID:</strong> {blockchainTx.ipId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-[#2d336b]">
        {/* IP Title */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="title">
            IP Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title of your intellectual property"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] ${
              validationErrors.title ? "border-red-500" : "border-[#a9b5df]"
            }`}
            maxLength={100}
            required
          />
          {validationErrors.title && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* IP Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="ipType"
            >
              IP Type *
            </label>
            <select
              id="ipType"
              name="ipType"
              value={formData.ipType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] ${
                validationErrors.ipType ? "border-red-500" : "border-[#a9b5df]"
              }`}
              required
            >
              <option value="copyright">Copyright</option>
              <option value="trademark">Trademark</option>
              <option value="patent">Patent</option>
              <option value="design">Design</option>
              <option value="trade-secret">Trade Secret</option>
            </select>
            {validationErrors.ipType && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.ipType}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor="category"
            >
              Category *
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Software, Music, Art, Technology"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] ${
                validationErrors.category
                  ? "border-red-500"
                  : "border-[#a9b5df]"
              }`}
              required
            />
            {validationErrors.category && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.category}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of your intellectual property (minimum 50 characters)"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] resize-vertical ${
              validationErrors.description
                ? "border-red-500"
                : "border-[#a9b5df]"
            }`}
            maxLength={1000}
            required
          />
          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/1000 characters (minimum 50)
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="file">
            Upload File (Optional)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.png,.gif,.mp3,.mp4,.zip"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[#7886c7] hover:file:bg-[#2d336b] ${
              validationErrors.file ? "border-red-500" : "border-[#a9b5df]"
            }`}
          />
          {validationErrors.file && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.file}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF, MP3, MP4, ZIP (Max
            10MB)
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas (e.g., innovation, technology, creative)"
            className="w-full px-4 py-3 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use tags to make your IP more discoverable
          </p>
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center gap-3">
          <input
            id="isPublic"
            name="isPublic"
            type="checkbox"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-4 h-4 text-[#7886c7] border-[#a9b5df] rounded focus:ring-2 focus:ring-[#7886c7]"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Make this IP publicly visible in the marketplace
          </label>
        </div>

        {/* Development Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Development Mode</p>
              <p>
                IP registration is currently in demo mode. Blockchain
                integration with your smart contract will be activated once the
                Web3 setup is complete. This will provide immutable timestamp
                proof and cryptographic verification.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#7886c7] hover:bg-[#2d336b]"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Registering IP...</span>
              </>
            ) : (
              <>
                <DocumentPlusIcon className="h-5 w-5" />
                <span>Register Intellectual Property</span>
              </>
            )}
          </button>
        </div>

        {/* Enhanced Disclaimer */}
        <div className="bg-[#f9faff] p-4 rounded-lg border border-[#a9b5df]">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> By registering your IP on IPGuardian, you are
            creating a blockchain-backed proof of creation with immutable
            timestamp. This registration does not replace official IP
            registration with government authorities but provides additional
            protection and verification through cryptographic proof.
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export const UserDashboard = () => {
  const [activePanel, setActivePanel] = useState("user");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const { user, fetchUserProfile, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user authentication has been initialized
    const token = localStorage.getItem("token");

    if (!token && !user) {
      navigate("/login");
      return;
    }

    // If we have a token but no user data, or if we have user data, set it up
    if (user) {
      setUserData(user);
      setIsInitialized(true);
    } else if (token) {
      // We have a token but no user data in context, try to fetch profile
      const initializeProfile = async () => {
        const result = await fetchUserProfile();
        if (result.success) {
          setUserData(result.data);
        } else {
          console.error("Failed to fetch user data:", result.error);
          // If token is invalid, logout and redirect
          if (
            result.error.includes("Token") ||
            result.error.includes("authorization")
          ) {
            logout();
            navigate("/login");
          }
        }
        setIsInitialized(true);
      };

      initializeProfile();
    } else {
      setIsInitialized(true);
    }
  }, [user, navigate]);

  // Separate effect for fetching profile when needed
  useEffect(() => {
    if (user && !userData) {
      setUserData(user);
    }
  }, [user, userData]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while initializing or loading
  if (loading || !isInitialized) {
    return (
      <>
        <ResponsiveNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7886c7] mx-auto"></div>
            <p className="mt-4 text-[#2d336b]">Loading profile...</p>
          </div>
        </div>
        <ResponsiveFooter />
      </>
    );
  }

  // If no user data after initialization, show message
  if (!userData) {
    return (
      <>
        <ResponsiveNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[#2d336b] text-lg">No user data available</p>
            <p className="text-gray-600 mt-2">
              Please login to access your profile
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-[#7886c7] text-white px-4 py-2 rounded-lg hover:bg-[#2d336b] transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
        <ResponsiveFooter />
      </>
    );
  }

  const avatar = UserAvatar;
  const username = userData?.name || "User";

  const panels = {
    user: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl mx-auto bg-white p-8 rounded-2xl"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Avatar */}
          <img
            src={UserAvatar}
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-[#a9b5df] shadow-lg object-cover"
          />

          {/* Details */}
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-bold text-[#2d336b]">About Me</h2>
            <p className="text-[#ec4d4d] font-medium">
              IPGuardian User from {userData.country || "Unknown Location"}
            </p>
            <div className="text-gray-600 leading-relaxed">
              {userData.bio ? (
                <p>{userData.bio}</p>
              ) : (
                <p className="italic text-gray-500">
                  No bio added yet. You can add your bio through the Settings
                  panel to tell others about yourself and your work.
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 gap-y-4 text-sm text-[#2d336b]">
              <div>
                <span className="font-semibold">Full Name:</span>{" "}
                {userData.name || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {userData.email || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {userData.phone || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Country:</span>{" "}
                {userData.country || "Not specified"}
              </div>
              <div>
                <span className="font-semibold">Date of Birth:</span>{" "}
                {formatDate(userData.dateOfBirth)}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {userData.address || "Not specified"}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center bg-[#f3f4fa] p-6 rounded-xl shadow-md">
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">0</p>
            <p className="text-sm text-gray-600">IPs Registered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">0</p>
            <p className="text-sm text-gray-600">IPs Transferred</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">0</p>
            <p className="text-sm text-gray-600">Pending Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2d336b]">100%</p>
            <p className="text-sm text-gray-600">Approval Rate</p>
          </div>
        </div>
      </motion.div>
    ),
    settings: (
      <SettingsPanel
        userData={userData}
        setUserData={setUserData}
        setPopup={setPopup}
      />
    ),
    ips: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">
          Registered IPs
        </h2>
        <div className="text-center py-12">
          <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No IPs registered yet</p>
          <button
            onClick={() => setActivePanel("registerip")}
            className="bg-[#7886c7] text-white px-6 py-2 rounded-lg hover:bg-[#2d336b] transition-all"
          >
            Register Your First IP
          </button>
        </div>
      </motion.div>
    ),
    history: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">
          IP Trading History
        </h2>
        <div className="text-center py-12">
          <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No trading history available</p>
        </div>
      </motion.div>
    ),
    logout: (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center p-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">
          Are you sure you want to logout?
        </h2>
        <p className="text-[#7886c7] mb-6">
          You will need to login again to access your profile.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="bg-[#ec4d4d] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setActivePanel("user")}
            className="bg-[#7886c7] text-white px-6 py-2 rounded-lg hover:bg-[#2d336b] transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    ),
    registerip: <RegisterIPPanel setPopup={setPopup} />,
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="mt-16"></div>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f9faff]">
        {/* Sidebar */}
        <div className="bg-[#2d336b] text-white lg:w-64 p-4 relative rounded-lg lg:rounded-r-none lg:rounded-tl-3xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <p className="text-sm font-medium">{username}</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white focus:outline-none hover:bg-[#7886c7] p-2 rounded-lg"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <ul
            className={`space-y-2 mt-6 ${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setActivePanel(item.key);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  activePanel === item.key
                    ? "bg-[#a9b5df] text-[#2d336b] font-semibold"
                    : "hover:bg-[#7886c7] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="sm:inline">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-tl-3xl">
          {panels[activePanel]}
        </main>
      </div>

      {/* Popup */}
      {popup.show && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            popup.success ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {popup.message}
        </div>
      )}

      <ResponsiveFooter />
    </>
  );
};
