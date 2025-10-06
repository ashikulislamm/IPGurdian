import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

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
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isInitialized, setIsInitialized] = useState(false);

  // Utility functions
  const isMetaMaskInstalled = useCallback(() => {
    try {
      return (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined" &&
        window.ethereum.isMetaMask
      );
    } catch (error) {
      console.warn("Error checking MetaMask:", error);
      return false;
    }
  }, []);

  const isSupportedNetwork = useCallback((networkChainId = chainId) => {
    const supportedChains = [1, 5, 11155111, 137, 80001, 56, 97];
    return supportedChains.includes(Number(networkChainId));
  }, [chainId]);

  // Safe initialization
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        if (typeof window === "undefined") return;
        
        // Check if MetaMask is available
        if (window.ethereum) {
          // Try to get current account without requesting connection
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }).catch(() => []);
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            // Get network
            const networkId = await window.ethereum.request({ 
              method: 'eth_chainId' 
            }).catch(() => null);
            
            if (networkId) {
              setChainId(parseInt(networkId, 16));
            }
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.warn("Web3 initialization error:", error);
        setIsInitialized(true);
      }
    };

    initializeWeb3();
  }, []);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isMetaMaskInstalled()) {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask");
      }

      const account = accounts[0];
      setAccount(account);
      setIsConnected(true);

      // Get network
      const networkId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      setChainId(parseInt(networkId, 16));

      // Set up provider and signer (simplified)
      if (window.ethereum) {
        try {
          const { ethers } = await import('ethers');
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await browserProvider.getSigner();
          
          setProvider(browserProvider);
          setSigner(signer);

          // Get balance
          const balance = await browserProvider.getBalance(account);
          setBalance(ethers.formatEther(balance));
        } catch (ethersError) {
          console.warn("Ethers setup error:", ethersError);
          // Continue without ethers functionality
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setBalance("0");
    setChainId(null);
    setError(null);
    return { success: true };
  };

  const switchNetwork = async (targetChainId = 1) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not available");
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });

      return { success: true };
    } catch (error) {
      console.error("Network switch error:", error);
      return { success: false, error: error.message };
    }
  };

  const refreshBalance = async () => {
    try {
      if (!provider || !account) return;
      
      const { ethers } = await import('ethers');
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.warn("Balance refresh error:", error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Event listeners for account/network changes
  useEffect(() => {
    if (!window.ethereum || !isInitialized) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        refreshBalance();
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(parseInt(chainId, 16));
      refreshBalance();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [isInitialized, account]);

  const contextValue = {
    // State
    account,
    provider,
    signer,
    contract,
    isConnected,
    chainId,
    loading,
    error,
    balance,
    isInitialized,
    
    // Functions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    isMetaMaskInstalled,
    isSupportedNetwork,
    formatAddress,
    
    // Constants
    SUPPORTED_NETWORKS: {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon Mainnet",
      80001: "Polygon Mumbai",
      56: "BSC Mainnet",
      97: "BSC Testnet",
    },

    contractAddress: "0xd9145CCE52D386f254917e481eB44e9943F39138"
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};