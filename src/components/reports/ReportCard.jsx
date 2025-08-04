// frontend/src/components/reports/ReportCard.js
import React from 'react';
import { formatDate, formatUrl, getStatusColor } from '../../utils/helpers';

const ReportCard = ({ report, onDownloadPdf, onDelete, onView }) => {
  const {
    id,
    url,
    company_name,
    industry,
    digital_maturity_score = 0,
    urgency_score = 0,
    created_at,
    status
  } = report;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {company_name || formatUrl(url)}
            </h3>
            <p className="text-sm text-gray-500 truncate">{url}</p>
            {industry && (
              <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                {industry}
              </span>
            )}
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(digital_maturity_score)}`}>
              {digital_maturity_score}
            </div>
            <div className="text-sm text-gray-600">Digital Maturity</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(urgency_score)}`}>
              {urgency_score}
            </div>
            <div className="text-sm text-gray-600">Urgency Score</div>
          </div>
        </div>

        {/* Meta info */}
        <div className="text-xs text-gray-500 mb-4">
          Created: {formatDate(created_at)}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView?.(report)}
            className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
          >
            View Details
          </button>
          
          <button
            onClick={() => onDownloadPdf?.(id)}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            title="Download PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete?.(id)}
            className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;