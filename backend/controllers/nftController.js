import NFT from '../models/NFTModel.js';
import IP from '../models/IPModel.js';
import User from '../models/UserModel.js';
import NFTTransaction from '../models/NFTTransactionModel.js';
import TradingActivity from '../models/TradingActivityModel.js';
import ipfsService from '../services/ipfsService.js';
import web3Service from '../services/web3Service.js';
import pricingService from '../services/pricingService.js';
import { ethers } from 'ethers';

/**
 * Prepare NFT metadata from IP registration
 */
const prepareNFTFromIP = async (req, res) => {
  try {
    const { ipRegistrationId } = req.body;
    const userId = req.user.id;

    // Get IP registration with populated user data
    const ipData = await IP.findById(ipRegistrationId).populate('userId', 'name email');

    if (!ipData) {
      return res.status(404).json({
        success: false,
        message: 'IP registration not found'
      });
    }

    // Verify ownership
    if (ipData.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only mint NFTs from your own IP registrations'
      });
    }

    // Check if already minted
    if (ipData.nftTokenId) {
      return res.status(400).json({
        success: false,
        message: 'This IP has already been minted as an NFT'
      });
    }

    // Check if eligible
    if (!ipData.isEligibleForNFT || ipData.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'IP must be confirmed and eligible for NFT minting'
      });
    }

    // Generate NFT metadata
    const metadata = {
      name: ipData.title,
      description: ipData.description,
      image: ipData.attachedFiles && ipData.attachedFiles.length > 0
        ? `ipfs://${ipData.attachedFiles[0].ipfsHash}`
        : null,
      external_url: `https://ipguardian.com/nft/${ipData._id}`,
      attributes: [
        { trait_type: 'IP Type', value: ipData.ipType },
        { trait_type: 'Category', value: ipData.category },
        { trait_type: 'Creator', value: ipData.userId.name },
        { trait_type: 'Registration Date', value: ipData.registrationDate.toISOString().split('T')[0] }
      ],
      properties: {
        ipId: ipData._id.toString(),
        creator: ipData.userId.name,
        creatorEmail: ipData.userId.email,
        category: ipData.category,
        ipType: ipData.ipType,
        tags: ipData.tags
      }
    };

    // Add file information if available
    if (ipData.attachedFiles && ipData.attachedFiles.length > 0) {
      metadata.files = ipData.attachedFiles.map(file => ({
        name: file.name,
        hash: file.ipfsHash,
        size: file.size,
        mimetype: file.mimetype,
        description: file.description
      }));
    }

    // Upload metadata to IPFS
    const metadataResult = await ipfsService.uploadJSON(metadata);
    const tokenURI = `ipfs://${metadataResult.hash}`;

    // Create data hash for blockchain registration
    const dataHash = ethers.keccak256(
      ethers.toUtf8Bytes(JSON.stringify({
        title: ipData.title,
        description: ipData.description,
        category: ipData.category,
        creator: ipData.userId._id.toString(),
        registrationDate: ipData.registrationDate.toISOString(),
        files: ipData.attachedFiles?.map(f => f.ipfsHash) || []
      }))
    );

    // Calculate suggested pricing
    const tempNFT = {
      metadata,
      views: 0,
      favorites: 0,
      ipType: ipData.ipType,
      category: ipData.category
    };

    const pricing = pricingService.calculatePrice(
      ipData.ipType,
      ipData.category,
      metadata,
      { views: 0, favorites: 0 }
    );

    res.json({
      success: true,
      metadata,
      tokenURI,
      metadataHash: metadataResult.hash,
      dataHash,
      pricing,
      message: 'NFT metadata prepared successfully'
    });

  } catch (error) {
    console.error('NFT preparation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to prepare NFT metadata',
      error: error.message
    });
  }
};

/**
 * Get marketplace NFTs
 */
const getMarketplaceNFTs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      ipType,
      minPrice,
      maxPrice,
      sortBy = 'newest'
    } = req.query;

    // Build query
    const query = {
      isListed: true,
      status: 'active'
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (ipType && ipType !== 'all') {
      query.ipType = ipType;
    }

    if (minPrice || maxPrice) {
      query.priceETH = {};
      if (minPrice) query.priceETH.$gte = parseFloat(minPrice);
      if (maxPrice) query.priceETH.$lte = parseFloat(maxPrice);
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { mintedAt: -1 };
        break;
      case 'oldest':
        sort = { mintedAt: 1 };
        break;
      case 'price-low':
        sort = { priceETH: 1 };
        break;
      case 'price-high':
        sort = { priceETH: -1 };
        break;
      case 'popular':
        sort = { views: -1, favorites: -1 };
        break;
      default:
        sort = { mintedAt: -1 };
    }

    const skip = (page - 1) * limit;

    const [nfts, total] = await Promise.all([
      NFT.find(query)
        .populate('creator', 'name username email')
        .populate('owner', 'name username email')
        .populate('ipRegistration', 'title description category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      NFT.countDocuments(query)
    ]);

    res.json({
      success: true,
      nfts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNFTs: total,
        hasMore: skip + nfts.length < total
      }
    });

  } catch (error) {
    console.error('Get marketplace NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace NFTs',
      error: error.message
    });
  }
};

/**
 * Get NFT by token ID
 */
const getNFTByTokenId = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const nft = await NFT.findOne({ tokenId: parseInt(tokenId) })
      .populate('creator', 'name username email')
      .populate('owner', 'name username email')
      .populate('ipRegistration', 'title description category ipType registrationDate');

    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    // Increment views
    await nft.incrementViews();

    res.json({
      success: true,
      nft
    });

  } catch (error) {
    console.error('Get NFT by token ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT details',
      error: error.message
    });
  }
};

/**
 * Get user's NFTs
 */
const getUserNFTs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const [nfts, total] = await Promise.all([
      NFT.find({ owner: userId })
        .populate('creator', 'name username email')
        .populate('ipRegistration', 'title description category')
        .sort({ mintedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      NFT.countDocuments({ owner: userId })
    ]);

    res.json({
      success: true,
      nfts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNFTs: total
      }
    });

  } catch (error) {
    console.error('Get user NFTs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user NFTs',
      error: error.message
    });
  }
};

/**
 * Toggle NFT favorite
 */
const toggleFavorite = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { increment } = req.body;

    const nft = await NFT.findOne({ tokenId: parseInt(tokenId) });

    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    await nft.toggleFavorite(increment);

    res.json({
      success: true,
      favorites: nft.favorites,
      message: increment ? 'Added to favorites' : 'Removed from favorites'
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite',
      error: error.message
    });
  }
};

/**
 * Store minted NFT after blockchain transaction (or simulated mint)
 */
const storeMintedNFT = async (req, res) => {
  try {
    const { ipRegistrationId, metadata, tokenURI, metadataHash, dataHash, priceETH } = req.body;
    const userId = req.user.id;

    // Validate IP registration
    const ipData = await IP.findById(ipRegistrationId);
    if (!ipData) {
      return res.status(404).json({ success: false, message: 'IP registration not found' });
    }

    if (ipData.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not owner of this IP registration' });
    }

    if (ipData.nftTokenId) {
      return res.status(400).json({ success: false, message: 'This IP is already minted as an NFT' });
    }

    if (!ipData.isEligibleForNFT || ipData.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'IP not eligible for minting' });
    }

    // Determine next tokenId
    const lastNFT = await NFT.findOne().sort({ tokenId: -1 });
    const nextTokenId = lastNFT ? lastNFT.tokenId + 1 : 1;

    // Ensure required metadata pieces
    const finalMetadata = metadata || {
      name: ipData.title,
      description: ipData.description,
      attributes: [
        { trait_type: 'IP Type', value: ipData.ipType },
        { trait_type: 'Category', value: ipData.category },
        { trait_type: 'Creator', value: req.user.name }
      ]
    };
    const finalTokenURI = tokenURI || 'ipfs://placeholder';
    const finalMetadataHash = metadataHash || ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(finalMetadata)));
    const finalDataHash = dataHash || finalMetadataHash;

    const nftDoc = await NFT.create({
      tokenId: nextTokenId,
      title: ipData.title,
      description: ipData.description,
      creator: userId,
      owner: userId,
      tokenURI: finalTokenURI,
      metadataHash: finalMetadataHash.replace('0x',''),
      metadata: finalMetadata,
      ipRegistration: ipRegistrationId,
      isListed: true,
      currentPrice: (priceETH || 0.1).toString(),
      priceETH: priceETH || 0.1,
      marketValue: (priceETH || 0.1) * 2,
      category: ipData.category,
      ipType: ipData.ipType,
      views: 0,
      favorites: 0,
      status: 'active',
      isFeatured: false,
      isVerified: true,
      mintedAt: new Date(),
      listedAt: new Date()
    });

    // Link back to IP
    ipData.isEligibleForNFT = false;
    ipData.nftTokenId = nftDoc._id;
    await ipData.save();

    const populated = await NFT.findById(nftDoc._id)
      .populate('creator','name email')
      .populate('owner','name email')
      .populate('ipRegistration','title ipType category');

    res.json({
      success: true,
      message: 'NFT stored successfully',
      nft: populated
    });
  } catch (error) {
    console.error('Store minted NFT error:', error);
    res.status(500).json({ success: false, message: 'Failed to store minted NFT', error: error.message });
  }
};

/**
 * Get NFT ready IPs for current user
 */
const getNFTReadyIPs = async (req, res) => {
  try {
    const ips = await IP.find({
      userId: req.user.id,
      status: 'confirmed',
      isEligibleForNFT: true,
      nftTokenId: { $in: [null, undefined] }
    }).select('title description ipType category registrationDate transactionHash');
    res.json({ success: true, ips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch NFT-ready IPs', error: error.message });
  }
};

export default {
  prepareNFTFromIP,
  storeMintedNFT,
  getMarketplaceNFTs,
  getNFTByTokenId,
  getUserNFTs,
  toggleFavorite,
  getNFTReadyIPs
};