// IPFS File Upload Service for IPGuardian Frontend

class FileUploadService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api/files';
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Test IPFS connection
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/test`);
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload single file to IPFS
   * @param {File} file - File object to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadSingleFile(file, options = {}) {
    try {
      const {
        ipRegistrationId,
        isPublic = false,
        description = '',
        onProgress = null
      } = options;

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ipRegistrationId', ipRegistrationId || '');
      formData.append('isPublic', isPublic.toString());
      formData.append('description', description);

      // Create XMLHttpRequest for progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Progress event handler
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(Math.round(percentComplete));
            }
          });
        }

        // Response handler
        xhr.onload = () => {
          try {
            const result = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ success: true, data: result });
            } else {
              resolve({ success: false, error: result.message || 'Upload failed' });
            }
          } catch (error) {
            resolve({ success: false, error: 'Invalid response from server' });
          }
        };

        xhr.onerror = () => {
          resolve({ success: false, error: 'Network error during upload' });
        };

        xhr.ontimeout = () => {
          resolve({ success: false, error: 'Upload timeout' });
        };

        // Set timeout (30 seconds)
        xhr.timeout = 30000;

        // Open request
        xhr.open('POST', `${this.baseURL}/upload`);
        
        // Set auth header
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        // Send request
        xhr.send(formData);
      });

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload multiple files to IPFS
   * @param {FileList|Array} files - Files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadMultipleFiles(files, options = {}) {
    try {
      const {
        ipRegistrationId,
        isPublic = false,
        descriptions = {},
        onProgress = null,
        onFileProgress = null
      } = options;

      // Convert FileList to Array if needed
      const fileArray = Array.from(files);

      // Validate all files
      const validationResults = fileArray.map(file => ({
        file,
        validation: this.validateFile(file)
      }));

      const invalidFiles = validationResults.filter(result => !result.validation.isValid);
      if (invalidFiles.length > 0) {
        return {
          success: false,
          error: `Invalid files: ${invalidFiles.map(f => f.file.name).join(', ')}`,
          invalidFiles: invalidFiles.map(f => ({
            name: f.file.name,
            error: f.validation.error
          }))
        };
      }

      // Create form data
      const formData = new FormData();
      fileArray.forEach(file => {
        formData.append('files', file);
      });
      formData.append('ipRegistrationId', ipRegistrationId || '');
      formData.append('isPublic', isPublic.toString());
      formData.append('descriptions', JSON.stringify(descriptions));

      // Upload with progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Progress event handler
        if (onProgress) {
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              onProgress(Math.round(percentComplete));
            }
          });
        }

        // Response handler
        xhr.onload = () => {
          try {
            const result = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({ success: true, data: result });
            } else {
              resolve({ success: false, error: result.message || 'Upload failed' });
            }
          } catch (error) {
            resolve({ success: false, error: 'Invalid response from server' });
          }
        };

        xhr.onerror = () => {
          resolve({ success: false, error: 'Network error during upload' });
        };

        xhr.ontimeout = () => {
          resolve({ success: false, error: 'Upload timeout' });
        };

        // Set timeout (60 seconds for multiple files)
        xhr.timeout = 60000;

        // Open request
        xhr.open('POST', `${this.baseURL}/upload-multiple`);
        
        // Set auth header
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        // Send request
        xhr.send(formData);
      });

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file information by IPFS hash
   * @param {string} ipfsHash - IPFS hash of the file
   * @returns {Promise<Object>} File information
   */
  async getFileInfo(ipfsHash) {
    try {
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/${ipfsHash}/info`, {
        headers
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get file download URL
   * @param {string} ipfsHash - IPFS hash of the file
   * @param {boolean} download - Whether to download or view
   * @returns {string} File URL
   */
  getFileUrl(ipfsHash, download = false) {
    const params = download ? '?download=true' : '';
    return `${this.baseURL}/${ipfsHash}${params}`;
  }

  /**
   * Download file
   * @param {string} ipfsHash - IPFS hash of the file
   * @param {string} filename - Filename for download
   */
  async downloadFile(ipfsHash, filename) {
    try {
      const url = this.getFileUrl(ipfsHash, true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `file-${ipfsHash}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's files
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User files
   */
  async getUserFiles(options = {}) {
    try {
      const { category, isPublic, limit = 50, page = 1 } = options;
      
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (isPublic !== undefined) params.append('isPublic', isPublic);
      params.append('limit', limit);
      params.append('page', page);

      const response = await fetch(`${this.baseURL}/user/files?${params}`, {
        headers: this.getAuthHeaders()
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get public files (marketplace)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Public files
   */
  async getPublicFiles(options = {}) {
    try {
      const { category, limit = 20, page = 1, sortBy = 'uploadDate' } = options;
      
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', limit);
      params.append('page', page);
      params.append('sortBy', sortBy);

      const response = await fetch(`${this.baseURL}/public/files?${params}`);
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update file visibility
   * @param {string} ipfsHash - IPFS hash of the file
   * @param {boolean} isPublic - New visibility setting
   * @returns {Promise<Object>} Update result
   */
  async updateFileVisibility(ipfsHash, isPublic) {
    try {
      const response = await fetch(`${this.baseURL}/${ipfsHash}/visibility`, {
        method: 'PATCH',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublic })
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete file
   * @param {string} ipfsHash - IPFS hash of the file
   * @returns {Promise<Object>} Delete result
   */
  async deleteFile(ipfsHash) {
    try {
      const response = await fetch(`${this.baseURL}/${ipfsHash}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Search files
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchFiles(query, options = {}) {
    try {
      const { category, isPublic, limit = 20 } = options;
      
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (isPublic !== undefined) params.append('isPublic', isPublic);
      params.append('limit', limit);

      const response = await fetch(`${this.baseURL}/search/${encodeURIComponent(query)}?${params}`, {
        headers: this.getAuthHeaders()
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user file statistics
   * @returns {Promise<Object>} File statistics
   */
  async getUserStats() {
    try {
      const response = await fetch(`${this.baseURL}/user/stats`, {
        headers: this.getAuthHeaders()
      });
      
      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateFile(file) {
    // File size validation (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds 100MB limit. Current size: ${this.formatFileSize(file.size)}`
      };
    }

    // File type validation
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp',
      // Documents
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/mp4', 'audio/flac',
      // Video
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/x-msvideo',
      // Archives
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
      'application/x-tar', 'application/gzip',
      // Code
      'text/javascript', 'text/html', 'text/css', 'application/json', 'application/xml',
      'text/x-python', 'text/x-java', 'text/x-c++src', 'text/x-csrc'
    ];

    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp',
      'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt',
      'mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac',
      'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv',
      'zip', 'rar', '7z', 'tar', 'gz',
      'js', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c'
    ];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${allowedExtensions.join(', ')}`
      };
    }

    return { isValid: true };
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file category from file type
   * @param {string} fileType - MIME type of file
   * @returns {string} File category
   */
  getFileCategory(fileType) {
    if (fileType.startsWith('image/')) return 'images';
    if (fileType.startsWith('audio/')) return 'audio';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text/')) return 'documents';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return 'archives';
    return 'unknown';
  }

  /**
   * Generate thumbnail URL for images
   * @param {string} thumbnailHash - IPFS hash of thumbnail
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(thumbnailHash) {
    if (!thumbnailHash) return null;
    return `${this.baseURL}/${thumbnailHash}`;
  }
}

// Export singleton instance
const fileUploadService = new FileUploadService();
export default fileUploadService;