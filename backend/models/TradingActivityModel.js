import mongoose from 'mongoose';

const TradingActivitySchema = new mongoose.Schema({
  // Activity Type
  type: {
    type: String,
    enum: ['ip_listed', 'ip_unlisted', 'ip_sold', 'ip_transferred', 'nft_minted', 'nft_listed', 'nft_unlisted', 'nft_sold'],
    required: true
  },

  // IP/NFT Reference
  ipRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IP',
    default: null
  },
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    default: null
  },

  // Parties Involved
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Trading Details
  price: {
    type: String,
    default: '0'
  },
  priceETH: {
    type: Number,
    default: 0
  },

  // Blockchain Information
  transactionHash: {
    type: String,
    default: null
  },
  blockNumber: {
    type: Number,
    default: null
  },

  // Activity Description
  description: {
    type: String,
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
TradingActivitySchema.index({ user: 1, createdAt: -1 });
TradingActivitySchema.index({ type: 1 });
TradingActivitySchema.index({ ipRegistration: 1 });
TradingActivitySchema.index({ nft: 1 });
TradingActivitySchema.index({ status: 1 });
TradingActivitySchema.index({ createdAt: -1 });

// Static method to get user activity
TradingActivitySchema.statics.getUserActivity = async function(userId, limit = 20) {
  return this.find({
    $or: [
      { user: userId },
      { fromUser: userId },
      { toUser: userId }
    ]
  })
    .populate('ipRegistration', 'title category')
    .populate('nft', 'title tokenId')
    .populate('user', 'name username')
    .populate('fromUser', 'name username')
    .populate('toUser', 'name username')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get IP activity
TradingActivitySchema.statics.getIPActivity = async function(ipId) {
  return this.find({ ipRegistration: ipId })
    .populate('user', 'name username')
    .populate('fromUser', 'name username')
    .populate('toUser', 'name username')
    .sort({ createdAt: -1 });
};

// Static method to get NFT activity
TradingActivitySchema.statics.getNFTActivity = async function(nftId) {
  return this.find({ nft: nftId })
    .populate('user', 'name username')
    .populate('fromUser', 'name username')
    .populate('toUser', 'name username')
    .sort({ createdAt: -1 });
};

// Static method to get recent marketplace activity
TradingActivitySchema.statics.getRecentActivity = async function(limit = 10) {
  return this.find({
    type: { $in: ['ip_sold', 'nft_sold', 'nft_minted'] },
    status: 'completed'
  })
    .populate('ipRegistration', 'title category')
    .populate('nft', 'title tokenId')
    .populate('user', 'name username')
    .populate('fromUser', 'name username')
    .populate('toUser', 'name username')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const TradingActivity = mongoose.model('TradingActivity', TradingActivitySchema);

export default TradingActivity;
