import React, { useState, useRef } from 'react';
import { uploadFile } from '../api';

const Upload = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      onTextExtracted(result.full_text);
      setUploaded(true);
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Learning Material
      </h2>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-800/50">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx,.txt"
          className="hidden"
        />
        {file ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium truncate max-w-xs">{file.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFile(null)}
                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                Remove
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm transition"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 dark:text-gray-400">Drag & drop your file here, or</p>
            <button
              onClick={triggerFileInput}
              className="mt-3 px-5 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">PDF, DOCX, PPTX, TXT</p>
          </div>
        )}
        {uploaded && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">✅ File processed successfully!</p>
        )}
      </div>
    </div>
  );
};

export default Upload;