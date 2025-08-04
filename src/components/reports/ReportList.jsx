// frontend/src/components/reports/ReportList.js
import React, { useState, useEffect } from 'react';
import { useReports } from '../../hooks/useReports';
import ReportCard from './ReportCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ReportList = ({ onViewReport }) => {
  const {
    reports,
    loading,
    error,
    fetchReports,
    downloadPdf,
    deleteReport
  } = useReports();

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
      } catch (err) {
        console.error('Failed to delete report:', err);
      }
    }
  };

  const handleDownloadPdf = async (reportId) => {
    try {
      await downloadPdf(reportId);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      // Search filter
      const matchesSearch = !searchTerm || 
        report.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.industry?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesFilter = filter === 'all' || 
        (filter === 'high-score' && (report.digital_maturity_score >= 70 || report.urgency_score >= 70)) ||
        (filter === 'recent' && new Date(report.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'company_name':
          return (a.company_name || '').localeCompare(b.company_name || '');
        case 'digital_maturity_score':
          return (b.digital_maturity_score || 0) - (a.digital_maturity_score || 0);
        case 'urgency_score':
          return (b.urgency_score || 0) - (a.urgency_score || 0);
        case 'created_at':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={fetchReports}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="high-score">High Scores</option>
              <option value="recent">Recent (7 days)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created_at">Sort by Date</option>
              <option value="company_name">Sort by Company</option>
              <option value="digital_maturity_score">Sort by Digital Score</option>
              <option value="urgency_score">Sort by Urgency Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredReports.length} of {reports.length} reports
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm || filter !== 'all' ? 'No reports match your filters' : 'No reports found'}
          </div>
          {(searchTerm || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="mt-2 text-blue-600 hover:text-blue-500 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onView={onViewReport}
              onDownloadPdf={handleDownloadPdf}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;