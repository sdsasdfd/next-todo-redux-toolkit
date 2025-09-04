import { useState, useCallback } from 'react';

export const useBunnyVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const uploadVideo = useCallback(async (file, title, collectionId = null) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Step 1: Create video entry
      const createResponse = await fetch('/api/video/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, collectionId }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create video');
      }

      const createdVideo = await createResponse.json();
      setVideoData(createdVideo);

      // Step 2: Upload file with progress tracking
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setIsUploading(false);
            resolve(createdVideo);
          } else {
            setIsUploading(false);
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          setIsUploading(false);
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', `/api/video/upload?guid=${createdVideo.guid}`);
        xhr.send(formData);
      });

    } catch (err) {
      setError(err.message);
      setIsUploading(false);
      throw err;
    }
  }, []);

  const getVideoStatus = useCallback(async (guid) => {
    try {
      const response = await fetch(`/api/video/status/${guid}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setVideoData(null);
  }, []);

  return {
    uploadVideo,
    getVideoStatus,
    isUploading,
    uploadProgress,
    error,
    videoData,
    reset,
  };
};