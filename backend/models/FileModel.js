import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  // File identification
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  
  sanitizedName: {
    type: String,
    required: true,
    trim: true
  },
  
  // IPFS information
  ipfsHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  gatewayUrl: {
    type: String,
    required: true
  },
  
  publicGatewayUrls: [{
    type: String
  }],
  
  // File metadata
  mimetype: {
    type: String,
    required: true
  },
  
  extension: {
    type: String,
    required: true,
    lowercase: true
  },
  
  size: {
    type: Number,
    required: true,
    min: 0
  },
  
  category: {
    type: String,
    required: true,
    enum: ['images', 'documents', 'audio', 'video', 'archives', 'code', 'unknown'],
    default: 'unknown'
  },
  
  // Security and integrity
  fileHash: {
    type: String,
    required: true,
    index: true // SHA-256 hash for integrity verification
  },
  
  isEncrypted: {
    type: Boolean,
    default: false
  },
  
  encryptionKey: {
    type: String,
    select: false // Don't include in queries by default
  },
  
  // IPFS pinning status
  isPinned: {
    type: Boolean,
    default: true
  },
  
  pinningService: {
    type: String,
    default: 'local'
  },
  
  // Thumbnails and processed versions
  thumbnailHash: {
    type: String,
    default: null
  },
  
  processedVersions: [{
    version: String, // 'compressed', 'resized', etc.
    ipfsHash: String,
    size: Number,
    description: String
  }],
  
  // IP Registration association
  ipRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IP',
    required: false,  // Made optional to allow standalone file uploads
    default: null,
    index: true
  },
  
  // User who uploaded the file
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Access control
  isPublic: {
    type: Boolean,
    default: false
  },
  
  accessLevel: {
    type: String,
    enum: ['private', 'protected', 'public'],
    default: 'private'
  },
  
  allowedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Usage tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  
  lastAccessed: {
    type: Date,
    default: null
  },
  
  // Marketplace information (if file is for sale/license)
  isMarketplaceItem: {
    type: Boolean,
    default: false
  },
  
  licenseType: {
    type: String,
    enum: ['none', 'view', 'download', 'commercial', 'exclusive'],
    default: 'none'
  },
  
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // File status and verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed', 'removed'],
    default: 'pending'
  },
  
  verificationDetails: {
    timestamp: Date,
    blockchainTxHash: String,
    verificationNotes: String
  },
  
  // Metadata for different file types
  mediaMetadata: {
    // For images
    dimensions: {
      width: Number,
      height: Number
    },
    
    // For audio/video
    duration: Number,
    
    // For documents
    pageCount: Number,
    
    // For code files
    language: String,
    
    // General properties
    author: String,
    title: String,
    description: String,
    keywords: [String],
    createdDate: Date
  },
  
  // System fields
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  lastModified: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Backup and redundancy
  backupLocations: [{
    service: String, // 'pinata', 'infura', etc.
    hash: String,
    url: String,
    status: String
  }]
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
fileSchema.index({ uploadedBy: 1, uploadDate: -1 });
fileSchema.index({ ipRegistration: 1, category: 1 });
fileSchema.index({ category: 1, isPublic: 1 });
fileSchema.index({ verificationStatus: 1, isActive: 1 });
fileSchema.index({ isMarketplaceItem: 1, price: 1 });

// Virtual for file size in human readable format
fileSchema.virtual('humanReadableSize').get(function() {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (this.size === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.size) / Math.log(1024));
  return Math.round(this.size / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for full IPFS URL
fileSchema.virtual('fullIpfsUrl').get(function() {
  return `ipfs://${this.ipfsHash}`;
});

// Pre-save middleware
fileSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Methods
fileSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

fileSchema.methods.updatePinningStatus = function(isPinned, service = 'local') {
  this.isPinned = isPinned;
  this.pinningService = service;
  return this.save();
};

fileSchema.methods.addProcessedVersion = function(version, ipfsHash, size, description) {
  this.processedVersions.push({
    version,
    ipfsHash,
    size,
    description
  });
  return this.save();
};

fileSchema.methods.setMarketplaceInfo = function(licenseType, price) {
  this.isMarketplaceItem = true;
  this.licenseType = licenseType;
  this.price = price;
  this.isPublic = true;
  this.accessLevel = 'public';
  return this.save();
};

// Statics
fileSchema.statics.findByUser = function(userId, options = {}) {
  const query = { uploadedBy: userId, isActive: true };
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.isPublic !== undefined) {
    query.isPublic = options.isPublic;
  }
  
  return this.find(query)
    .populate('ipRegistration', 'title registrationNumber')
    .sort({ uploadDate: -1 })
    .limit(options.limit || 50);
};

fileSchema.statics.findByIPRegistration = function(ipId) {
  return this.find({ 
    ipRegistration: ipId, 
    isActive: true 
  }).sort({ uploadDate: -1 });
};

fileSchema.statics.findPublicFiles = function(options = {}) {
  const query = { 
    isPublic: true, 
    isActive: true,
    verificationStatus: 'verified'
  };
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.isMarketplaceItem !== undefined) {
    query.isMarketplaceItem = options.isMarketplaceItem;
  }
  
  return this.find(query)
    .populate('uploadedBy', 'username')
    .populate('ipRegistration', 'title registrationNumber')
    .sort({ uploadDate: -1 })
    .limit(options.limit || 20);
};

const File = mongoose.model('File', fileSchema);

export default File;