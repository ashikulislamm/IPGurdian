import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { contractAddress } from "../contract/contractconfig.js";

// You'll need to replace this with your actual contract ABI
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "AlreadyListed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    name: "AlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotBuyOwnToken",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721IncorrectOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721InsufficientApproval",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC721InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "ERC721InvalidOperator",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "ERC721InvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC721InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC721InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ERC721NonexistentToken",
    type: "error",
  },
  {
    inputs: [],
    name: "HashRequired",
    type: "error",
  },
  {
    inputs: [],
    name: "LicensingDisabled",
    type: "error",
  },
  {
    inputs: [],
    name: "NotIPFSURI",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "NotListed",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwnerNorApproved",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "PriceIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expected",
        type: "address",
      },
      {
        internalType: "address",
        name: "current",
        type: "address",
      },
    ],
    name: "SellerChanged",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "TokenDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "provided",
        type: "uint256",
      },
    ],
    name: "WrongPayment",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "delist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Delisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
    ],
    name: "LicensePriceSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "licensee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
    ],
    name: "LicensePurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
    ],
    name: "Listed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
    ],
    name: "listForSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
    ],
    name: "Purchased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "purchaseLicense",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "registerAndMint",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "priceWei",
        type: "uint256",
      },
    ],
    name: "setLicensePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "newURI",
        type: "string",
      },
    ],
    name: "TokenURIUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "newURI",
        type: "string",
      },
    ],
    name: "updateTokenURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getLicensePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getListing",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "hashToTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasLicense",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "hasLicenseOf",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "isIPFSURI",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "licensePriceWei",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "dataHash",
        type: "bytes32",
      },
    ],
    name: "verifyByHash",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri_",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const Web3Context = createContext(null);

// Custom hook to use Web3 context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

// Supported networks
const SUPPORTED_NETWORKS = {
  1: "Ethereum Mainnet",
  5: "Goerli Testnet",
  11155111: "Sepolia Testnet",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai",
  56: "BSC Mainnet",
  97: "BSC Testnet",
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
    return (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined" &&
      window.ethereum.isMetaMask
    );
  }, []);

  const isSupportedNetwork = useCallback((chainId) => {
    return SUPPORTED_NETWORKS.hasOwnProperty(chainId);
  }, []);

  const formatAddress = useCallback((address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const formatBalance = useCallback((balance) => {
    try {
      return parseFloat(ethers.formatEther(balance)).toFixed(4);
    } catch (error) {
      return "0.0000";
    }
  }, []);

  // Clear all state
  const clearState = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setChainId(null);
    setBalance("0");
    setError(null);
  }, []);

  // Initialize provider and check existing connection
  const initializeProvider = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      setIsInitialized(true);
      return;
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      // Get network info
      const network = await ethersProvider.getNetwork();
      setChainId(Number(network.chainId));

      // Check if already connected
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        await connectExistingAccount(accounts[0], ethersProvider);
      }
    } catch (error) {
      console.error("Error initializing provider:", error);
      setError("Failed to initialize blockchain connection");
    } finally {
      setIsInitialized(true);
    }
  }, [isMetaMaskInstalled]);

  // Connect existing account
  const connectExistingAccount = useCallback(
    async (accountAddress, ethersProvider) => {
      try {
        setAccount(accountAddress);
        setIsConnected(true);

        // Get signer
        const ethersSigner = await ethersProvider.getSigner();
        setSigner(ethersSigner);

        // Get balance
        const accountBalance = await ethersProvider.getBalance(accountAddress);
        setBalance(formatBalance(accountBalance));

        // Initialize contract if address is valid
        if (contractAddress && ethers.isAddress(contractAddress)) {
          const contractInstance = new ethers.Contract(
            contractAddress,
            CONTRACT_ABI,
            ethersSigner
          );
          setContract(contractInstance);
        } else {
          console.warn("Invalid contract address:", contractAddress);
          setError("Invalid contract address configuration");
        }

        setError(null);
      } catch (error) {
        console.error("Error connecting existing account:", error);
        setError("Failed to connect to existing account");
        clearState();
      }
    },
    [formatBalance, clearState]
  );

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return { success: false, error: "MetaMask not installed" };
    }

    try {
      setLoading(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask");
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      await connectExistingAccount(accounts[0], ethersProvider);

      // Get and validate network
      const network = await ethersProvider.getNetwork();
      const networkChainId = Number(network.chainId);
      setChainId(networkChainId);

      if (!isSupportedNetwork(networkChainId)) {
        setError(`Unsupported network. Please switch to a supported network.`);
        return { success: false, error: "Unsupported network" };
      }

      return { success: true, account: accounts[0] };
    } catch (error) {
      console.error("Error connecting wallet:", error);

      let errorMessage = "Failed to connect wallet";

      if (error.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      clearState();
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [
    isMetaMaskInstalled,
    connectExistingAccount,
    isSupportedNetwork,
    clearState,
  ]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    try {
      clearState();
      return { success: true };
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      return { success: false, error: error.message };
    }
  }, [clearState]);

  // Switch network
  const switchNetwork = useCallback(
    async (targetChainId) => {
      if (!isMetaMaskInstalled()) {
        return { success: false, error: "MetaMask not installed" };
      }

      try {
        setLoading(true);

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.toQuantity(targetChainId) }],
        });

        return { success: true };
      } catch (error) {
        console.error("Error switching network:", error);

        let errorMessage = "Failed to switch network";

        if (error.code === 4902) {
          errorMessage = "Network not added to MetaMask";
        } else if (error.code === 4001) {
          errorMessage = "Network switch rejected by user";
        }

        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [isMetaMaskInstalled]
  );

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!provider || !account) return;

    try {
      const accountBalance = await provider.getBalance(account);
      setBalance(formatBalance(accountBalance));
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  }, [provider, account, formatBalance]);

  // Handle MetaMask events
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = async (accounts) => {
      try {
        if (accounts.length === 0) {
          clearState();
        } else if (accounts[0] !== account) {
          if (provider) {
            await connectExistingAccount(accounts[0], provider);
          }
        }
      } catch (error) {
        console.error("Error handling account change:", error);
        clearState();
      }
    };

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16);
      setChainId(newChainId);

      // Reload page on unsupported network
      if (!isSupportedNetwork(newChainId)) {
        setError(
          "Unsupported network detected. Please switch to a supported network."
        );
      } else {
        setError(null);
        // Refresh balance on network change
        setTimeout(refreshBalance, 1000);
      }
    };

    const handleDisconnect = () => {
      clearState();
    };

    // Add event listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("disconnect", handleDisconnect);

    // Cleanup event listeners
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [
    account,
    provider,
    connectExistingAccount,
    clearState,
    isSupportedNetwork,
    refreshBalance,
  ]);

  // Initialize on mount
  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  // Context value
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

    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,

    // Utils
    isMetaMaskInstalled,
    isSupportedNetwork,
    formatAddress,
    formatBalance,

    // Constants
    SUPPORTED_NETWORKS,
    contractAddress,
  };

  return (
    <Web3Context.Provider value={contextValue}>{children}</Web3Context.Provider>
  );
};

// Export the provider
export { Web3Provider };
