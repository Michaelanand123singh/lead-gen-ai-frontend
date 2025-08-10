// frontend/src/pages/LeadsPage.jsx
import React, { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import LeadCard from '../components/leads/LeadCard';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import LeadSearch from '../components/leads/LeadSearch';
import LeadFilters from '../components/leads/LeadFilters';
import ContactInfoSummary from '../components/leads/ContactInfoSummary';
import ContactExport from '../components/leads/ContactExport';

const LeadsPage = () => {
  const {
    leads,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    refreshLeads
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    size: '',
    hasContact: false,
    hasPhone: false,
    hasAddress: false,
    analysisStatus: ''
  });

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedLead(null);
  };

  const applyFilters = (data) => {
    let filtered = data;

    if (filters.industry) {
      filtered = filtered.filter(lead => 
        lead.industry && lead.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    if (filters.size) {
      filtered = filtered.filter(lead => 
        lead.size && lead.size.toLowerCase().includes(filters.size.toLowerCase())
      );
    }

    if (filters.hasContact) {
      filtered = filtered.filter(lead => lead.contact_email);
    }

    if (filters.hasPhone) {
      filtered = filtered.filter(lead => lead.contact_phone);
    }

    if (filters.hasAddress) {
      filtered = filtered.filter(lead => lead.contact_address);
    }

    if (filters.analysisStatus) {
      filtered = filtered.filter(lead => lead.analysis_status === filters.analysisStatus);
    }

    return filtered;
  };

  const displayData = searchQuery ? searchResults : leads;
  const filteredData = applyFilters(displayData);

  const getStats = () => {
    const total = leads.length;
    const withContact = leads.filter(lead => lead.contact_email).length;
    const withPhone = leads.filter(lead => lead.contact_phone).length;
    const withAddress = leads.filter(lead => lead.contact_address).length;
    const analyzed = leads.filter(lead => lead.analysis_status === 'completed').length;
    const pending = leads.filter(lead => lead.analysis_status === 'pending').length;

    return { total, withContact, withPhone, withAddress, analyzed, pending };
  };

  const stats = getStats();

  if (loading && !leads.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !leads.length) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={refreshLeads} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1>
        <p className="text-gray-600">
          Manage and view all your analyzed website leads with contact details and company information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Email</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.withContact}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Phone</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.withPhone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Address</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.withAddress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.analyzed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Summary */}
      <ContactInfoSummary leads={leads} />

      {/* Contact Export */}
      <ContactExport leads={leads} />

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <LeadSearch 
          value={searchQuery}
          onChange={setSearchQuery}
          searching={searching}
        />
        <LeadFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              {searchQuery ? `Search Results (${filteredData.length})` : `All Leads (${filteredData.length})`}
            </h2>
            <button
              onClick={refreshLeads}
              disabled={loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="p-6">
            <ErrorMessage message={error} onRetry={refreshLeads} />
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No leads found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search terms or filters.' : 'Start by analyzing some websites to generate leads.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="divide-y divide-gray-200">
            {filteredData.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => handleLeadClick(lead)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={showDetailModal}
          onClose={closeDetailModal}
        />
      )}
    </div>
  );
};

export default LeadsPage;



