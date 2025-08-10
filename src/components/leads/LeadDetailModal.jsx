// frontend/src/components/leads/LeadDetailModal.jsx
import React from 'react';

const LeadDetailModal = ({ lead, isOpen, onClose }) => {
  if (!isOpen || !lead) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {lead.name || 'Unknown Company'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Lead Details & Analysis Results
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Company Information
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Website</label>
                  <a 
                    href={lead.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {lead.website}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Industry</label>
                  <p className="text-gray-900">{lead.industry || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Company Size</label>
                  <p className="text-gray-900">{lead.size || 'Not specified'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-900">{lead.description || 'No description available'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">Analysis Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.analysis_status)}`}>
                    {getStatusText(lead.analysis_status)}
                  </span>
                </div>
              </div>

              {/* Contact & Analysis Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Contact & Analysis
                </h4>

                {/* Enhanced Contact Information */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Email</label>
                    {lead.contact_email ? (
                      <a 
                        href={`mailto:${lead.contact_email}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {lead.contact_email}
                      </a>
                    ) : (
                      <p className="text-gray-500">No contact email available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                    {lead.contact_phone ? (
                      <a 
                        href={`tel:${lead.contact_phone}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {lead.contact_phone}
                      </a>
                    ) : (
                      <p className="text-gray-500">No contact phone available</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Address</label>
                    {lead.contact_address ? (
                      <p className="text-gray-900">{lead.contact_address}</p>
                    ) : (
                      <p className="text-gray-500">No contact address available</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Analyzed</label>
                    <p className="text-gray-900">{formatDate(lead.last_analyzed)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{formatDate(lead.created_at)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-gray-900">{formatDate(lead.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            {lead.technologies && lead.technologies.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lead.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {lead.analysis_data && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Analysis Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.analysis_data.business_purpose && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Business Purpose</label>
                      <p className="text-gray-900">{lead.analysis_data.business_purpose}</p>
                    </div>
                  )}
                  
                  {lead.analysis_data.pain_points && lead.analysis_data.pain_points.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Pain Points</label>
                      <ul className="list-disc list-inside text-gray-900">
                        {lead.analysis_data.pain_points.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lead.analysis_data.recommendations && lead.analysis_data.recommendations.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Recommendations</label>
                      <ul className="list-disc list-inside text-gray-900">
                        {lead.analysis_data.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {lead.analysis_data.digital_maturity_score !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Digital Maturity Score</label>
                      <p className="text-gray-900">{lead.analysis_data.digital_maturity_score}/10</p>
                    </div>
                  )}

                  {lead.analysis_data.urgency_score !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Urgency Score</label>
                      <p className="text-gray-900">{lead.analysis_data.urgency_score}/10</p>
                    </div>
                  )}

                  {lead.analysis_data.potential_value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Potential Value</label>
                      <p className="text-gray-900">{lead.analysis_data.potential_value}</p>
                    </div>
                  )}

                  {lead.analysis_data.outreach_strategy && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Outreach Strategy</label>
                      <p className="text-gray-900">{lead.analysis_data.outreach_strategy}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              {/* Contact Export Section */}
              {(lead.contact_email || lead.contact_phone || lead.contact_address) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Export Contact:</span>
                  <button
                    onClick={() => {
                      const contactInfo = [
                        lead.name || 'Unknown Company',
                        lead.website || '',
                        lead.contact_email || '',
                        lead.contact_phone || '',
                        lead.contact_address || ''
                      ].filter(Boolean).join('\t');
                      navigator.clipboard.writeText(contactInfo);
                      // You could add a toast notification here
                    }}
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
                {lead.website && (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;



