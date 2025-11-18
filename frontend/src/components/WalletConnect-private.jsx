import React, { useState, useEffect, useContext } from "react";
import { useWeb3 } from "../Context/Web3Context-private";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import {
  WalletIcon,
  LinkIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const WalletConnect = ({
  showBalance = true,
  showNetwork = true,
  compact = false,
}) => {
  const {
    account,
    isConnected,
    loading,
    error,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    isMetaMaskInstalled,
    isSupportedNetwork,
    switchToPrivateNetwork,
    SUPPORTED_NETWORKS,
    formatAddress,
  } = useWeb3();

  const { user } = useContext(AuthContext);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);
  const [walletLinkStatus, setWalletLinkStatus] = useState({
    isLinked: false,
    walletAddress: null,
    isChecking: true,
  });
  const [linkError, setLinkError] = useState(null);

  // Check wallet link status when component mounts or user/account changes
  useEffect(() => {
    if (user) {
      checkWalletLinkStatus();
    }
  }, [user, account]);

  // Auto-link wallet when connected and user is logged in
  useEffect(() => {
    if (isConnected && account && user && !walletLinkStatus.isChecking) {
      handleAutoLinkWallet();
    }
  }, [isConnected, account, user, walletLinkStatus.isChecking]);

  // Check if wallet is linked to user account
  const checkWalletLinkStatus = async () => {
    if (!user) {
      setWalletLinkStatus({
        isLinked: false,
        walletAddress: null,
        isChecking: false,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/auth/wallet/status",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWalletLinkStatus({
        isLinked: response.data.isLinked,
        walletAddress: response.data.walletAddress,
        isChecking: false,
      });
    } catch (error) {
      console.error("Error checking wallet status:", error);
      setWalletLinkStatus({
        isLinked: false,
        walletAddress: null,
        isChecking: false,
      });
    }
  };

  // Auto-link wallet when connected
  const handleAutoLinkWallet = async () => {
    if (!account || !user) return;

    const normalizedAccount = account.toLowerCase();

    // If wallet is already linked and matches current account, do nothing
    if (
      walletLinkStatus.isLinked &&
      walletLinkStatus.walletAddress?.toLowerCase() === normalizedAccount
    ) {
      return;
    }

    // If wallet is linked to a different address, warn user
    if (
      walletLinkStatus.isLinked &&
      walletLinkStatus.walletAddress?.toLowerCase() !== normalizedAccount
    ) {
      setLinkError(
        `Your account is linked to ${formatAddress(
          walletLinkStatus.walletAddress
        )}. Please use that wallet or unlink it first.`
      );
      return;
    }

    // Try to link the wallet
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/auth/wallet/link",
        { walletAddress: account },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWalletLinkStatus({
        isLinked: true,
        walletAddress: account.toLowerCase(),
        isChecking: false,
      });
      setLinkError(null);
      console.log("✅ Wallet linked successfully:", account);
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Failed to link wallet";
      setLinkError(errorMsg);
      console.error("❌ Failed to link wallet:", errorMsg);
    }
  };

  // Manually unlink wallet
  const handleUnlinkWallet = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/wallet/unlink",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWalletLinkStatus({
        isLinked: false,
        walletAddress: null,
        isChecking: false,
      });
      setLinkError(null);
      console.log("✅ Wallet unlinked successfully");

      // Disconnect MetaMask as well
      handleDisconnect();
    } catch (error) {
      console.error("Error unlinking wallet:", error);
      alert("Failed to unlink wallet");
    }
  };

  // Handle balance refresh
  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Handle network switch
  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true);
    try {
      await switchToPrivateNetwork();
    } catch (error) {
      console.error("Network switch failed:", error);
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  // Handle wallet connection
  const handleConnect = async () => {
    const result = await connectWallet();
    if (!result.success && result.error) {
      console.error("Connection failed:", result.error);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    const result = disconnectWallet();
    if (!result.success && result.error) {
      console.error("Disconnection failed:", result.error);
    }
    setLinkError(null);
  };

  // Check if current network is supported
  const isCurrentNetworkSupported = chainId
    ? isSupportedNetwork(chainId)
    : true;

  // Wallet link status indicator
  const WalletLinkIndicator = () => {
    if (!user || !isConnected) return null;

    if (walletLinkStatus.isChecking) {
      return (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
          <span>Checking wallet link...</span>
        </div>
      );
    }

    if (walletLinkStatus.isLinked) {
      return (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <ShieldCheckIcon className="h-4 w-4" />
          <span className="font-medium">Wallet Linked</span>
        </div>
      );
    }

    if (linkError) {
      return (
        <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <ShieldExclamationIcon className="h-4 w-4" />
          <span className="font-medium">Link Failed</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
        <ShieldExclamationIcon className="h-4 w-4" />
        <span className="font-medium">Not Linked</span>
      </div>
    );
  };

  // Compact view for smaller spaces
  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              {formatAddress(account)}
            </span>
            {!isCurrentNetworkSupported && (
              <button
                onClick={handleSwitchNetwork}
                disabled={isSwitchingNetwork}
                className="text-orange-600 hover:text-orange-800 transition-colors"
                title="Switch to Private Network"
              >
                <Cog6ToothIcon className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-800 transition-colors"
              title="Disconnect"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={loading || !isMetaMaskInstalled()}
            className="flex items-center space-x-2 bg-[#2d336b] hover:bg-[#1e2347] disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <WalletIcon className="h-4 w-4" />
            )}
            <span>Connect</span>
          </button>
        )}
      </div>
    );
  }

  // Full view
  if (isConnected) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-900">Wallet Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            {user && walletLinkStatus.isLinked && (
              <button
                onClick={handleUnlinkWallet}
                className="text-orange-600 hover:text-orange-800 transition-colors p-1 rounded-lg hover:bg-orange-50 text-xs"
                title="Unlink Wallet"
              >
                Unlink
              </button>
            )}
            <button
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-lg hover:bg-red-50"
              title="Disconnect Wallet"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Wallet Link Status */}
        {user && <WalletLinkIndicator />}

        {/* Link Error Display */}
        {linkError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{linkError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Account:</span>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {formatAddress(account, 6)}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(account)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy Address"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Network Info */}
          {showNetwork && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network:</span>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    isCurrentNetworkSupported
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {SUPPORTED_NETWORKS[chainId] || `Chain ID: ${chainId}`}
                </span>
                {!isCurrentNetworkSupported && (
                  <button
                    onClick={handleSwitchNetwork}
                    disabled={isSwitchingNetwork}
                    className="text-orange-600 hover:text-orange-800 transition-colors disabled:opacity-50"
                    title="Switch to Private Network"
                  >
                    <Cog6ToothIcon
                      className={`h-4 w-4 ${
                        isSwitchingNetwork ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Balance Info */}
          {showBalance && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Balance:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{balance} ETH</span>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  title="Refresh Balance"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Network Warning/Switch */}
        {!isCurrentNetworkSupported && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  Wrong Network
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Please switch to IPGuardian Private Network (Chain ID:
                  40404040)
                </p>
                <button
                  onClick={handleSwitchNetwork}
                  disabled={isSwitchingNetwork}
                  className="mt-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  {isSwitchingNetwork ? "Switching..." : "Switch Network"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* MetaMask not installed */}
      {!isMetaMaskInstalled() ? (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              MetaMask Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You need MetaMask installed to use blockchain features.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span>Install MetaMask</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      ) : (
        /* Connect wallet view */
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <WalletIcon className="h-12 w-12 text-[#2d336b]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Connect to IPGuardian Private Network to register your
              intellectual property.
            </p>

            {/* Private Network Info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <p className="text-sm font-medium text-blue-800 mb-2">
                Network Requirements:
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Chain ID: 40404040</li>
                <li>• RPC: http://127.0.0.1:8545</li>
                <li>• Ensure your private blockchain is running</li>
              </ul>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-[#2d336b] hover:bg-[#1e2347] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <LinkIcon className="h-5 w-5" />
                  <span>Connect to Private Network</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
