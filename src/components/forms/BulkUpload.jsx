// frontend/src/components/forms/BulkUpload.js
import React, { useState } from 'react';
import { validateUrls } from '../../utils/validation';
import FileUploader from './FileUploader';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const BulkUpload = ({ onBulkSubmit, loading = false }) => {
  const [method, setMethod] = useState('urls'); // 'urls' or 'file'
  const [urlText, setUrlText] = useState('');
  const [error, setError] = useState('');

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    setError('');

    const urls = urlText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const validation = validateUrls(urls);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    onBulkSubmit({ type: 'urls', data: validation.validUrls });
  };

  const handleFileUpload = (file) => {
    setError('');
    onBulkSubmit({ type: 'file', data: file });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Method Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setMethod('urls')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              method === 'urls'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Paste URLs
          </button>
          <button
            onClick={() => setMethod('file')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              method === 'file'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {/* URL Input Method */}
      {method === 'urls' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div>
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
              Enter URLs (one per line)
            </label>
            <textarea
              id="urls"
              value={urlText}
              onChange={(e) => setUrlText(e.target.value)}
              placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500">
              Maximum 500 URLs. You can paste URLs with or without http/https.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            disabled={loading || !urlText.trim()}
            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              'Start Bulk Analysis'
            )}
          </button>
        </form>
      )}

      {/* File Upload Method */}
      {method === 'file' && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Upload CSV or Excel file
          </h3>
          <FileUploader 
            onFileUpload={handleFileUpload} 
            loading={loading}
          />
          {error && (
            <div className="mt-4">
              <ErrorMessage message={error} />
            </div>
          )}
          <div className="mt-4 text-xs text-gray-500">
            <p><strong>File requirements:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>CSV or Excel format (.csv, .xlsx, .xls)</li>
              <li>Maximum file size: 10MB</li>
              <li>URLs should be in a column named 'url', 'website', or 'domain'</li>
              <li>Maximum 500 URLs per file</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;