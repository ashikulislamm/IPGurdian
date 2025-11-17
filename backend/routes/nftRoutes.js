import express from 'express';
import nftController from '../controllers/nftController.js';
import { auth } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import IP from '../models/IPModel.js';

const router = express.Router();

// Rate limiting
const mintRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 mints per 15 minutes
  message: {
    success: false,
    message: 'Too many minting attempts. Please wait before trying again.',
    retryAfter: '15 minutes'
  }
});

const tradingRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Max 30 trading actions per minute
  message: {
    success: false,
    message: 'Too many trading actions. Please slow down.',
    retryAfter: '1 minute'
  }
});

const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per minute
  message: {
    success: false,
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: '1 minute'
  }
});

// =================== PUBLIC ROUTES ===================

/**
 * GET /api/nft/test
 * Simple test endpoint to verify API connectivity
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'NFT API is working',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/nft/create-sample
 * Create simple sample data for testing
 */
router.post('/create-sample', async (req, res) => {
  try {
    const { createSimpleNFTSample } = await import('../utils/createSimpleSample.js');
    const result = await createSimpleNFTSample();
    
    res.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        user: result.user.name,
        ipsCreated: result.ips.length,
        nftsCreated: result.nfts.length
      }
    });
  } catch (error) {
    console.error('Create sample error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sample data',
      error: error.message
    });
  }
});

/**
 * POST /api/nft/create-mintable-ips
 * Create IP registrations ready for minting
 */
router.post('/create-mintable-ips', async (req, res) => {
  try {
    const { createMintableIPs } = await import('../utils/createMintableIPs.js');
    const result = await createMintableIPs();
    
    res.json({
      success: true,
      message: 'Mintable IP registrations created successfully',
      data: {
        user: result.user.name,
        mintableIPs: result.mintableIPs.length
      }
    });
  } catch (error) {
    console.error('Create mintable IPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mintable IP registrations',
      error: error.message
    });
  }
});

/**
 * POST /api/nft/prepare
 * Prepare NFT metadata from IP registration
 */
router.post('/prepare', auth, mintRateLimit, nftController.prepareNFTFromIP);

/**
 * POST /api/nft/complete-mint
 * Persist minted NFT after blockchain tx (or simulated mint)
 */
router.post('/complete-mint', auth, mintRateLimit, nftController.storeMintedNFT);

/**
 * POST /api/nft/fix-ip-eligibility
 * Fix existing IPs to make confirmed ones eligible for NFT minting
 */
router.post('/fix-ip-eligibility', async (req, res) => {
  try {
    const IP = (await import('../models/IPModel.js')).default;
    
    // Update all confirmed IPs that don't have NFTs to be eligible for minting
    const result = await IP.updateMany(
      { 
        status: 'confirmed',
        nftTokenId: { $exists: false },
        isEligibleForNFT: { $ne: true }
      },
      { 
        $set: { isEligibleForNFT: true }
      }
    );
    
    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} IP registrations to be eligible for NFT minting`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Fix IP eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix IP eligibility',
      error: error.message
    });
  }
});

/**
 * POST /api/nft/clear-sample-data
 * Clear all sample data to start fresh with real user data
 */
router.post('/clear-sample-data', async (req, res) => {
  try {
    const NFT = (await import('../models/NFTModel.js')).default;
    const User = (await import('../models/UserModel.js')).default;
    const IP = (await import('../models/IPModel.js')).default;
    
    // Clear sample NFTs
    await NFT.deleteMany({ tokenId: { $in: [101, 102, 103, 1, 2, 3, 4, 5] } });
    
    // Clear sample users
    await User.deleteMany({ email: { $in: ['nft@sample.com', 'sample@ipguardian.com'] } });
    
    // Clear sample IPs
    await IP.deleteMany({ creator: { $in: ['nft@sample.com', 'sample@ipguardian.com'] } });
    
    res.json({
      success: true,
      message: 'Sample data cleared successfully. Ready for real user data!'
    });
  } catch (error) {
    console.error('Clear sample data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear sample data',
      error: error.message
    });
  }
});

/**
 * POST /api/nft/seed-sample-data
 * Initialize database with sample NFT data for testing
 */
router.post('/seed-sample-data', async (req, res) => {
  try {
    const { seedNFTs } = await import('../utils/seedNFTs.js');
    const { seedIPs } = await import('../utils/seedIPs.js');
    
    // Seed both NFTs and IPs
    const [nfts, ipData] = await Promise.all([
      seedNFTs(),
      seedIPs()
    ]);
    
    res.json({
      success: true,
      message: `Successfully created ${nfts.length} sample NFTs and ${ipData.ips.length} sample IP registrations`,
      data: {
        nfts,
        ips: ipData.ips,
        sampleUser: ipData.user
      }
    });
  } catch (error) {
    console.error('Seed data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed sample data',
      error: error.message
    });
  }
});

/**
 * GET /api/nft/marketplace
 * Get marketplace NFTs with filtering and pagination
 * Query params: page, limit, category, minPrice, maxPrice, sortBy, creator, search, featured, verified
 */
router.get('/marketplace', 
  generalRateLimit,
  nftController.getMarketplaceNFTs
);

/**
 * GET /api/nft/stats/market
 * Get marketplace statistics and trends
 */
router.get('/stats/market', 
  generalRateLimit,
  async (req, res) => {
    try {
      const NFT = (await import('../models/NFTModel.js')).default;
      const NFTTransaction = (await import('../models/NFTTransactionModel.js')).default;
      
      // Get basic market stats
      const marketStats = await NFT.getMarketStats();
      
      // Get volume stats for different timeframes
      const [volume24h, volume7d, volume30d] = await Promise.all([
        NFTTransaction.getVolumeStats('24h'),
        NFTTransaction.getVolumeStats('7d'),
        NFTTransaction.getVolumeStats('30d')
      ]);

      // Get trending NFTs
      const trendingNFTs = await NFT.getTrendingNFTs(10);

      // Get top sales
      const topSales = await NFTTransaction.getTopSales('7d', 5);

      res.json({
        success: true,
        stats: {
          ...marketStats,
          volume: {
            '24h': volume24h,
            '7d': volume7d,
            '30d': volume30d
          },
          trending: trendingNFTs,
          topSales
        }
      });
    } catch (error) {
      console.error('❌ Market stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch market stats',
        error: error.message
      });
    }
  }
);

/**
 * GET /api/nft/featured
 * Get featured NFTs for homepage
 */
router.get('/featured', 
  generalRateLimit,
  async (req, res) => {
    try {
      const NFT = (await import('../models/NFTModel.js')).default;
      
      const featuredNFTs = await NFT.find({ 
        isListed: true,
        status: 'minted'
      })
        .sort({ views: -1, priceETH: -1 })
        .limit(parseInt(req.query.limit) || 8)
        .populate('creator', 'name username')
        .populate('currentOwner', 'name username');

      res.json({
        success: true,
        nfts: featuredNFTs,
        count: featuredNFTs.length
      });
    } catch (error) {
      console.error('❌ Featured NFTs error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured NFTs',
        error: error.message
      });
    }
  }
);

/**
 * GET /api/nft/:tokenId
 * Get detailed NFT information including pricing, history, and related NFTs
 */
router.get('/:tokenId', 
  generalRateLimit,
  nftController.getNFTByTokenId
);

/**
 * GET /api/nft/user/owned
 * Get NFTs owned by the authenticated user
 */
router.get('/user/owned',
  auth,
  nftController.getUserNFTs
);

/* TEMPORARILY COMMENTED OUT - MISSING CONTROLLER METHODS
router.post('/store-minted',
  mintRateLimit,
  auth,
  nftController.storeMintedNFT
);
*/

/**
 * POST /api/nft/:tokenId/favorite
 * Toggle favorite status for an NFT
 */
router.post('/:tokenId/favorite',
  auth,
  nftController.toggleFavorite
);

export default router;
