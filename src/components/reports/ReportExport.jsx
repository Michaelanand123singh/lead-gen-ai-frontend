// frontend/src/components/reports/ReportExport.jsx
import React, { useState } from 'react';
import { useReports } from '../../hooks/useReports';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ReportExport = () => {
  const {
    exportCsv,
    exportExcel,
    stats,
    fetchStats,
    error
  } = useReports();

  const [loading, setLoading] = useState({
    csv: false,
    excel: false,
    stats: false
  });

  const handleExportCsv = async () => {
    setLoading(prev => ({ ...prev, csv: true }));
    try {
      await exportCsv();
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setLoading(prev => ({ ...prev, csv: false }));
    }
  };

  const handleExportExcel = async () => {
    setLoading(prev => ({ ...prev, excel: true }));
    try {
      await exportExcel();
    } catch (err) {
      console.error('Excel export failed:', err);
    } finally {
      setLoading(prev => ({ ...prev, excel: false }));
    }
  };

  const handleRefreshStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      await fetchStats();
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Export Reports</h3>
          <p className="text-sm text-gray-600">Download all completed analyses</p>
        </div>
        <button
          onClick={handleRefreshStats}
          disabled={loading.stats}
          className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading.stats ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} className="mb-6" />
      )}

      {/* Statistics */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Export Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-2xl font-semibold text-gray-900">{stats.total_analyses || 0}</div>
              <div className="text-gray-600">Total Analyses</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-green-600">{stats.completed || 0}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-red-600">{stats.failed || 0}</div>
              <div className="text-gray-600">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-blue-600">{stats.success_rate || 0}%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">CSV Format</h4>
                <p className="text-xs text-gray-600">Spreadsheet compatible</p>
              </div>
            </div>
            <button
              onClick={handleExportCsv}
              disabled={loading.csv || !stats?.completed}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.csv ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV
                </>
              )}
            </button>
          </div>

          {/* Excel Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Excel Format</h4>
                <p className="text-xs text-gray-600">Advanced formatting</p>
              </div>
            </div>
            <button
              onClick={handleExportExcel}
              disabled={loading.excel || !stats?.completed}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.excel ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* Note */}
        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Note:</strong> Only completed analyses will be included in the export. 
            The export includes company information, scores, recommendations, and analysis details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportExport;