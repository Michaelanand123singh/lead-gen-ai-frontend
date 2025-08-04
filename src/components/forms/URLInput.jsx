// frontend/src/components/forms/URLInput.js
import React, { useState } from 'react';
import { validateUrl } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const URLInput = ({ onSubmit, loading = false }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validation = validateUrl(url);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    onSubmit(validation.formattedUrl);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {error && (
          <ErrorMessage message={error} />
        )}

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            'Analyze Website'
          )}
        </button>
      </form>
    </div>
  );
};

export default URLInput;