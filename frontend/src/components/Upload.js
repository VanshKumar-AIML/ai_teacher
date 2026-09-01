import React, { useState } from 'react';
import { uploadFile } from '../api';

const Upload = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      onTextExtracted(result.full_text);
      alert('File uploaded and text extracted!');
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  return (
    <div className="mb-6 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Upload Learning Material</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.txt" />
      <button 
        onClick={handleUpload} 
        disabled={!file || uploading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <p className="text-sm text-gray-500 mt-2">Supported: PDF, DOCX, PPTX, TXT</p>
    </div>
  );
};

export default Upload;