import React, { useState, useCallback } from 'react';
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  DocumentIcon,
  PhotoIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import fileUploadService from '../../services/fileUploadService';

const FileUpload = ({ 
  onFilesUploaded, 
  multiple = true, 
  acceptedTypes = null,
  maxSize = 50 * 1024 * 1024, // 50MB default
  className = "",
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  // Get file type icon
  const getFileIcon = (file) => {
    const category = fileUploadService.getFileCategory(file.type);
    switch (category) {
      case 'images':
        return <PhotoIcon className="h-8 w-8 text-blue-500" />;
      case 'audio':
        return <MusicalNoteIcon className="h-8 w-8 text-purple-500" />;
      case 'video':
        return <VideoCameraIcon className="h-8 w-8 text-red-500" />;
      case 'archives':
        return <ArchiveBoxIcon className="h-8 w-8 text-orange-500" />;
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate files
  const validateFiles = (files) => {
    const validationErrors = [];
    const validFiles = [];

    Array.from(files).forEach((file, index) => {
      // Check file size
      if (file.size > maxSize) {
        validationErrors.push(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`);
        return;
      }

      // Check file type if acceptedTypes is specified
      if (acceptedTypes && !acceptedTypes.includes(file.type)) {
        validationErrors.push(`File "${file.name}" type is not supported.`);
        return;
      }

      // Check for duplicates in current selection
      const duplicate = selectedFiles.find(f => f.name === file.name && f.size === file.size);
      if (duplicate) {
        validationErrors.push(`File "${file.name}" is already selected.`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, errors: validationErrors };
  };

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [disabled]);

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Process selected files
  const handleFiles = (files) => {
    const { validFiles, errors } = validateFiles(files);
    
    setErrors(errors);

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles);
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Clear any upload progress for removed file
    const newProgress = { ...uploadProgress };
    delete newProgress[index];
    setUploadProgress(newProgress);
  };

  // Upload files
  const uploadFiles = async () => {
    if (selectedFiles.length === 0 || uploading) return;

    setUploading(true);
    setErrors([]);

    try {
      const uploadResults = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        try {
          // Update progress for current file
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'uploading', progress: 0 }
          }));

          const result = await fileUploadService.uploadFile(file, {
            onProgress: (progress) => {
              setUploadProgress(prev => ({
                ...prev,
                [i]: { status: 'uploading', progress }
              }));
            }
          });

          // Mark as completed
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'completed', progress: 100 }
          }));

          uploadResults.push(result);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          setUploadProgress(prev => ({
            ...prev,
            [i]: { status: 'error', progress: 0, error: error.message }
          }));
        }
      }

      // Call callback with successful uploads
      if (uploadResults.length > 0 && onFilesUploaded) {
        onFilesUploaded(uploadResults);
      }

      // Clear completed uploads after a delay
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadProgress({});
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setErrors([error.message || 'Upload failed. Please try again.']);
    } finally {
      setUploading(false);
    }
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setErrors([]);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          multiple={multiple}
          accept={acceptedTypes?.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 ${
            dragActive ? 'text-blue-500' : 'text-gray-400'
          }`} />
          <div className="text-sm text-gray-600">
            <label className="relative cursor-pointer">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              <span className="ml-1">or drag and drop</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {acceptedTypes 
              ? `Supported formats: ${acceptedTypes.join(', ')}`
              : 'All file types supported'
            }
          </p>
          <p className="text-xs text-gray-500">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Errors</h3>
              <ul className="mt-2 text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
              disabled={uploading}
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => {
              const progress = uploadProgress[index];
              
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      
                      <div className="ml-2 flex items-center">
                        {progress?.status === 'uploading' && (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {progress.progress}%
                            </span>
                          </div>
                        )}
                        
                        {progress?.status === 'completed' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        )}
                        
                        {progress?.status === 'error' && (
                          <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                            <span className="text-xs text-red-600 ml-1">
                              {progress.error}
                            </span>
                          </div>
                        )}
                        
                        {!progress && !uploading && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upload Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={uploadFiles}
              disabled={uploading || selectedFiles.length === 0}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${uploading || selectedFiles.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;