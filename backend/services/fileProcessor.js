import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileTypeFromFile } from 'file-type';
import mimeTypes from 'mime-types';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class FileProcessor {
  constructor() {
    this.allowedTypes = {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
      documents: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
      audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'],
      video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'],
      archives: ['zip', 'rar', '7z', 'tar', 'gz'],
      code: ['js', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c']
    };

    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 104857600; // 100MB
    this.tempPath = process.env.TEMP_UPLOAD_PATH || './uploads/temp';
  }

  /**
   * Validate file type and size
   * @param {Object} file - File object from multer
   * @returns {Object} Validation result
   */
  async validateFile(file) {
    try {
      const validationResult = {
        isValid: true,
        errors: [],
        fileInfo: {}
      };

      // Check file size
      if (file.size > this.maxFileSize) {
        validationResult.isValid = false;
        validationResult.errors.push(`File size exceeds limit of ${this.maxFileSize / 1024 / 1024}MB`);
      }

      // Detect actual file type
      const detectedType = await fileTypeFromFile(file.path);
      
      if (detectedType) {
        validationResult.fileInfo = {
          originalName: file.originalname,
          mimetype: detectedType.mime,
          extension: detectedType.ext,
          size: file.size,
          detectedType: this.categorizeFileType(detectedType.ext)
        };

        // Validate against allowed types
        if (!this.isAllowedFileType(detectedType.ext)) {
          validationResult.isValid = false;
          validationResult.errors.push(`File type '${detectedType.ext}' is not allowed`);
        }
      } else {
        // Fallback to original mimetype for text files and others
        const ext = path.extname(file.originalname).toLowerCase().slice(1);
        if (this.isAllowedFileType(ext)) {
          validationResult.fileInfo = {
            originalName: file.originalname,
            mimetype: file.mimetype,
            extension: ext,
            size: file.size,
            detectedType: this.categorizeFileType(ext)
          };
        } else {
          validationResult.isValid = false;
          validationResult.errors.push(`Unable to verify file type or unsupported format`);
        }
      }

      return validationResult;
    } catch (error) {
      console.error('File validation error:', error);
      return {
        isValid: false,
        errors: [`Validation failed: ${error.message}`],
        fileInfo: {}
      };
    }
  }

  /**
   * Check if file type is allowed
   * @param {string} extension - File extension
   * @returns {boolean} Whether file type is allowed
   */
  isAllowedFileType(extension) {
    const ext = extension.toLowerCase();
    return Object.values(this.allowedTypes).some(types => types.includes(ext));
  }

  /**
   * Categorize file type
   * @param {string} extension - File extension
   * @returns {string} File category
   */
  categorizeFileType(extension) {
    const ext = extension.toLowerCase();
    for (const [category, types] of Object.entries(this.allowedTypes)) {
      if (types.includes(ext)) {
        return category;
      }
    }
    return 'unknown';
  }

  /**
   * Generate file hash
   * @param {string} filePath - Path to file
   * @returns {Promise<string>} SHA-256 hash of file
   */
  async generateFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('error', reject);
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  /**
   * Generate thumbnail for image files
   * @param {string} filePath - Path to image file
   * @param {Object} options - Thumbnail options
   * @returns {Promise<string>} Path to thumbnail
   */
  async generateThumbnail(filePath, options = {}) {
    try {
      const { width = 300, height = 300, quality = 80 } = options;
      
      const thumbnailDir = path.join(this.tempPath, 'thumbnails');
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      const thumbnailName = `thumb_${uuidv4()}.jpg`;
      const thumbnailPath = path.join(thumbnailDir, thumbnailName);

      await sharp(filePath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality })
        .toFile(thumbnailPath);

      console.log('✅ Thumbnail generated:', thumbnailPath);
      return thumbnailPath;
    } catch (error) {
      console.error('❌ Thumbnail generation failed:', error);
      throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
  }

  /**
   * Process image file (compress, resize, optimize)
   * @param {string} filePath - Path to image file
   * @param {Object} options - Processing options
   * @returns {Promise<string>} Path to processed image
   */
  async processImage(filePath, options = {}) {
    try {
      const { 
        maxWidth = 2048, 
        maxHeight = 2048, 
        quality = 85,
        format = 'jpeg'
      } = options;

      const processedDir = path.join(this.tempPath, 'processed');
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }

      const processedName = `processed_${uuidv4()}.${format}`;
      const processedPath = path.join(processedDir, processedName);

      const sharpInstance = sharp(filePath)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });

      if (format === 'jpeg') {
        sharpInstance.jpeg({ quality, progressive: true });
      } else if (format === 'png') {
        sharpInstance.png({ compressionLevel: 8 });
      } else if (format === 'webp') {
        sharpInstance.webp({ quality });
      }

      await sharpInstance.toFile(processedPath);

      console.log('✅ Image processed:', processedPath);
      return processedPath;
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Get file metadata
   * @param {string} filePath - Path to file
   * @returns {Promise<Object>} File metadata
   */
  async getFileMetadata(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const fileHash = await this.generateFileHash(filePath);
      const detectedType = await fileTypeFromFile(filePath);

      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        hash: fileHash,
        mimetype: detectedType?.mime || mimeTypes.lookup(filePath) || 'application/octet-stream',
        extension: detectedType?.ext || path.extname(filePath).slice(1).toLowerCase(),
        category: detectedType ? this.categorizeFileType(detectedType.ext) : 'unknown'
      };
    } catch (error) {
      console.error('❌ Failed to get file metadata:', error);
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  /**
   * Sanitize filename
   * @param {string} filename - Original filename
   * @returns {string} Sanitized filename
   */
  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .toLowerCase();
  }

  /**
   * Clean up temporary files
   * @param {Array} filePaths - Array of file paths to clean up
   */
  async cleanupTempFiles(filePaths) {
    try {
      const cleanupPromises = filePaths.map(filePath => {
        if (fs.existsSync(filePath)) {
          return fs.promises.unlink(filePath);
        }
      });

      await Promise.allSettled(cleanupPromises);
      console.log('✅ Temporary files cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup temporary files:', error);
    }
  }

  /**
   * Validate multiple files
   * @param {Array} files - Array of file objects
   * @returns {Promise<Object>} Validation results
   */
  async validateMultipleFiles(files) {
    try {
      const maxFilesPerIP = parseInt(process.env.MAX_FILES_PER_IP) || 10;
      
      if (files.length > maxFilesPerIP) {
        return {
          isValid: false,
          errors: [`Maximum ${maxFilesPerIP} files allowed per IP registration`],
          validFiles: [],
          invalidFiles: files
        };
      }

      const validationPromises = files.map(file => this.validateFile(file));
      const results = await Promise.all(validationPromises);

      const validFiles = [];
      const invalidFiles = [];
      const allErrors = [];

      results.forEach((result, index) => {
        if (result.isValid) {
          validFiles.push({
            ...files[index],
            fileInfo: result.fileInfo
          });
        } else {
          invalidFiles.push({
            ...files[index],
            errors: result.errors
          });
          allErrors.push(...result.errors);
        }
      });

      return {
        isValid: validFiles.length > 0 && invalidFiles.length === 0,
        errors: allErrors,
        validFiles,
        invalidFiles,
        totalSize: validFiles.reduce((sum, file) => sum + file.size, 0)
      };
    } catch (error) {
      console.error('❌ Multiple file validation failed:', error);
      return {
        isValid: false,
        errors: [`Validation failed: ${error.message}`],
        validFiles: [],
        invalidFiles: files
      };
    }
  }
}

// Export singleton instance
const fileProcessor = new FileProcessor();
export default fileProcessor;