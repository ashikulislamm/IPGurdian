import { ethers } from 'ethers';

/**
 * Hash Utilities for IP Registration
 * 
 * These utilities implement the same hashing logic as the IPGurdian smart contract
 * to ensure consistency between on-chain and off-chain duplicate detection.
 */

/**
 * Generate content hash for IP registration
 * 
 * This hash is used for duplicate detection (AlreadyRegistered check).
 * The hash is deterministic - same content will always produce the same hash.
 * 
 * @param {Object} ipData - IP registration data
 * @param {string} ipData.title - IP title
 * @param {string} ipData.description - IP description
 * @param {string} ipData.ipType - Type of IP (copyright, patent, trademark, etc.)
 * @param {string} ipData.category - IP category
 * @param {string} ipData.creator - Creator wallet address
 * @param {Array} ipData.attachedFiles - Array of file IPFS hashes
 * @returns {string} - Keccak256 hash of the IP content
 */
export const generateIPContentHash = (ipData) => {
  // CRITICAL: Hash should ONLY include content, NOT creator/owner info
  // This ensures the same content produces the same hash regardless of who uploads it
  
  // Normalize whitespace: collapse multiple spaces/newlines into single space
  const normalizeWhitespace = (str) => {
    return str
      .replace(/\s+/g, ' ')  // Replace all whitespace (including newlines) with single space
      .trim()                 // Remove leading/trailing whitespace
      .toLowerCase();         // Normalize case
  };
  
  const contentData = {
    title: normalizeWhitespace(ipData.title),
    description: normalizeWhitespace(ipData.description),
    ipType: ipData.ipType.toLowerCase(),
    category: normalizeWhitespace(ipData.category),
    // Sort file hashes to ensure consistent ordering
    attachedFiles: (ipData.attachedFiles || [])
      .map(f => f.ipfsHash || f)
      .filter(h => h) // Remove empty values
      .sort()
  };
  
  return ethers.keccak256(
    ethers.toUtf8Bytes(JSON.stringify(contentData))
  );
};

/**
 * Generate NFT data hash for blockchain minting
 * 
 * This hash is used when calling the smart contract's registerAndMint function.
 * 
 * @param {Object} nftData - NFT metadata
 * @returns {string} - Keccak256 hash of the NFT data
 */
export const generateNFTDataHash = (nftData) => {
  // Normalize whitespace: collapse multiple spaces/newlines into single space
  const normalizeWhitespace = (str) => {
    return str
      .replace(/\s+/g, ' ')  // Replace all whitespace (including newlines) with single space
      .trim()                 // Remove leading/trailing whitespace
      .toLowerCase();         // Normalize case
  };
  
  // Content-only hash (no creator or timestamps)
  return ethers.keccak256(
    ethers.toUtf8Bytes(JSON.stringify({
      title: normalizeWhitespace(nftData.title),
      description: normalizeWhitespace(nftData.description),
      category: normalizeWhitespace(nftData.category),
      files: (nftData.files || []).filter(f => f).sort()
    }))
  );
};

/**
 * Verify if two IPs have the same content hash
 * 
 * @param {Object} ipData1 - First IP data
 * @param {Object} ipData2 - Second IP data
 * @returns {boolean} - True if hashes match (duplicate content)
 */
export const areIPsDuplicate = (ipData1, ipData2) => {
  const hash1 = generateIPContentHash(ipData1);
  const hash2 = generateIPContentHash(ipData2);
  return hash1 === hash2;
};

export default {
  generateIPContentHash,
  generateNFTDataHash,
  areIPsDuplicate
};
