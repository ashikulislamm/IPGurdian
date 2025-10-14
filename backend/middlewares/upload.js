import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import fileProcessor from '../services/fileProcessor.js';

// Ensure temp upload directory exists
const tempUploadPath = process.env.TEMP_UPLOAD_PATH || './uploads/temp';
if (!fs.existsSync(tempUploadPath)) {
  fs.mkdirSync(tempUploadPath, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with UUID and timestamp
    const uniqueSuffix = `${Date.now()}_${uuidv4()}`;
    const sanitizedName = fileProcessor.sanitizeFilename(file.originalname);
    const extension = path.extname(sanitizedName);
    const baseName = path.basename(sanitizedName, extension);
    
    cb(null, `${baseName}_${uniqueSuffix}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Get file extension from original name
  const extension = path.extname(file.originalname).toLowerCase().slice(1);
  
  // Check if file type is allowed
  if (fileProcessor.isAllowedFileType(extension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${extension}' is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB
    files: parseInt(process.env.MAX_FILES_PER_IP) || 10, // Max 10 files
    fields: 20, // Max form fields
    fieldNameSize: 50, // Max field name size
    fieldSize: 1024 * 1024 // Max field value size (1MB)
  }
});

// Middleware for single file upload
export const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        
        // Handle specific multer errors
        let errorMessage = 'File upload failed';
        
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            errorMessage = `File size exceeds limit of ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB`;
            break;
          case 'LIMIT_FILE_COUNT':
            errorMessage = `Maximum ${process.env.MAX_FILES_PER_IP} files allowed`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            errorMessage = 'Unexpected field name for file upload';
            break;
          case 'LIMIT_FIELD_COUNT':
            errorMessage = 'Too many form fields';
            break;
          case 'LIMIT_FIELD_KEY':
            errorMessage = 'Field name too long';
            break;
          case 'LIMIT_FIELD_VALUE':
            errorMessage = 'Field value too long';
            break;
          default:
            errorMessage = error.message;
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          error: error.code
        });
      } else if (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
          success: false,
          message: error.message || 'File upload failed'
        });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      next();
    });
  };
};

// Middleware for multiple files upload
export const uploadMultiple = (fieldName = 'files', maxCount) => {
  const maxFiles = maxCount || parseInt(process.env.MAX_FILES_PER_IP) || 10;
  
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxFiles);
    
    multipleUpload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        
        let errorMessage = 'File upload failed';
        
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            errorMessage = `File size exceeds limit of ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB`;
            break;
          case 'LIMIT_FILE_COUNT':
            errorMessage = `Maximum ${maxFiles} files allowed`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            errorMessage = `Field name should be '${fieldName}' for multiple file upload`;
            break;
          default:
            errorMessage = error.message;
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          error: error.code
        });
      } else if (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
          success: false,
          message: error.message || 'File upload failed'
        });
      }
      
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
      
      next();
    });
  };
};

// Middleware for mixed form data (files + other fields)
export const uploadFields = (fields) => {
  return (req, res, next) => {
    const fieldsUpload = upload.fields(fields);
    
    fieldsUpload(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        
        let errorMessage = 'Form upload failed';
        
        switch (error.code) {
          case 'LIMIT_FILE_SIZE':
            errorMessage = `File size exceeds limit of ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB`;
            break;
          case 'LIMIT_FILE_COUNT':
            errorMessage = `Maximum ${process.env.MAX_FILES_PER_IP} files allowed`;
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            errorMessage = 'Unexpected file field';
            break;
          default:
            errorMessage = error.message;
        }
        
        return res.status(400).json({
          success: false,
          message: errorMessage,
          error: error.code
        });
      } else if (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
          success: false,
          message: error.message || 'Form upload failed'
        });
      }
      
      next();
    });
  };
};

// Validation middleware to be used after upload
export const validateUploadedFile = async (req, res, next) => {
  try {
    if (req.file) {
      // Validate single file
      const validation = await fileProcessor.validateFile(req.file);
      
      if (!validation.isValid) {
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validation.errors
        });
      }
      
      // Add validation info to request
      req.file.validation = validation;
    }
    
    next();
  } catch (error) {
    console.error('File validation error:', error);
    
    // Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: 'File validation failed',
      error: error.message
    });
  }
};

// Validation middleware for multiple files
export const validateUploadedFiles = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      // Validate multiple files
      const validation = await fileProcessor.validateMultipleFiles(req.files);
      
      if (!validation.isValid) {
        // Clean up uploaded files
        await fileProcessor.cleanupTempFiles(req.files.map(file => file.path));
        
        return res.status(400).json({
          success: false,
          message: 'File validation failed',
          errors: validation.errors,
          invalidFiles: validation.invalidFiles.map(file => ({
            name: file.originalname,
            errors: file.errors
          }))
        });
      }
      
      // Add validation info to request
      req.files.validation = validation;
    }
    
    next();
  } catch (error) {
    console.error('Files validation error:', error);
    
    // Clean up uploaded files
    if (req.files) {
      await fileProcessor.cleanupTempFiles(req.files.map(file => file.path));
    }
    
    return res.status(500).json({
      success: false,
      message: 'Files validation failed',
      error: error.message
    });
  }
};

// Error handling middleware for upload errors
export const handleUploadError = (error, req, res, next) => {
  console.error('Upload middleware error:', error);
  
  // Clean up any uploaded files
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
  
  if (req.files) {
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Upload failed due to server error',
    error: error.message
  });
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  validateUploadedFile,
  validateUploadedFiles,
  handleUploadError
};