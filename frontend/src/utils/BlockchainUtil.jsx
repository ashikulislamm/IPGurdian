import { ethers } from 'ethers';

// Format address for display
export const formatAddress = (address, chars = 4) => {
  if (!address) return '';
  if (!ethers.isAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Format ethers value to readable format
export const formatEther = (value, decimals = 4) => {
  try {
    if (!value) return '0.0000';
    return parseFloat(ethers.formatEther(value)).toFixed(decimals);
  } catch (error) {
    console.error('Error formatting ether:', error);
    return '0.0000';
  }
};

// Format Wei to Gwei
export const formatGwei = (value) => {
  try {
    if (!value) return '0';
    return ethers.formatUnits(value, 'gwei');
  } catch (error) {
    console.error('Error formatting gwei:', error);
    return '0';
  }
};

// Validate Ethereum address
export const isValidAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

// Convert string to Wei
export const parseEther = (value) => {
  try {
    return ethers.parseEther(value.toString());
  } catch (error) {
    throw new Error('Invalid ether value');
  }
};

// Get network name by chain ID
export const getNetworkName = (chainId) => {
  const networks = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai Testnet',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
  };
  return networks[chainId] || `Unknown Network (${chainId})`;
};

// Check if transaction was successful
export const isTxSuccessful = (receipt) => {
  return receipt && receipt.status === 1;
};

// Generate random bytes32
export const generateRandomHash = () => {
  return ethers.keccak256(ethers.randomBytes(32));
};

// Truncate transaction hash
export const formatTxHash = (hash, chars = 6) => {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
};

// Convert timestamp to readable date
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  } catch (error) {
    return 'Invalid date';
  }
};

// Calculate transaction cost
export const calculateTxCost = (gasUsed, gasPrice) => {
  try {
    const cost = BigInt(gasUsed) * BigInt(gasPrice);
    return formatEther(cost);
  } catch (error) {
    return '0.0000';
  }
};

// Validate transaction hash
export const isValidTxHash = (hash) => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

// Get explorer URL for transaction
export const getExplorerTxUrl = (txHash, chainId) => {
  const explorers = {
    1: `https://etherscan.io/tx/${txHash}`,
    5: `https://goerli.etherscan.io/tx/${txHash}`,
    11155111: `https://sepolia.etherscan.io/tx/${txHash}`,
    137: `https://polygonscan.com/tx/${txHash}`,
    80001: `https://mumbai.polygonscan.com/tx/${txHash}`,
    56: `https://bscscan.com/tx/${txHash}`,
    97: `https://testnet.bscscan.com/tx/${txHash}`,
  };
  return explorers[chainId] || '#';
};

// Get explorer URL for address
export const getExplorerAddressUrl = (address, chainId) => {
  const explorers = {
    1: `https://etherscan.io/address/${address}`,
    5: `https://goerli.etherscan.io/address/${address}`,
    11155111: `https://sepolia.etherscan.io/address/${address}`,
    137: `https://polygonscan.com/address/${address}`,
    80001: `https://mumbai.polygonscan.com/address/${address}`,
    56: `https://bscscan.com/address/${address}`,
    97: `https://testnet.bscscan.com/address/${address}`,
  };
  return explorers[chainId] || '#';
};

// Retry function for failed transactions
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Validate contract address
export const isValidContractAddress = async (address, provider) => {
  try {
    if (!isValidAddress(address)) return false;
    
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    return false;
  }
};