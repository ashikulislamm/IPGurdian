import React, { useState, useRef } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  DocumentIcon,
  PhotoIcon,
  MusicalNoteIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import fileUploadService from '../../services/fileUploadService';

// Image Preview Component
export const ImagePreview = ({ file, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <PhotoIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={file.thumbnailHash ? 
          fileUploadService.getThumbnailUrl(file.thumbnailHash) : 
          fileUploadService.getFileUrl(file.ipfsHash)
        }
        alt={file.name}
        className={`w-full h-full object-cover rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      
      {/* Full size overlay button */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
        <button
          onClick={() => window.open(fileUploadService.getFileUrl(file.ipfsHash), '_blank')}
          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all"
        >
          <EyeIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

// Audio Preview Component
export const AudioPreview = ({ file, className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <MusicalNoteIcon className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
          <p className="text-sm text-gray-600">Audio File • {file.size}</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={fileUploadService.getFileUrl(file.ipfsHash)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Controls */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div 
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          ></div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5 ml-0.5" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-gray-600 hover:text-gray-800">
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Download"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Video Preview Component
export const VideoPreview = ({ file, className = "" }) => {
  const [showControls, setShowControls] = useState(false);
  
  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        src={fileUploadService.getFileUrl(file.ipfsHash)}
        className="w-full h-full object-contain"
        controls={showControls}
        poster={file.thumbnailHash ? fileUploadService.getThumbnailUrl(file.thumbnailHash) : undefined}
      />
      
      {!showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-4 group-hover:bg-opacity-70 transition-all">
            <VideoCameraIcon className="h-12 w-12 text-white" />
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white transition-all opacity-0 group-hover:opacity-100"
          title="Download"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Document Preview Component
export const DocumentPreview = ({ file, className = "" }) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  const getDocumentIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return '📄';
    if (['doc', 'docx'].includes(extension)) return '📝';
    if (extension === 'txt') return '📄';
    return '📄';
  };

  const getDocumentColor = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'pdf') return 'from-red-50 to-red-100 border-red-200';
    if (['doc', 'docx'].includes(extension)) return 'from-blue-50 to-blue-100 border-blue-200';
    if (extension === 'txt') return 'from-gray-50 to-gray-100 border-gray-200';
    return 'from-gray-50 to-gray-100 border-gray-200';
  };

  return (
    <div className={`bg-gradient-to-br ${getDocumentColor(file.name)} border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-4xl">{getDocumentIcon(file.name)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
          <p className="text-sm text-gray-600">Document • {file.size}</p>
        </div>
      </div>

      <div className="space-y-3">
        {file.description && (
          <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded">
            {file.description}
          </p>
        )}

        <div className="flex space-x-2">
          <button
            onClick={() => window.open(fileUploadService.getFileUrl(file.ipfsHash), '_blank')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View</span>
          </button>
          <button
            onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Archive Preview Component
export const ArchivePreview = ({ file, className = "" }) => {
  const getArchiveIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (extension === 'zip') return '🗜️';
    if (extension === 'rar') return '📦';
    if (extension === '7z') return '🗃️';
    return '📦';
  };

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-4xl">{getArchiveIcon(file.name)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
          <p className="text-sm text-gray-600">Archive • {file.size}</p>
        </div>
      </div>

      <div className="space-y-3">
        {file.description && (
          <p className="text-sm text-gray-700 bg-white bg-opacity-50 p-3 rounded">
            {file.description}
          </p>
        )}

        <button
          onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Download Archive</span>
        </button>
      </div>
    </div>
  );
};

// Code Preview Component
export const CodePreview = ({ file, className = "" }) => {
  const [codeContent, setCodeContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLanguageFromExtension = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React/JSX', 
      'ts': 'TypeScript',
      'tsx': 'TypeScript/JSX',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'xml': 'XML'
    };
    return languageMap[extension] || 'Code';
  };

  const loadCodePreview = async () => {
    if (codeContent !== null) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(fileUploadService.getFileUrl(file.ipfsHash));
      const text = await response.text();
      // Limit preview to first 500 characters
      setCodeContent(text.length > 500 ? text.substring(0, 500) + '...' : text);
    } catch (error) {
      setCodeContent('Error loading code preview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <CodeBracketIcon className="h-8 w-8 text-gray-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 truncate">{file.name}</h3>
            <p className="text-sm text-gray-600">{getLanguageFromExtension(file.name)} • {file.size}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {codeContent === null ? (
          <div className="text-center py-4">
            <button
              onClick={loadCodePreview}
              disabled={isLoading}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Loading Preview...' : 'Load Preview'}
            </button>
          </div>
        ) : (
          <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-48 overflow-y-auto font-mono">
            {codeContent}
          </pre>
        )}

        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => window.open(fileUploadService.getFileUrl(file.ipfsHash), '_blank')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 border"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View Full</span>
          </button>
          <button
            onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main File Preview Component
export const FilePreview = ({ file, size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "h-24",
    medium: "h-48", 
    large: "h-64",
    full: "h-full"
  };

  const containerClass = `${sizeClasses[size]} ${className}`;

  // Determine file category and render appropriate preview
  const category = fileUploadService.getFileCategory(file.mimetype || file.type);

  switch (category) {
    case 'images':
      return <ImagePreview file={file} className={containerClass} />;
    case 'audio':
      return <AudioPreview file={file} className={containerClass} />;
    case 'video':
      return <VideoPreview file={file} className={containerClass} />;
    case 'documents':
      return <DocumentPreview file={file} className={containerClass} />;
    case 'archives':
      return <ArchivePreview file={file} className={containerClass} />;
    default:
      // Check if it's a code file by extension
      const extension = file.name.split('.').pop().toLowerCase();
      const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'];
      
      if (codeExtensions.includes(extension)) {
        return <CodePreview file={file} className={containerClass} />;
      }
      
      // Default preview for unknown file types
      return (
        <div className={`bg-gray-100 rounded-lg p-6 flex items-center justify-center ${containerClass}`}>
          <div className="text-center text-gray-500">
            <DocumentIcon className="h-12 w-12 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800 truncate mb-1">{file.name}</h3>
            <p className="text-sm">Unknown file type • {file.size}</p>
            <button
              onClick={() => fileUploadService.downloadFile(file.ipfsHash, file.name)}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      );
  }
};

export default FilePreview;