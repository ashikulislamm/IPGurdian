import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Your private network configuration
const PRIVATE_NETWORK_CONFIG = {
  chainId: 40404040, // Your custom chain ID
  chainName: 'IPGuardian Private Network',
  rpcUrls: ['http://127.0.0.1:8545'], // Your local Geth node
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
};

// Contract configuration
const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "bytes32", "name": "ipHash", "type": "bytes32"}
    ],
    "name": "registerIP",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "ipId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "owner", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "title", "type": "string"},
      {"indexed": false, "internalType": "bytes32", "name": "ipHash", "type": "bytes32"}
    ],
    "name": "IPRegistered",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "ipId", "type": "uint256"}],
    "name": "getIP",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "bytes32", "name": "ipHash", "type": "bytes32"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "getUserIPs",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0.0000');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Check if current network is supported (your private network)
  const isSupportedNetwork = (networkChainId) => {
    return parseInt(networkChainId) === PRIVATE_NETWORK_CONFIG.chainId;
  };

  // Add private network to MetaMask
  const addPrivateNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${PRIVATE_NETWORK_CONFIG.chainId.toString(16)}`, // Convert to hex
            chainName: PRIVATE_NETWORK_CONFIG.chainName,
            rpcUrls: PRIVATE_NETWORK_CONFIG.rpcUrls,
            nativeCurrency: PRIVATE_NETWORK_CONFIG.nativeCurrency,
          },
        ],
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to add private network:', error);
      return { success: false, error: error.message };
    }
  };

  // Switch to private network
  const switchToPrivateNetwork = async () => {
    try {
      const hexChainId = `0x${PRIVATE_NETWORK_CONFIG.chainId.toString(16)}`;
      
      try {
        // Try to switch to the network first
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });
        return { success: true };
      } catch (switchError) {
        // If network doesn't exist, add it first
        if (switchError.code === 4902) {
          const addResult = await addPrivateNetwork();
          if (addResult.success) {
            // Try switching again after adding
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: hexChainId }],
            });
            return { success: true };
          }
          return addResult;
        }
        throw switchError;
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      return { success: false, error: error.message };
    }
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      const errorMsg = 'MetaMask is required to connect wallet';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get current chain ID
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Check if we're on the private network
      if (!isSupportedNetwork(parseInt(currentChainId, 16))) {
        // Try to switch to private network
        const switchResult = await switchToPrivateNetwork();
        if (!switchResult.success) {
          throw new Error(`Please switch to IPGuardian Private Network (Chain ID: ${PRIVATE_NETWORK_CONFIG.chainId})`);
        }
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      
      // Create contract instance
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        web3Signer
      );

      // Update state
      setAccount(accounts[0]);
      setChainId(parseInt(currentChainId, 16));
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setIsConnected(true);

      // Get balance
      await refreshBalance(web3Provider, accounts[0]);

      console.log('✅ Wallet connected to private network!');
      console.log('📍 Account:', accounts[0]);
      console.log('🌐 Chain ID:', parseInt(currentChainId, 16));
      console.log('📄 Contract:', CONTRACT_ADDRESS);

      return { success: true, account: accounts[0] };

    } catch (error) {
      console.error('Wallet connection failed:', error);
      const errorMsg = error.message || 'Failed to connect wallet';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Refresh balance
  const refreshBalance = async (web3Provider = provider, address = account) => {
    if (!web3Provider || !address) return;

    try {
      const balance = await web3Provider.getBalance(address);
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(4);
      setBalance(formattedBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setBalance('0.0000');
    setProvider(null);
    setSigner(null);
    setContract(null);
    setError(null);
    return { success: true };
  };

  // Format address for display
  const formatAddress = (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = (chainId) => {
      const numericChainId = parseInt(chainId, 16);
      setChainId(numericChainId);
      
      if (!isSupportedNetwork(numericChainId)) {
        setError(`Unsupported network. Please switch to IPGuardian Private Network (Chain ID: ${PRIVATE_NETWORK_CONFIG.chainId})`);
      } else {
        setError(null);
        if (isConnected) {
          refreshBalance();
        }
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account, isConnected]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  const value = {
    // State
    account,
    isConnected,
    loading,
    error,
    chainId,
    balance,
    provider,
    signer,
    contract,

    // Functions
    connectWallet,
    disconnectWallet,
    refreshBalance,
    formatAddress,
    isMetaMaskInstalled,
    isSupportedNetwork,
    switchToPrivateNetwork,

    // Constants
    SUPPORTED_NETWORKS: {
      [PRIVATE_NETWORK_CONFIG.chainId]: PRIVATE_NETWORK_CONFIG.chainName,
    },
    CONTRACT_ADDRESS,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};