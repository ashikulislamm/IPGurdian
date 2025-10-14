import express from 'express';
import fileController from '../controllers/fileController.js';
import { 
  uploadSingle, 
  uploadMultiple, 
  validateUploadedFile, 
  validateUploadedFiles,
  handleUploadError 
} from '../middlewares/upload.js';
import { auth } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit'; //auth

const router = express.Router();

// Rate limiting for file uploads
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 upload requests per windowMs
  message: {
    success: false,
    message: 'Too many upload attempts, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for downloads
const downloadRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 download requests per minute
  message: {
    success: false,
    message: 'Too many download attempts, please try again later',
    retryAfter: '1 minute'
  }
});

// Test IPFS connection (public endpoint)
router.get('/test', fileController.testConnection);

// Upload single file
router.post('/upload',
  uploadRateLimit,
  auth,
  uploadSingle('file'),
  validateUploadedFile,
  fileController.uploadSingleFile,
  handleUploadError
);

// Upload multiple files
router.post('/upload-multiple',
  uploadRateLimit,
  auth,
  uploadMultiple('files', 10), // Max 10 files
  validateUploadedFiles,
  fileController.uploadMultipleFiles,
  handleUploadError
);

// Get file by IPFS hash
router.get('/:hash',
  downloadRateLimit,
  (req, res, next) => {
    // Optional authentication - will set req.user if token is valid
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      // Import and use auth middleware
      import('../middlewares/authMiddleware.js').then(({ auth }) => {
        auth(req, res, (err) => {
          if (err) {
            // Continue without authentication if token is invalid
            req.user = null;
          }
          next();
        });
      });
    } else {
      next();
    }
  },
  fileController.getFile
);

// Get file information by IPFS hash
router.get('/:hash/info',
  (req, res, next) => {
    // Optional authentication
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      import('../middlewares/authMiddleware.js').then(({ auth }) => {
        auth(req, res, (err) => {
          if (err) {
            req.user = null;
          }
          next();
        });
      });
    } else {
      next();
    }
  },
  fileController.getFileInfo
);

// Get current user's files (requires authentication)
router.get('/user/files',
  auth,
  fileController.getUserFiles
);

// Get public files (marketplace)
router.get('/public/files',
  fileController.getPublicFiles
);

// Get public files for a specific IP (no authentication required)
router.get('/public/ip/:ipId/files',
  async (req, res) => {
    try {
      const { ipId } = req.params;
      
      // Import File model
      const { default: File } = await import('../models/FileModel.js');
      
      // Find only public files for this IP registration
      const files = await File.find({ 
        ipRegistration: ipId,
        isPublic: true,
        isActive: true 
      });
      
      res.json({
        success: true,
        files: files.map(file => ({
          id: file._id,
          name: file.originalName,
          ipfsHash: file.ipfsHash,
          gatewayUrl: file.gatewayUrl,
          size: file.humanReadableSize,
          sizeBytes: file.size,
          category: file.category,
          mimetype: file.mimetype,
          uploadDate: file.uploadDate,
          downloadCount: file.downloadCount,
          thumbnailHash: file.thumbnailHash,
          uploadedBy: 'User',
          description: file.mediaMetadata?.description || ''
        }))
      });
      
    } catch (error) {
      console.error('❌ Get public IP files failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get IP files',
        error: error.message
      });
    }
  }
);

// Delete file (requires authentication and ownership)
router.delete('/:hash',
  auth,
  fileController.deleteFile
);

// Get files by IP registration (requires authentication)
router.get('/ip/:ipId/files',
  auth,
  async (req, res) => {
    try {
      const { ipId } = req.params;
      const userId = req.user._id;
      
      // Import File model
      const { default: File } = await import('../models/FileModel.js');
      
      // Find files for this IP registration
      const files = await File.find({ 
        ipRegistration: ipId,
        isActive: true 
      }).populate('uploadedBy', 'username');
      
      // Filter files based on access permissions
      const accessibleFiles = files.filter(file => 
        file.isPublic || 
        file.uploadedBy._id.toString() === userId ||
        file.allowedUsers.includes(userId)
      );
      
      res.json({
        success: true,
        files: accessibleFiles.map(file => ({
          id: file._id,
          name: file.originalName,
          ipfsHash: file.ipfsHash,
          gatewayUrl: file.gatewayUrl,
          size: file.humanReadableSize,
          category: file.category,
          uploadDate: file.uploadDate,
          downloadCount: file.downloadCount,
          thumbnailHash: file.thumbnailHash,
          isPublic: file.isPublic,
          uploadedBy: file.uploadedBy.username
        }))
      });
      
    } catch (error) {
      console.error('❌ Get IP files failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get IP files',
        error: error.message
      });
    }
  }
);

// Update file visibility (public/private)
router.patch('/:hash/visibility',
  auth,
  async (req, res) => {
    try {
      const { hash } = req.params;
      const { isPublic } = req.body;
      const userId = req.user.userId;
      
      // Import File model
      const { default: File } = await import('../models/FileModel.js');
      
      const fileRecord = await File.findOne({ 
        ipfsHash: hash,
        uploadedBy: userId,
        isActive: true 
      });
      
      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found or access denied'
        });
      }
      
      fileRecord.isPublic = isPublic;
      fileRecord.accessLevel = isPublic ? 'public' : 'private';
      fileRecord.lastModified = new Date();
      
      await fileRecord.save();
      
      res.json({
        success: true,
        message: `File visibility updated to ${isPublic ? 'public' : 'private'}`,
        file: {
          id: fileRecord._id,
          name: fileRecord.originalName,
          isPublic: fileRecord.isPublic,
          accessLevel: fileRecord.accessLevel
        }
      });
      
    } catch (error) {
      console.error('❌ Update file visibility failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update file visibility',
        error: error.message
      });
    }
  }
);

// Get file statistics for user
router.get('/user/stats',
  auth,
  async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Import File model
      const { default: File } = await import('../models/FileModel.js');
      
      // Get file statistics
      const stats = await File.aggregate([
        {
          $match: {
            uploadedBy: userId,
            isActive: true
          }
        },
        {
          $group: {
            _id: null,
            totalFiles: { $sum: 1 },
            totalSize: { $sum: '$size' },
            totalDownloads: { $sum: '$downloadCount' },
            publicFiles: {
              $sum: { $cond: ['$isPublic', 1, 0] }
            },
            privateFiles: {
              $sum: { $cond: ['$isPublic', 0, 1] }
            }
          }
        }
      ]);
      
      // Get category breakdown
      const categoryStats = await File.aggregate([
        {
          $match: {
            uploadedBy: userId,
            isActive: true
          }
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSize: { $sum: '$size' }
          }
        }
      ]);
      
      const result = stats[0] || {
        totalFiles: 0,
        totalSize: 0,
        totalDownloads: 0,
        publicFiles: 0,
        privateFiles: 0
      };
      
      // Format total size
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      let sizeIndex = 0;
      let formattedSize = result.totalSize;
      
      while (formattedSize >= 1024 && sizeIndex < sizes.length - 1) {
        formattedSize /= 1024;
        sizeIndex++;
      }
      
      res.json({
        success: true,
        stats: {
          ...result,
          formattedTotalSize: `${Math.round(formattedSize * 100) / 100} ${sizes[sizeIndex]}`,
          categoryBreakdown: categoryStats.reduce((acc, cat) => {
            acc[cat._id] = {
              count: cat.count,
              totalSize: cat.totalSize
            };
            return acc;
          }, {})
        }
      });
      
    } catch (error) {
      console.error('❌ Get file stats failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get file statistics',
        error: error.message
      });
    }
  }
);

// Search files
router.get('/search/:query',
  auth,
  async (req, res) => {
    try {
      const { query } = req.params;
      const { category, isPublic, limit = 20 } = req.query;
      const userId = req.user.userId;
      
      // Import File model
      const { default: File } = await import('../models/FileModel.js');
      
      const searchQuery = {
        $and: [
          {
            $or: [
              { uploadedBy: userId },
              { isPublic: true },
              { allowedUsers: userId }
            ]
          },
          { isActive: true },
          {
            $or: [
              { originalName: { $regex: query, $options: 'i' } },
              { 'mediaMetadata.description': { $regex: query, $options: 'i' } },
              { 'mediaMetadata.keywords': { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      };
      
      if (category) {
        searchQuery.$and.push({ category: category });
      }
      
      if (isPublic !== undefined) {
        searchQuery.$and.push({ isPublic: isPublic === 'true' });
      }
      
      const files = await File.find(searchQuery)
        .populate('uploadedBy', 'username')
        .populate('ipRegistration', 'title registrationNumber')
        .sort({ uploadDate: -1 })
        .limit(parseInt(limit));
      
      res.json({
        success: true,
        query: query,
        results: files.length,
        files: files.map(file => ({
          id: file._id,
          name: file.originalName,
          ipfsHash: file.ipfsHash,
          gatewayUrl: file.gatewayUrl,
          size: file.humanReadableSize,
          category: file.category,
          uploadDate: file.uploadDate,
          downloadCount: file.downloadCount,
          thumbnailHash: file.thumbnailHash,
          isPublic: file.isPublic,
          uploadedBy: file.uploadedBy.username,
          ipRegistration: file.ipRegistration ? {
            title: file.ipRegistration.title
          } : null,
          description: file.mediaMetadata?.description
        }))
      });
      
    } catch (error) {
      console.error('❌ File search failed:', error);
      res.status(500).json({
        success: false,
        message: 'File search failed',
        error: error.message
      });
    }
  }
);

export default router;