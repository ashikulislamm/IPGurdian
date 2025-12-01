import mongoose from 'mongoose';

const NFTTransactionSchema = new mongoose.Schema({
  // NFT Reference
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: true
  },
  tokenId: {
    type: Number,
    required: true
  },

  // Transaction Type
  type: {
    type: String,
    enum: ['mint', 'list', 'unlist', 'buy', 'transfer', 'burn'],
    required: true
  },

  // Parties Involved
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Blockchain Information
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  gasUsed: {
    type: String,
    default: '0'
  },
  gasPrice: {
    type: String,
    default: '0'
  },

  // Price Information
  price: {
    type: String,
    default: '0'
  },
  priceETH: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'confirmed'
  },

  // Additional Info
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
// Note: transactionHash already has unique index from schema definition
NFTTransactionSchema.index({ nft: 1, createdAt: -1 });
NFTTransactionSchema.index({ tokenId: 1 });
NFTTransactionSchema.index({ from: 1 });
NFTTransactionSchema.index({ to: 1 });
NFTTransactionSchema.index({ type: 1 });
NFTTransactionSchema.index({ createdAt: -1 });

// Static method to get transaction history for NFT
NFTTransactionSchema.statics.getNFTHistory = async function(tokenId) {
  return this.find({ tokenId })
    .populate('from', 'name username')
    .populate('to', 'name username')
    .sort({ createdAt: -1 });
};

// Static method to get user transaction history
NFTTransactionSchema.statics.getUserHistory = async function(userId) {
  return this.find({
    $or: [
      { from: userId },
      { to: userId }
    ]
  })
    .populate('nft', 'title tokenId')
    .populate('from', 'name username')
    .populate('to', 'name username')
    .sort({ createdAt: -1 });
};

// Static method to get volume stats
NFTTransactionSchema.statics.getVolumeStats = async function(timeframe) {
  const now = new Date();
  let startDate;
  
  switch(timeframe) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  const result = await this.aggregate([
    {
      $match: {
        type: 'buy',
        status: 'confirmed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalVolume: { $sum: { $toDouble: '$priceETH' } },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  return result[0] || { totalVolume: 0, transactionCount: 0 };
};

// Static method to get top sales
NFTTransactionSchema.statics.getTopSales = async function(timeframe, limit = 10) {
  const now = new Date();
  let startDate;
  
  switch(timeframe) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return this.find({
    type: 'buy',
    status: 'confirmed',
    createdAt: { $gte: startDate }
  })
    .populate('nft', 'title tokenId metadata')
    .populate('from', 'name username')
    .populate('to', 'name username')
    .sort({ priceETH: -1 })
    .limit(limit);
};

const NFTTransaction = mongoose.model('NFTTransaction', NFTTransactionSchema);

export default NFTTransaction;
