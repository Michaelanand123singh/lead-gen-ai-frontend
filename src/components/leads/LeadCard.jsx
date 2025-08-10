// frontend/src/components/leads/LeadCard.jsx
import React from 'react';

const LeadCard = ({ lead, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Analyzed';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Not Analyzed';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div 
      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Company Name and Website */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {lead.name || 'Unknown Company'}
              </h3>
              <p className="text-sm text-blue-600 hover:text-blue-800 truncate">
                {lead.website}
              </p>
            </div>
          </div>

          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Industry</p>
              <p className="text-sm text-gray-900">
                {lead.industry || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Company Size</p>
              <p className="text-sm text-gray-900">
                {lead.size || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Analyzed</p>
              <p className="text-sm text-gray-900">
                {formatDate(lead.last_analyzed)}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          {lead.contact_email && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Contact Information</p>
              <div className="space-y-2">
                {/* Email */}
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href={`mailto:${lead.contact_email}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.contact_email}
                  </a>
                </div>
                
                {/* Phone */}
                {lead.contact_phone && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a 
                      href={`tel:${lead.contact_phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.contact_phone}
                    </a>
                  </div>
                )}
                
                {/* Address */}
                {lead.contact_address && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-900">
                      {lead.contact_address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technologies */}
          {lead.technologies && lead.technologies.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {lead.technologies.slice(0, 5).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tech}
                  </span>
                ))}
                {lead.technologies.length > 5 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{lead.technologies.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {lead.description && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-900 line-clamp-2">
                {lead.description}
              </p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="ml-4 flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.analysis_status)}`}>
            {getStatusText(lead.analysis_status)}
          </span>
        </div>
      </div>

      {/* Action Hints */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Click to view detailed information and analysis results
        </p>
      </div>
    </div>
  );
};

export default LeadCard;



