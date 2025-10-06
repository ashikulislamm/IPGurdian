import IP from '../models/IPModel.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';

// Register a new IP
const registerIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      ipType,
      category,
      tags,
      creator,
      transactionHash,
      blockNumber,
      gasUsed,
      ipId,
      fileName,
      fileSize,
      fileHash,
      isPublic
    } = req.body;

    // Validate required fields
    if (!title || !description || !ipType || !category || !creator) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, ipType, category, creator'
      });
    }

    // Create new IP record
    const newIP = new IP({
      title: title.trim(),
      description: description.trim(),
      ipType,
      category: category.trim(),
      tags: tags || '',
      userId,
      creator,
      transactionHash: transactionHash || null,
      blockNumber: blockNumber || null,
      gasUsed: gasUsed || null,
      ipId: ipId || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      fileHash: fileHash || null,
      isPublic: isPublic || false,
      status: transactionHash ? 'confirmed' : 'pending'
    });

    await newIP.save();

    res.status(201).json({
      success: true,
      message: 'IP registered successfully',
      data: {
        id: newIP._id,
        title: newIP.title,
        ipType: newIP.ipType,
        status: newIP.status,
        registrationDate: newIP.registrationDate,
        transactionHash: newIP.transactionHash
      }
    });

  } catch (error) {
    console.error('Error registering IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register IP'
    });
  }
};

// Get all IPs for a user
const getUserIPs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, ipType, search } = req.query;

    // Build filter
    const filter = { userId };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (ipType && ipType !== 'all') {
      filter.ipType = ipType;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get IPs with pagination
    const ips = await IP.find(filter)
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await IP.countDocuments(filter);

    // Format response
    const formattedIPs = ips.map(ip => ({
      id: ip._id,
      title: ip.title,
      description: ip.description.substring(0, 150) + (ip.description.length > 150 ? '...' : ''),
      ipType: ip.ipType,
      category: ip.category,
      status: ip.status,
      isPublic: ip.isPublic,
      registrationDate: ip.registrationDate,
      formattedDate: ip.registrationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      transactionHash: ip.transactionHash,
      blockNumber: ip.blockNumber,
      ipId: ip.ipId
    }));

    res.json({
      success: true,
      data: {
        ips: formattedIPs,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: formattedIPs.length,
          totalIPs: total
        }
      }
    });

  } catch (error) {
    console.error('Error getting user IPs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve IPs'
    });
  }
};

// Get single IP details
const getIPDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ip = await IP.findOne({ _id: id, userId }).lean();

    if (!ip) {
      return res.status(404).json({
        success: false,
        error: 'IP not found'
      });
    }

    // Format detailed response
    const detailedIP = {
      id: ip._id,
      title: ip.title,
      description: ip.description,
      ipType: ip.ipType,
      category: ip.category,
      tags: ip.tags,
      creator: ip.creator,
      status: ip.status,
      isPublic: ip.isPublic,
      registrationDate: ip.registrationDate,
      lastUpdated: ip.lastUpdated,
      formattedDate: ip.registrationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      blockchain: {
        transactionHash: ip.transactionHash,
        blockNumber: ip.blockNumber,
        gasUsed: ip.gasUsed,
        ipId: ip.ipId
      },
      file: {
        name: ip.fileName,
        size: ip.fileSize,
        hash: ip.fileHash
      }
    };

    res.json({
      success: true,
      data: detailedIP
    });

  } catch (error) {
    console.error('Error getting IP details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve IP details'
    });
  }
};

// Update IP status (for blockchain confirmations)
const updateIPStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, transactionHash, blockNumber, gasUsed, ipId } = req.body;

    const ip = await IP.findOne({ _id: id, userId });

    if (!ip) {
      return res.status(404).json({
        success: false,
        error: 'IP not found'
      });
    }

    // Update fields
    if (status) ip.status = status;
    if (transactionHash) ip.transactionHash = transactionHash;
    if (blockNumber) ip.blockNumber = blockNumber;
    if (gasUsed) ip.gasUsed = gasUsed;
    if (ipId) ip.ipId = ipId;
    
    ip.lastUpdated = new Date();

    await ip.save();

    res.json({
      success: true,
      message: 'IP updated successfully',
      data: ip.getSummary()
    });

  } catch (error) {
    console.error('Error updating IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update IP'
    });
  }
};

// Delete IP
const deleteIP = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ip = await IP.findOneAndDelete({ _id: id, userId });

    if (!ip) {
      return res.status(404).json({
        success: false,
        error: 'IP not found'
      });
    }

    res.json({
      success: true,
      message: 'IP deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting IP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete IP'
    });
  }
};

// Get IP statistics for user
const getIPStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await IP.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
          },
          public: {
            $sum: { $cond: ["$isPublic", 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      confirmed: 0,
      pending: 0,
      failed: 0,
      public: 0
    };

    // Get type breakdown
    const typeStats = await IP.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$ipType",
          count: { $sum: 1 }
        }
      }
    ]);

    const typeBreakdown = {};
    typeStats.forEach(stat => {
      typeBreakdown[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        overview: result,
        byType: typeBreakdown
      }
    });

  } catch (error) {
    console.error('Error getting IP stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
};

// Get user statistics for profile page
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔍 Getting user stats for userId:', userId);

    // Get basic IP statistics
    const stats = await IP.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalIPs: { $sum: 1 },
          confirmedIPs: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
          },
          pendingIPs: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          failedIPs: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
          }
        }
      }
    ]);

    console.log('📊 Raw stats from database:', stats);

    const result = stats[0] || {
      totalIPs: 0,
      confirmedIPs: 0,
      pendingIPs: 0,
      failedIPs: 0
    };

    console.log('📈 Processed result:', result);

    // For now, transferredIPs will be 0 since we don't have transfer functionality yet
    // This can be updated later when transfer functionality is implemented
    const transferredIPs = 0;

    const responseData = {
      success: true,
      totalIPs: result.totalIPs,
      confirmedIPs: result.confirmedIPs,
      pendingIPs: result.pendingIPs,
      failedIPs: result.failedIPs,
      transferredIPs: transferredIPs
    };

    console.log('✅ Sending response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user statistics'
    });
  }
};

export {
  registerIP,
  getUserIPs,
  getIPDetails,
  updateIPStatus,
  deleteIP,
  getIPStats,
  getUserStats
};