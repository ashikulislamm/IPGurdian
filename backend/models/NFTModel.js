import mongoose from 'mongoose';

const NFTSchema = new mongoose.Schema({
  // Basic NFT Information
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Ownership
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // IPFS & Metadata
  tokenURI: {
    type: String,
    required: true
  },
  metadataHash: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // IP Registration Link
  ipRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IP',
    required: true
  },
  
  // Marketplace Information
  isListed: {
    type: Boolean,
    default: true
  },
  currentPrice: {
    type: String,
    default: '0'
  },
  priceETH: {
    type: Number,
    default: 0
  },
  marketValue: {
    type: Number,
    default: 0
  },
  
  // Category & Type
  category: {
    type: String,
    required: true
  },
  ipType: {
    type: String,
    required: true,
    enum: ['copyright', 'trademark', 'patent', 'design', 'trade-secret']
  },
  
  // Trading Information
  lastSalePrice: {
    type: String,
    default: '0'
  },
  totalSales: {
    type: Number,
    default: 0
  },
  royaltyPercentage: {
    type: Number,
    default: 5,
    min: 0,
    max: 50
  },
  
  // Blockchain Information
  mintTransaction: {
    type: String,
    default: null
  },
  mintBlock: {
    type: Number,
    default: null
  },
  listTransaction: {
    type: String,
    default: null
  },
  
  // Engagement Metrics
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'burned', 'locked'],
    default: 'active'
  },
  
  // Featured/Verified
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  mintedAt: {
    type: Date,
    default: Date.now
  },
  listedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
// Note: tokenId already has unique index from schema definition
NFTSchema.index({ owner: 1 });
NFTSchema.index({ creator: 1 });
NFTSchema.index({ isListed: 1, status: 1 });
NFTSchema.index({ category: 1 });
NFTSchema.index({ ipType: 1 });
NFTSchema.index({ priceETH: 1 });
NFTSchema.index({ views: -1 });
NFTSchema.index({ mintedAt: -1 });
NFTSchema.index({ ipRegistration: 1 });

// Virtual for formatted price
NFTSchema.virtual('formattedPrice').get(function() {
  return `${this.priceETH.toFixed(3)} ETH`;
});

// Static method to get market statistics
NFTSchema.statics.getMarketStats = async function() {
  const stats = await this.aggregate([
    {
      $match: { isListed: true, status: 'active' }
    },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: '$priceETH' },
        avgPrice: { $avg: '$priceETH' },
        totalNFTs: { $sum: 1 },
        minPrice: { $min: '$priceETH' },
        maxPrice: { $max: '$priceETH' }
      }
    }
  ]);
  
  return stats[0] || {
    totalVolume: 0,
    avgPrice: 0,
    totalNFTs: 0,
    minPrice: 0,
    maxPrice: 0
  };
};

// Static method to get trending NFTs
NFTSchema.statics.getTrendingNFTs = async function(limit = 10) {
  return this.find({ isListed: true, status: 'active' })
    .sort({ views: -1, favorites: -1 })
    .limit(limit)
    .populate('owner', 'name username')
    .populate('creator', 'name username');
};

// Static method to get featured NFTs
NFTSchema.statics.getFeaturedNFTs = async function(limit = 6) {
  return this.find({ isListed: true, status: 'active', isFeatured: true })
    .sort({ mintedAt: -1 })
    .limit(limit)
    .populate('owner', 'name username')
    .populate('creator', 'name username');
};

// Instance method to increment views
NFTSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle favorite
NFTSchema.methods.toggleFavorite = function(increment = true) {
  this.favorites += increment ? 1 : -1;
  if (this.favorites < 0) this.favorites = 0;
  return this.save();
};

const NFT = mongoose.model('NFT', NFTSchema);

export default NFT;
