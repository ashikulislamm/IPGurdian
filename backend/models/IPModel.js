import mongoose from "mongoose";

const IPSchema = new mongoose.Schema(
  {
    // IP Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    ipType: {
      type: String,
      required: true,
      enum: ["copyright", "trademark", "patent", "design", "trade-secret"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: String,
      default: "",
    },

    // User Information
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creator: {
      type: String, // Wallet address
      required: true,
    },

    // Blockchain Information
    transactionHash: {
      type: String,
      default: null,
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    gasUsed: {
      type: String,
      default: null,
    },
    ipId: {
      type: String, // Smart contract IP ID
      default: null,
    },

    // File Information (Legacy - for backward compatibility)
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    fileHash: {
      type: String,
      default: null,
    },

    // IPFS Files (New - multiple files support)
    attachedFiles: [{
      name: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      mimetype: {
        type: String,
        required: true,
      },
      ipfsHash: {
        type: String,
        required: true,
      },
      thumbnailHash: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      }
    }],

    // Status and Settings
    isPublic: {
      type: Boolean,
      default: false,
    },
    // NFT Eligibility & Linkage
    isEligibleForNFT: {
      type: Boolean,
      default: false,
    },
    nftTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NFT',
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },

    // Metadata
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
IPSchema.index({ userId: 1, registrationDate: -1 });
IPSchema.index({ creator: 1 });
IPSchema.index({ transactionHash: 1 });
IPSchema.index({ ipId: 1 });
// CRITICAL: Unique index on fileHash to prevent duplicate content registration (AlreadyRegistered)
// This ensures that the same content cannot be registered twice, regardless of who uploads it
IPSchema.index({ fileHash: 1 }, { unique: true, sparse: true, name: 'unique_content_hash' });

// Virtual for formatted registration date
IPSchema.virtual("formattedDate").get(function () {
  return this.registrationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Method to get IP summary
IPSchema.methods.getSummary = function () {
  return {
    id: this._id,
    title: this.title,
    ipType: this.ipType,
    category: this.category,
    status: this.status,
    registrationDate: this.registrationDate,
    formattedDate: this.formattedDate,
    isPublic: this.isPublic,
    transactionHash: this.transactionHash,
  };
};

export default mongoose.model("IP", IPSchema);
