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
import WalletConnect from "../components/WalletConnect";
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
  const {
    contract,
    signer,
    isConnected,
    account,
    chainId,
    isSupportedNetwork,
  } = useWeb3();
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

    // Check wallet connection (optional for testing)
    if (!isConnected) {
      console.log("Wallet not connected - proceeding with mock registration");
    }

    // Check network (optional for testing)
    if (isConnected && !isSupportedNetwork()) {
      setPopup({
        show: true,
        message:
          "Please switch to a supported network for blockchain registration",
        success: false,
      });
      // Don't return - allow mock registration to continue
    }

    setIsSubmitting(true);

    try {
      // Generate file hash if file is provided
      const fileHash = formData.file
        ? await generateFileHash(formData.file)
        : null;

      // Mock transaction result for blockchain simulation
      const mockTx = {
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: "21000",
        ipId: Math.floor(Math.random() * 1000).toString(),
      };

      // Prepare IP data for backend
      const ipData = {
        title: formData.title,
        description: formData.description,
        ipType: formData.ipType,
        category: formData.category,
        tags: formData.tags,
        creator: account || "demo-address",
        transactionHash: mockTx.transactionHash,
        blockNumber: mockTx.blockNumber,
        gasUsed: mockTx.gasUsed,
        ipId: mockTx.ipId,
        fileName: formData.file?.name || null,
        fileSize: formData.file?.size || null,
        fileHash: fileHash,
        isPublic: formData.isPublic,
      };

      console.log("Registering IP with data:", ipData);

      // Save to backend database
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/ip/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ipData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to register IP");
      }

      setBlockchainTx(mockTx);

      setPopup({
        show: true,
        message: "IP registered successfully and saved to your account!",
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
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
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

      {/* Wallet Connection Status */}
      <div className="mb-6">
        <WalletConnect showBalance={false} />
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

        {/* Blockchain Status Notice */}
        {!isConnected && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <WalletIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Wallet Connection Required</p>
                <p>
                  Please connect your MetaMask wallet to register your IP on the
                  blockchain. This ensures immutable proof of ownership and
                  creation timestamp.
                </p>
              </div>
            </div>
          </div>
        )}

        {isConnected && !isSupportedNetwork() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Unsupported Network</p>
                <p>
                  Please switch to a supported network (Ethereum Mainnet,
                  Goerli, or Sepolia) to register your IP on the blockchain.
                </p>
              </div>
            </div>
          </div>
        )}

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

// RegisteredIPsPanel Component
const RegisteredIPsPanel = ({ setActivePanel, setPopup }) => {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIP, setSelectedIP] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState(null);

  // Fetch user IPs
  const fetchIPs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        status: filter === "all" ? "" : filter,
        search: searchTerm,
        limit: 50,
      });

      const response = await fetch(
        `http://localhost:5000/api/ip/list?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIps(result.data.ips);
      } else {
        console.error("Error fetching IPs:", result.error);
      }
    } catch (error) {
      console.error("Error fetching IPs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch IP statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/ip/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchIPs();
    fetchStats();
  }, [filter, searchTerm]);

  // View IP details
  const viewIPDetails = async (ipId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/ip/${ipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedIP(result.data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error("Error fetching IP details:", error);
    }
  };

  // Delete IP
  const deleteIP = async (ipId) => {
    if (
      !window.confirm("Are you sure you want to delete this IP registration?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/ip/${ipId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setPopup({
          show: true,
          message: "IP deleted successfully",
          success: true,
        });
        fetchIPs(); // Refresh list
        fetchStats(); // Refresh stats
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setPopup({
        show: true,
        message: `Failed to delete IP: ${error.message}`,
        success: false,
      });
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

  if (showDetails && selectedIP) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Header Section */}
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
              <XMarkIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Back to List</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Description Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-[#2d336b] flex items-center gap-2">
              <DocumentPlusIcon className="h-6 w-6 text-[#7886c7]" />
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed text-base">
              {selectedIP.description}
            </p>

            {selectedIP.tags && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
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
            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 h-fit">
              <h3 className="text-xl font-semibold text-[#2d336b] flex items-center gap-2 border-b border-gray-100 pb-3">
                <UserIcon className="h-6 w-6 text-[#7886c7]" />
                Basic Information
              </h3>

              <div className="space-y-5">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    IP TYPE
                  </label>
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="text-2xl">
                      {getIPTypeIcon(selectedIP.ipType)}
                    </span>
                    <span className="font-semibold capitalize text-lg">
                      {selectedIP.ipType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    CATEGORY
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">
                    {selectedIP.category}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    REGISTRATION DATE
                  </label>
                  <p className="text-gray-800 font-semibold flex items-center gap-2 text-base">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    {selectedIP.formattedDate}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    VISIBILITY
                  </label>
                  <div className="flex items-center gap-3">
                    {selectedIP.isPublic ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-700 font-semibold text-base">
                          Public
                        </span>
                        <span className="text-gray-500 text-sm">
                          (visible in marketplace)
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-700 font-semibold text-base">
                          Private
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4 h-fit">
              <h3 className="text-xl font-semibold text-[#2d336b] flex items-center gap-2 border-b border-gray-100 pb-3">
                <LinkIcon className="h-6 w-6 text-[#7886c7]" />
                Blockchain Data
              </h3>

              <div className="space-y-5">
                {selectedIP.blockchain?.transactionHash && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      TRANSACTION HASH
                    </label>
                    <div className="bg-gray-50 p-4 rounded-xl border">
                      <p className="text-gray-800 font-mono text-sm break-all leading-relaxed">
                        {selectedIP.blockchain.transactionHash}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {selectedIP.blockchain?.blockNumber && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        BLOCK
                      </label>
                      <p className="text-gray-800 font-mono font-bold text-lg">
                        #{selectedIP.blockchain.blockNumber}
                      </p>
                    </div>
                  )}

                  {selectedIP.blockchain?.ipId && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        IP ID
                      </label>
                      <p className="text-gray-800 font-mono font-bold text-lg">
                        #{selectedIP.blockchain.ipId}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    CREATOR ADDRESS
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <p className="text-gray-800 font-mono text-sm break-all leading-relaxed">
                      {selectedIP.creator}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Information Card - Full Width */}
          {selectedIP.file && selectedIP.file.name && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
              <h3 className="text-xl font-semibold text-[#2d336b] flex items-center gap-2 border-b border-gray-100 pb-3">
                <FolderIcon className="h-6 w-6 text-[#7886c7]" />
                File Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    FILE NAME
                  </label>
                  <p className="text-gray-800 font-semibold break-all text-base">
                    {selectedIP.file.name}
                  </p>
                </div>

                {selectedIP.file.size && (
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      FILE SIZE
                    </label>
                    <p className="text-gray-800 font-semibold text-base">
                      {(selectedIP.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {selectedIP.file.hash && (
                  <div className="flex flex-col space-y-2 md:col-span-1">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      SHA-256 HASH
                    </label>
                    <div className="bg-gray-50 p-4 rounded-xl border">
                      <p className="text-gray-800 font-mono text-xs break-all leading-relaxed">
                        {selectedIP.file.hash}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-[#2d336b] mb-4">
              Actions
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {selectedIP.blockchain &&
                selectedIP.blockchain.transactionHash && (
                  <a
                    href={`https://etherscan.io/tx/${selectedIP.blockchain.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <LinkIcon className="h-5 w-5" />
                    View on Etherscan
                  </a>
                )}
              <button
                onClick={() => deleteIP(selectedIP.id)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Delete IP
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#2d336b]">Registered IPs</h2>
        <button
          onClick={() => setActivePanel("registerip")}
          className="flex items-center gap-2 bg-[#7886c7] text-white px-4 py-2 rounded-lg hover:bg-[#2d336b] transition-all"
        >
          <PlusIcon className="h-4 w-4" />
          Register New IP
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {stats.overview.total}
            </p>
            <p className="text-sm text-blue-800">Total IPs</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {stats.overview.confirmed}
            </p>
            <p className="text-sm text-green-800">Confirmed</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.overview.pending}
            </p>
            <p className="text-sm text-yellow-800">Pending</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {stats.overview.public}
            </p>
            <p className="text-sm text-purple-800">Public</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">
              {stats.overview.total > 0
                ? Math.round(
                    (stats.overview.confirmed / stats.overview.total) * 100
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-gray-800">Success Rate</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search IPs by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* IP List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7886c7] mx-auto"></div>
          <p className="mt-4 text-[#2d336b]">Loading your IPs...</p>
        </div>
      ) : ips.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchTerm || filter !== "all"
              ? "No IPs found matching your criteria"
              : "No IPs registered yet"}
          </p>
          <button
            onClick={() => setActivePanel("registerip")}
            className="bg-[#7886c7] text-white px-6 py-2 rounded-lg hover:bg-[#2d336b] transition-all"
          >
            Register Your First IP
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ips.map((ip) => (
            <div
              key={ip.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#2d336b] mb-2">
                    {ip.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ip.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span>{getIPTypeIcon(ip.ipType)}</span>
                      {ip.ipType}
                    </span>
                    <span className="text-gray-500">{ip.category}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    ip.status
                  )}`}
                >
                  {ip.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {ip.formattedDate}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewIPDetails(ip.id)}
                    className="text-[#7886c7] hover:text-[#2d336b] text-sm font-medium transition-all"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => deleteIP(ip.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {ip.transactionHash && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <a
                    href={`https://etherscan.io/tx/${ip.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-all"
                  >
                    <LinkIcon className="h-3 w-3" />
                    View on Blockchain
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
      <RegisteredIPsPanel setActivePanel={setActivePanel} setPopup={setPopup} />
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
