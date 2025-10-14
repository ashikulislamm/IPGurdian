import ipfsService from '../services/ipfsService.js';
import fileProcessor from '../services/fileProcessor.js';
import File from '../models/FileModel.js';
import fs from 'fs';
import path from 'path';

class FileController {
  
  /**
   * Test IPFS connection
   */
  async testConnection(req, res) {
    try {
      const isConnected = await ipfsService.testConnection();
      
      if (isConnected) {
        res.json({
          success: true,
          message: 'IPFS connection successful',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          message: 'IPFS connection failed',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('IPFS connection test error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to test IPFS connection',
        error: error.message
      });
    }
  }

  /**
   * Upload single file to IPFS
   */
  async uploadSingleFile(req, res) {
    let tempFiles = [];
    
    try {
      const { ipRegistrationId, isPublic = false, description = '' } = req.body;
      const uploadedFile = req.file;
      
      console.log('📋 Upload request details:', {
        ipRegistrationId: ipRegistrationId,
        isPublic: isPublic,
        hasFile: !!uploadedFile,
        userId: req.user?._id,
        userName: req.user?.name,
        authHeaders: req.headers.authorization ? 'Present' : 'Missing'
      });
      
      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      tempFiles.push(uploadedFile.path);
      
      // Get file validation info (added by middleware)
      const fileInfo = uploadedFile.validation.fileInfo;
      
      console.log('📁 Processing file upload:', uploadedFile.originalname);
      
      // Generate file hash for integrity
      const fileHash = await fileProcessor.generateFileHash(uploadedFile.path);
      
      // Check for duplicate files
      const existingFile = await File.findOne({ 
        fileHash: fileHash,
        uploadedBy: req.user._id 
      });
      
      if (existingFile) {
        await fileProcessor.cleanupTempFiles(tempFiles);
        return res.status(409).json({
          success: false,
          message: 'File already exists',
          existingFile: {
            id: existingFile._id,
            name: existingFile.originalName,
            ipfsHash: existingFile.ipfsHash
          }
        });
      }
      
      // Process image if needed (generate thumbnail)
      let thumbnailPath = null;
      let thumbnailHash = null;
      
      if (fileInfo.detectedType === 'images') {
        try {
          thumbnailPath = await fileProcessor.generateThumbnail(uploadedFile.path);
          tempFiles.push(thumbnailPath);
          
          // Upload thumbnail to IPFS
          const thumbnailResult = await ipfsService.uploadFile(
            thumbnailPath, 
            `thumb_${uploadedFile.originalname}`
          );
          thumbnailHash = thumbnailResult.hash;
          
          console.log('✅ Thumbnail uploaded to IPFS:', thumbnailHash);
        } catch (thumbError) {
          console.warn('⚠️ Thumbnail generation failed:', thumbError.message);
          // Continue without thumbnail
        }
      }
      
      // Upload main file to IPFS
      console.log('📤 Uploading to IPFS...');
      console.log('📁 File details:', {
        path: uploadedFile.path,
        originalname: uploadedFile.originalname,
        size: uploadedFile.size,
        mimetype: uploadedFile.mimetype
      });
      
      const ipfsResult = await ipfsService.uploadFile(
        uploadedFile.path, 
        uploadedFile.originalname
      );
      
      console.log('✅ IPFS upload result:', ipfsResult);
      
      // Pin the file to ensure availability
      await ipfsService.pinFile(ipfsResult.hash);
      
      // Get file metadata
      const metadata = await fileProcessor.getFileMetadata(uploadedFile.path);
      
      // Create file record in database
      const fileRecord = new File({
        originalName: uploadedFile.originalname,
        sanitizedName: fileProcessor.sanitizeFilename(uploadedFile.originalname),
        ipfsHash: ipfsResult.hash,
        gatewayUrl: ipfsResult.gatewayUrl,
        publicGatewayUrls: ipfsService.generatePublicGatewayUrls(ipfsResult.hash),
        mimetype: fileInfo.mimetype,
        extension: fileInfo.extension,
        size: uploadedFile.size,
        category: fileInfo.detectedType,
        fileHash: fileHash,
        thumbnailHash: thumbnailHash,
        // Only include ipRegistration if it's a valid ObjectId, otherwise omit it
        ...(ipRegistrationId && ipRegistrationId.trim() !== '' ? { ipRegistration: ipRegistrationId } : {}),
        uploadedBy: req.user._id,
        isPublic: isPublic === 'true' || isPublic === true,
        accessLevel: isPublic === 'true' || isPublic === true ? 'public' : 'private',
        mediaMetadata: {
          description: description || '',
          createdDate: new Date()
        },
        verificationStatus: 'verified'
      });
      
      await fileRecord.save();
      
      // Clean up temporary files
      await fileProcessor.cleanupTempFiles(tempFiles);
      
      console.log('✅ File upload completed:', {
        name: uploadedFile.originalname,
        hash: ipfsResult.hash,
        size: uploadedFile.size
      });
      
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          id: fileRecord._id,
          name: fileRecord.originalName,
          ipfsHash: fileRecord.ipfsHash,
          gatewayUrl: fileRecord.gatewayUrl,
          size: fileRecord.size,  // Use numeric size, not humanReadableSize
          sizeFormatted: fileRecord.humanReadableSize,  // Also include formatted version
          mimetype: fileRecord.mimetype,
          category: fileRecord.category,
          thumbnailHash: fileRecord.thumbnailHash,
          isPublic: fileRecord.isPublic
        }
      });
      
    } catch (error) {
      console.error('❌ File upload failed:', error);
      
      // Clean up temporary files
      await fileProcessor.cleanupTempFiles(tempFiles);
      
      // Provide more specific error messages
      let errorMessage = 'File upload failed';
      let statusCode = 500;
      
      if (error.message.includes('IPFS')) {
        errorMessage = 'IPFS upload failed';
        statusCode = 503;
      } else if (error.message.includes('validation')) {
        errorMessage = 'File validation failed';
        statusCode = 400;
      } else if (error.message.includes('Permission denied') || error.message.includes('EACCES')) {
        errorMessage = 'File system permission error';
        statusCode = 500;
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'File not found during processing';
        statusCode = 400;
      }
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Upload multiple files to IPFS
   */
  async uploadMultipleFiles(req, res) {
    let tempFiles = [];
    
    try {
      const { ipRegistrationId, isPublic = false, descriptions = '{}' } = req.body;
      const uploadedFiles = req.files;
      
      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      
      tempFiles = uploadedFiles.map(file => file.path);
      
      console.log(`📁 Processing ${uploadedFiles.length} file uploads`);
      
      const fileDescriptions = JSON.parse(descriptions || '{}');
      const results = [];
      const errors = [];
      
      // Process each file
      for (let i = 0; i < uploadedFiles.length; i++) {
        const uploadedFile = uploadedFiles[i];
        
        try {
          const fileInfo = uploadedFile.validation.fileInfo;
          const fileHash = await fileProcessor.generateFileHash(uploadedFile.path);
          
          // Check for duplicates
          const existingFile = await File.findOne({ 
            fileHash: fileHash,
            uploadedBy: req.user._id,
          });
          
          if (existingFile) {
            errors.push({
              file: uploadedFile.originalname,
              error: 'File already exists',
              existingId: existingFile._id
            });
            continue;
          }
          
          // Generate thumbnail for images
          let thumbnailPath = null;
          let thumbnailHash = null;
          
          if (fileInfo.detectedType === 'images') {
            try {
              thumbnailPath = await fileProcessor.generateThumbnail(uploadedFile.path);
              tempFiles.push(thumbnailPath);
              
              const thumbnailResult = await ipfsService.uploadFile(
                thumbnailPath, 
                `thumb_${uploadedFile.originalname}`
              );
              thumbnailHash = thumbnailResult.hash;
            } catch (thumbError) {
              console.warn('⚠️ Thumbnail generation failed for', uploadedFile.originalname);
            }
          }
          
          // Upload to IPFS
          const ipfsResult = await ipfsService.uploadFile(
            uploadedFile.path, 
            uploadedFile.originalname
          );
          
          // Pin the file
          await ipfsService.pinFile(ipfsResult.hash);
          
          // Create file record
          const fileRecord = new File({
            originalName: uploadedFile.originalname,
            sanitizedName: fileProcessor.sanitizeFilename(uploadedFile.originalname),
            ipfsHash: ipfsResult.hash,
            gatewayUrl: ipfsResult.gatewayUrl,
            publicGatewayUrls: ipfsService.generatePublicGatewayUrls(ipfsResult.hash),
            mimetype: fileInfo.mimetype,
            extension: fileInfo.extension,
            size: uploadedFile.size,
            category: fileInfo.detectedType,
            fileHash: fileHash,
            thumbnailHash: thumbnailHash,
            ipRegistration: ipRegistrationId,
          uploadedBy: req.user._id,
          isPublic: isPublic === 'true' || isPublic === true,
          accessLevel: isPublic === 'true' || isPublic === true ? 'public' : 'private',
            mediaMetadata: {
              description: fileDescriptions[uploadedFile.originalname] || '',
              createdDate: new Date()
            },
            verificationStatus: 'verified'
          });
          
          await fileRecord.save();
          
          results.push({
            id: fileRecord._id,
            name: fileRecord.originalName,
            ipfsHash: fileRecord.ipfsHash,
            gatewayUrl: fileRecord.gatewayUrl,
            size: fileRecord.humanReadableSize,
            category: fileRecord.category,
            thumbnailHash: fileRecord.thumbnailHash
          });
          
        } catch (fileError) {
          console.error(`❌ Failed to process ${uploadedFile.originalname}:`, fileError);
          errors.push({
            file: uploadedFile.originalname,
            error: fileError.message
          });
        }
      }
      
      // Clean up temporary files
      await fileProcessor.cleanupTempFiles(tempFiles);
      
      console.log(`✅ Multiple file upload completed: ${results.length} successful, ${errors.length} failed`);
      
      res.status(201).json({
        success: true,
        message: `${results.length} files uploaded successfully`,
        files: results,
        errors: errors,
        summary: {
          total: uploadedFiles.length,
          successful: results.length,
          failed: errors.length
        }
      });
      
    } catch (error) {
      console.error('❌ Multiple file upload failed:', error);
      
      // Clean up temporary files
      await fileProcessor.cleanupTempFiles(tempFiles);
      
      res.status(500).json({
        success: false,
        message: 'Multiple file upload failed',
        error: error.message
      });
    }
  }

  /**
   * Get file from IPFS
   */
  async getFile(req, res) {
    try {
      const { hash } = req.params;
      const { download = false } = req.query;
      
      // Find file record in database
      const fileRecord = await File.findOne({ 
        ipfsHash: hash,
        isActive: true 
      }).populate('uploadedBy', 'username');
      
      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
      
      // Check access permissions
      if (!fileRecord.isPublic) {
        if (!req.user || (
          req.user._id.toString() !== fileRecord.uploadedBy._id.toString() &&
          !fileRecord.allowedUsers.includes(req.user._id)
        )) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      }
      
      // Get file from IPFS
      const fileBuffer = await ipfsService.getFile(hash);
      
      // Update access statistics
      await fileRecord.incrementDownloadCount();
      
      // Set response headers
      res.set({
        'Content-Type': fileRecord.mimetype,
        'Content-Length': fileBuffer.length,
        'Content-Disposition': download === 'true' 
          ? `attachment; filename="${fileRecord.originalName}"`
          : `inline; filename="${fileRecord.originalName}"`
      });
      
      res.send(fileBuffer);
      
    } catch (error) {
      console.error('❌ File retrieval failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve file',
        error: error.message
      });
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(req, res) {
    try {
      const { hash } = req.params;
      
      const fileRecord = await File.findOne({ 
        ipfsHash: hash,
        isActive: true 
      })
      .populate('uploadedBy', 'username')
      .populate('ipRegistration', 'title registrationNumber');
      
      if (!fileRecord) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }
      
      // Check if user can view file info
      const canView = fileRecord.isPublic || 
        (req.user && (
          req.user._id.toString() === fileRecord.uploadedBy._id.toString() ||
          fileRecord.allowedUsers.includes(req.user._id)
        ));
      
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      res.json({
        success: true,
        file: {
          id: fileRecord._id,
          name: fileRecord.originalName,
          ipfsHash: fileRecord.ipfsHash,
          gatewayUrl: fileRecord.gatewayUrl,
          mimetype: fileRecord.mimetype,
          extension: fileRecord.extension,
          size: fileRecord.humanReadableSize,
          category: fileRecord.category,
          uploadDate: fileRecord.uploadDate,
          downloadCount: fileRecord.downloadCount,
          lastAccessed: fileRecord.lastAccessed,
          thumbnailHash: fileRecord.thumbnailHash,
          isPublic: fileRecord.isPublic,
          uploadedBy: fileRecord.uploadedBy.username,
          ipRegistration: fileRecord.ipRegistration ? {
            id: fileRecord.ipRegistration._id,
            title: fileRecord.ipRegistration.title,
            registrationNumber: fileRecord.ipRegistration.registrationNumber
          } : null,
          mediaMetadata: fileRecord.mediaMetadata
        }
      });
      
    } catch (error) {
      console.error('❌ Get file info failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get file information',
        error: error.message
      });
    }
  }

  /**
   * Get user's files
   */
  async getUserFiles(req, res) {
    try {
      const { category, isPublic, limit = 50, page = 1 } = req.query;
      const userId = req.user._id;
      
      const query = { 
        uploadedBy: userId, 
        isActive: true 
      };
      
      if (category) query.category = category;
      if (isPublic !== undefined) query.isPublic = isPublic === 'true';
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const files = await File.find(query)
        .populate('ipRegistration', 'title registrationNumber')
        .sort({ uploadDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const totalCount = await File.countDocuments(query);
      
      res.json({
        success: true,
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
          ipRegistration: file.ipRegistration ? {
            id: file.ipRegistration._id,
            title: file.ipRegistration.title
          } : null
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalFiles: totalCount,
          hasMore: skip + files.length < totalCount
        }
      });
      
    } catch (error) {
      console.error('❌ Get user files failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user files',
        error: error.message
      });
    }
  }

  /**
   * Delete file (unpin from IPFS and mark as inactive)
   */
  async deleteFile(req, res) {
    try {
      const { hash } = req.params;
      const userId = req.user._id;
      
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
      
      // Unpin from IPFS
      try {
        await ipfsService.unpinFile(hash);
        console.log('✅ File unpinned from IPFS:', hash);
      } catch (unpinError) {
        console.warn('⚠️ Failed to unpin file from IPFS:', unpinError.message);
        // Continue with database deletion even if unpin fails
      }
      
      // Mark as inactive instead of deleting
      fileRecord.isActive = false;
      fileRecord.lastModified = new Date();
      await fileRecord.save();
      
      res.json({
        success: true,
        message: 'File deleted successfully',
        fileId: fileRecord._id
      });
      
    } catch (error) {
      console.error('❌ File deletion failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete file',
        error: error.message
      });
    }
  }

  /**
   * Get public files (marketplace)
   */
  async getPublicFiles(req, res) {
    try {
      const { category, limit = 20, page = 1, sortBy = 'uploadDate' } = req.query;
      
      const query = { 
        isPublic: true, 
        isActive: true,
        verificationStatus: 'verified'
      };
      
      if (category) query.category = category;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      let sortOptions = { uploadDate: -1 };
      if (sortBy === 'downloadCount') sortOptions = { downloadCount: -1 };
      if (sortBy === 'size') sortOptions = { size: -1 };
      
      const files = await File.find(query)
        .populate('uploadedBy', 'username')
        .populate('ipRegistration', 'title registrationNumber')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));
      
      const totalCount = await File.countDocuments(query);
      
      res.json({
        success: true,
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
          uploadedBy: file.uploadedBy.username,
          ipRegistration: file.ipRegistration ? {
            id: file.ipRegistration._id,
            title: file.ipRegistration.title,
            registrationNumber: file.ipRegistration.registrationNumber
          } : null,
          description: file.mediaMetadata?.description
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalFiles: totalCount,
          hasMore: skip + files.length < totalCount
        }
      });
      
    } catch (error) {
      console.error('❌ Get public files failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get public files',
        error: error.message
      });
    }
  }
}

const fileController = new FileController();
export default fileController;