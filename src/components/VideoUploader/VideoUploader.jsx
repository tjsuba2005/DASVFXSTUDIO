// src/components/VideoUploader.jsx (Updated for Google Cloud)

import React, { useState } from 'react';

function VideoUploader({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setUploadStatus('uploading');
    setError(null);

    try {
      // Step 1: Get the secure upload URL from our backend server
      const response = await fetch('http://localhost:3001/api/gcs/generate-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: selectedFile.type,
          originalFilename: selectedFile.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not get the upload URL from the server.');
      }

      const { uploadUrl, objectName } = await response.json();

      // Step 2: Upload the file directly to Google Cloud Storage using the signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': selectedFile.type },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload to Google Cloud Storage failed.');
      }

      setUploadStatus('success');
      console.log('Upload to GCS complete! Object name:', objectName);
      onUploadSuccess(objectName); // Notify parent of the new video's name

    } catch (err) {
      console.error(err);
      setError(err.message);
      setUploadStatus('error');
    }
  };

  return (
    <div className="video-uploader">
      <h3>Upload a New Video to GCS</h3>
      <input type="file" accept="video/*" onChange={handleFileSelect} disabled={uploadStatus === 'uploading'} />
      
      {selectedFile && (
        <button onClick={handleUpload} disabled={uploadStatus === 'uploading'}>
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Video'}
        </button>
      )}
      
      {uploadStatus === 'success' && <p style={{ color: 'green' }}>✓ Upload successful!</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default VideoUploader;