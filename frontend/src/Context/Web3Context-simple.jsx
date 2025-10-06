import React, { createContext, useContext, useState, useCallback } from "react";

const Web3Context = createContext(null);

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  // State management
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  // Utility functions
  const isMetaMaskInstalled = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined" &&
      window.ethereum.isMetaMask
    );
  }, []);

  const isSupportedNetwork = useCallback(() => {
    return true; // Simplified for now
  }, []);

  const connectWallet = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        return { success: false, error: "MetaMask not installed" };
      }
      
      console.log("Wallet connection attempted");
      return { success: false, error: "Web3 functionality disabled for testing" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setContract(null);
    setSigner(null);
    setBalance("0");
    return { success: true };
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const contextValue = {
    // State
    account,
    isConnected,
    chainId,
    loading,
    error,
    balance,
    contract,
    signer,
    
    // Functions
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
    isSupportedNetwork,
    formatAddress,
    
    // Constants
    SUPPORTED_NETWORKS: {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
    }
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};