// frontend/src/components/leads/ContactInfoSummary.jsx
import React from 'react';

const ContactInfoSummary = ({ leads }) => {
  const getContactStats = () => {
    const total = leads.length;
    const withEmail = leads.filter(lead => lead.contact_email).length;
    const withPhone = leads.filter(lead => lead.contact_phone).length;
    const withAddress = leads.filter(lead => lead.contact_address).length;
    const withAllContact = leads.filter(lead => 
      lead.contact_email && lead.contact_phone && lead.contact_address
    ).length;
    const withNoContact = leads.filter(lead => 
      !lead.contact_email && !lead.contact_phone && !lead.contact_address
    ).length;

    return {
      total,
      withEmail,
      withPhone,
      withAddress,
      withAllContact,
      withNoContact,
      emailPercentage: total > 0 ? Math.round((withEmail / total) * 100) : 0,
      phonePercentage: total > 0 ? Math.round((withPhone / total) * 100) : 0,
      addressPercentage: total > 0 ? Math.round((withAddress / total) * 100) : 0,
      allContactPercentage: total > 0 ? Math.round((withAllContact / total) * 100) : 0
    };
  };

  const stats = getContactStats();

  if (leads.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Email Coverage */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
            <svg className="w-16 h-16 text-gray-200" fill="currentColor" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <svg 
              className="absolute w-16 h-16 text-green-500 transform -rotate-90" 
              fill="currentColor" 
              viewBox="0 0 36 36"
              style={{
                strokeDasharray: `${stats.emailPercentage * 1.13} 113`,
                strokeDashoffset: 0
              }}
            >
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-sm font-semibold text-gray-700">
              {stats.emailPercentage}%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">Email Coverage</p>
          <p className="text-xs text-gray-500">{stats.withEmail} of {stats.total} leads</p>
        </div>

        {/* Phone Coverage */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
            <svg className="w-16 h-16 text-gray-200" fill="currentColor" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <svg 
              className="absolute w-16 h-16 text-blue-500 transform -rotate-90" 
              fill="currentColor" 
              viewBox="0 0 36 36"
              style={{
                strokeDasharray: `${stats.phonePercentage * 1.13} 113`,
                strokeDashoffset: 0
              }}
            >
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-sm font-semibold text-gray-700">
              {stats.phonePercentage}%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">Phone Coverage</p>
          <p className="text-xs text-gray-500">{stats.withPhone} of {stats.total} leads</p>
        </div>

        {/* Address Coverage */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
            <svg className="w-16 h-16 text-gray-200" fill="currentColor" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <svg 
              className="absolute w-16 h-16 text-purple-500 transform -rotate-90" 
              fill="currentColor" 
              viewBox="0 0 36 36"
              style={{
                strokeDasharray: `${stats.addressPercentage * 1.13} 113`,
                strokeDashoffset: 0
              }}
            >
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-sm font-semibold text-gray-700">
              {stats.addressPercentage}%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">Address Coverage</p>
          <p className="text-xs text-gray-500">{stats.withAddress} of {stats.total} leads</p>
        </div>

        {/* Complete Contact Info */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-3">
            <svg className="w-16 h-16 text-gray-200" fill="currentColor" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <svg 
              className="absolute w-16 h-16 text-indigo-500 transform -rotate-90" 
              fill="currentColor" 
              viewBox="0 0 36 36"
              style={{
                strokeDasharray: `${stats.allContactPercentage * 1.13} 113`,
                strokeDashoffset: 0
              }}
            >
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="absolute text-sm font-semibold text-gray-700">
              {stats.allContactPercentage}%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">Complete Contact</p>
          <p className="text-xs text-gray-500">{stats.withAllContact} of {stats.total} leads</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.withEmail}</p>
            <p className="text-sm text-gray-600">Leads with Email</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.withPhone}</p>
            <p className="text-sm text-gray-600">Leads with Phone</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.withAddress}</p>
            <p className="text-sm text-gray-600">Leads with Address</p>
          </div>
        </div>
        
        {stats.withNoContact > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-red-600">{stats.withNoContact}</span> leads have no contact information
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoSummary;
