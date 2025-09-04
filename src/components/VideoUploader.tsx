'use client'; // For App Router

import React, { useState, useRef, useEffect } from 'react';
import { useBunnyVideoUpload } from '../hooks/useBunnyVideoUpload';

const VideoUploader = ({ onUploadComplete }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState(0);
  const [isPollingStatus, setIsPollingStatus] = useState(false);

  const {
    uploadVideo,
    getVideoStatus,
    isUploading,
    uploadProgress,
    error,
    videoData,
    reset,
  } = useBunnyVideoUpload();

  // Poll encoding status
  useEffect(() => {
    if (videoData && !isPollingStatus) {
      setIsPollingStatus(true);
      const pollStatus = async () => {
        try {
          const status = await getVideoStatus(videoData.guid);
          setEncodingProgress(status.encodeProgress);
          
          if (status.encodeProgress === 100) {
            setIsPollingStatus(false);
            onUploadComplete?.(status);
          } else {
            setTimeout(pollStatus, 2000); // Poll every 2 seconds
          }
        } catch (err) {
          console.error('Failed to get video status:', err);
          setIsPollingStatus(false);
        }
      };
      
      setTimeout(pollStatus, 1000); // Start polling after 1 second
    }
  }, [videoData, getVideoStatus, onUploadComplete, isPollingStatus]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/mkv', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid video file');
      return;
    }

    // Validate file size (5GB limit)
    const maxSize = 5 * 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5GB');
      return;
    }

    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      alert('Please select a file and enter a title');
      return;
    }

    try {
      await uploadVideo(selectedFile, title);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setTitle('');
    setEncodingProgress(0);
    setIsPollingStatus(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Video to Bunny.net</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!videoData && (
        <>
          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              <div>
                <p className="text-lg text-gray-600">
                  {selectedFile ? selectedFile.name : 'Drag and drop your video file here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
              </div>
              
              {selectedFile && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Size: {formatFileSize(selectedFile.size)}</p>
                  <p>Type: {selectedFile.type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="mt-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video title"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !title || isUploading}
            className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Upload Progress</span>
            <span className="text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Encoding Progress */}
      {videoData && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-semibold text-green-800">Upload Complete!</h3>
            <p className="text-sm text-green-700 mt-1">
              Video ID: {videoData.guid}
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Encoding Progress</span>
              <span className="text-sm text-gray-600">{encodingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${encodingProgress}%` }}
              ></div>
            </div>
            {encodingProgress < 100 && (
              <p className="text-xs text-gray-500 mt-1">
                Your video is being processed. This may take several minutes.
              </p>
            )}
          </div>
          
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Upload Another Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;