import React, { useState, useEffect } from 'react';
import { 
  FolderIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import FilePreview from './FilePreview';
import fileUploadService from '../../services/fileUploadService';

const FileManager = ({ userId, userData, onFileSelect, className = "" }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Load user files when userId is available
  useEffect(() => {
    if (userId) {
      loadFiles();
    } else {
      // If no userId after a delay, show empty state
      const timer = setTimeout(() => {
        if (!userId) {
          setLoading(false);
          setFiles([]);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const loadFiles = async () => {
    // If no userId available yet, wait a bit and then show empty state
    if (!userId) {
      console.log('No userId available, showing empty state');
      setLoading(false);
      setFiles([]);
      setError(null);
      return;
    }

    console.log('Loading files for user:', userId);
    setLoading(true);
    setError(null);
    
    try {
      // Test backend connectivity first
      console.log('🔍 Testing backend connectivity for FileManager...');
      const testResult = await fileUploadService.testConnection();
      if (!testResult.success) {
        console.log('Backend not available, showing empty state');
        setFiles([]);
        setError('Backend server is not available. Your files will appear here when the server is running.');
        setLoading(false);
        return;
      }
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 8000)
      );
      
      const result = await Promise.race([
        fileUploadService.getUserFiles(),
        timeoutPromise
      ]);
      
      console.log('getUserFiles result:', result);
      
      if (result && result.success) {
        const filesData = result.data?.files || result.data || [];
        console.log('Loaded files:', filesData);
        setFiles(filesData);
        setError(null);
      } else {
        console.log('No files found or API error:', result);
        setFiles([]);
        setError(result?.error || 'No files found or unable to fetch files');
      }
    } catch (err) {
      console.log('File API error:', err);
      setFiles([]);
      
      if (err.message.includes('timeout')) {
        setError('Request timed out. Please check your connection and try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend server. Please ensure it is running.');
      } else {
        setError('Unable to load files. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      // Search filter
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filterType !== 'all') {
        const category = fileUploadService.getFileCategory(file.mimetype);
        if (category !== filterType) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'uploadDate':
          comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
          break;
        case 'type':
          comparison = (a.mimetype || '').localeCompare(b.mimetype || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Handle file selection
  const toggleFileSelection = (fileId) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  // Select all filtered files
  const selectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f._id)));
    }
  };

  // Delete selected files
  const deleteSelectedFiles = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!window.confirm(`Delete ${selectedFiles.size} selected file(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedFiles).map(fileId => 
          fileUploadService.deleteFile(fileId)
        )
      );
      
      // Remove deleted files from state
      setFiles(files.filter(f => !selectedFiles.has(f._id)));
      setSelectedFiles(new Set());
    } catch (err) {
      console.error('Failed to delete files:', err);
      setError('Failed to delete some files. Please try again.');
    }
  };

  // Download selected files
  const downloadSelectedFiles = async () => {
    if (selectedFiles.size === 0) return;

    try {
      const selectedFileObjects = files.filter(f => selectedFiles.has(f._id));
      
      if (selectedFileObjects.length === 1) {
        // Single file download
        const file = selectedFileObjects[0];
        await fileUploadService.downloadFile(file.ipfsHash, file.name);
      } else {
        // Multiple files - download as zip
        await fileUploadService.downloadMultipleFiles(selectedFileObjects);
      }
    } catch (err) {
      console.error('Failed to download files:', err);
      setError('Failed to download files. Please try again.');
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get file type counts
  const getFileTypeCounts = () => {
    const counts = { all: files.length };
    files.forEach(file => {
      const category = fileUploadService.getFileCategory(file.mimetype);
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const fileTypeCounts = getFileTypeCounts();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your files...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
        <div className="text-red-700">{error}</div>
        <button
          onClick={loadFiles}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FolderIcon className="h-6 w-6 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">File Manager</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {files.length} files
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadFiles}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Refresh files"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Filters"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* File Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Files ({fileTypeCounts.all})</option>
                  <option value="images">Images ({fileTypeCounts.images || 0})</option>
                  <option value="documents">Documents ({fileTypeCounts.documents || 0})</option>
                  <option value="audio">Audio ({fileTypeCounts.audio || 0})</option>
                  <option value="video">Video ({fileTypeCounts.video || 0})</option>
                  <option value="archives">Archives ({fileTypeCounts.archives || 0})</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="uploadDate">Upload Date</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                  <option value="type">Type</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Selected Files Actions */}
        {selectedFiles.size > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <span className="text-blue-700 font-medium">
                {selectedFiles.size} file(s) selected
              </span>
              <button
                onClick={selectAll}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {selectedFiles.size === filteredFiles.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadSelectedFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={deleteSelectedFiles}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Display */}
      <div className="p-6">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FolderIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {!userId ? 'Loading...' : 'No files uploaded yet'}
            </h3>
            {!userId ? (
              <p className="text-gray-500">
                Loading your file manager...
              </p>
            ) : (
              <>
                <p className="text-gray-500 mb-2">
                  {searchQuery || filterType !== 'all' ? (
                    'No files match your search or filter criteria.'
                  ) : (
                    'You haven\'t uploaded any files yet.'
                  )}
                </p>
                {!searchQuery && filterType === 'all' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                    <p className="font-medium mb-2">Get started with file uploads:</p>
                    <ul className="text-left space-y-1">
                      <li>• Go to <strong>Register New IP</strong> to upload files with your IP registration</li>
                      <li>• Files are automatically stored on IPFS for decentralized access</li>
                      <li>• All uploaded files will appear here for easy management</li>
                    </ul>
                  </div>
                )}
                {(searchQuery || filterType !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="mt-3 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear filters to see all files
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-3"
          }>
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className={`
                  ${viewMode === 'grid' 
                    ? 'bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow'
                    : 'flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100'
                  }
                  ${selectedFiles.has(file._id) ? 'ring-2 ring-blue-500' : ''}
                  cursor-pointer
                `}
                onClick={() => onFileSelect && onFileSelect(file)}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="aspect-w-16 aspect-h-12">
                      <FilePreview file={file} size="small" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleFileSelection(file._id);
                          }}
                          className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(fileUploadService.getFileUrl(file.ipfsHash), '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fileUploadService.downloadFile(file.ipfsHash, file.name);
                          }}
                          className="text-gray-600 hover:text-gray-800"
                          title="Download"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleFileSelection(file._id);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                    />
                    
                    <div className="w-12 h-12 mr-4">
                      <FilePreview file={file} size="small" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(fileUploadService.getFileUrl(file.ipfsHash), '_blank');
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileUploadService.downloadFile(file.ipfsHash, file.name);
                        }}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;