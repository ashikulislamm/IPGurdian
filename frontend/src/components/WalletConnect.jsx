import React, { useState } from "react";
import {
  WalletIcon,
  LinkIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useWeb3 } from "../Context/Web3Context-simple.jsx";

const WalletConnect = ({
  showBalance = true,
  showNetwork = true,
  compact = false,
}) => {
  // Use actual Web3 context
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
    SUPPORTED_NETWORKS,
    formatAddress,
  } = useWeb3();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle balance refresh
  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 1000);
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
  };

  // Check if current network is supported
  const isCurrentNetworkSupported = chainId
    ? isSupportedNetwork(chainId)
    : true;

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
          <button
            onClick={handleDisconnect}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-lg hover:bg-red-50"
            title="Disconnect Wallet"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

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
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
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

        {/* Network Warning */}
        {!isCurrentNetworkSupported && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Unsupported Network
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Please switch to a supported network to use blockchain
                  features.
                </p>
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
              Connect your wallet to register and manage your intellectual
              property on the blockchain.
            </p>

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
                  <span>Connect Wallet</span>
                </>
              )}
            </button>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Web3 integration is being set up. Wallet connection will be
                  available once the integration is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
