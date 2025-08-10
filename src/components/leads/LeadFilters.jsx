// frontend/src/components/leads/LeadFilters.jsx
import React, { useState } from 'react';

const LeadFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      industry: '',
      size: '',
      hasContact: false,
      hasPhone: false,
      hasAddress: false,
      analysisStatus: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Industry Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            value={filters.industry}
            onChange={(e) => handleFilterChange('industry', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Technology"
          />
        </div>

        {/* Company Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <input
            type="text"
            value={filters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Small, Medium"
          />
        </div>

        {/* Analysis Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Analysis Status
          </label>
          <select
            value={filters.analysisStatus}
            onChange={(e) => handleFilterChange('analysisStatus', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="not_analyzed">Not Analyzed</option>
          </select>
        </div>

        {/* Has Contact Email Filter */}
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasContact}
              onChange={(e) => handleFilterChange('hasContact', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Has Email
            </span>
          </label>
        </div>

        {/* Has Phone Filter */}
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasPhone}
              onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Has Phone
            </span>
          </label>
        </div>

        {/* Has Address Filter */}
        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.hasAddress}
              onChange={(e) => handleFilterChange('hasAddress', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Has Address
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;



