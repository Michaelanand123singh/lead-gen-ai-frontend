// frontend/src/pages/BulkPage.js
import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import BulkUpload from '../components/forms/BulkUpload';
import ProgressBar from '../components/dashboard/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate } from '../utils/helpers';
import { BULK_STATUS, POLLING_INTERVALS } from '../utils/constants';
import { analysisService } from '../services/analysisService';

const BulkPage = () => {
  const { error } = useAnalysis();
  const [bulkOperations, setBulkOperations] = useState([]);
  const [activeBulk, setActiveBulk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pollingIntervals, setPollingIntervals] = useState({});
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsPreview, setResultsPreview] = useState([]);

  // Fetch bulk operations on component mount
  useEffect(() => {
    fetchBulkOperations();
  }, []);

  // Poll active operations
  useEffect(() => {
    const intervals = {};
    
    bulkOperations.forEach(operation => {
      if (operation.status === BULK_STATUS.PROCESSING) {
        intervals[operation.bulk_id] = setInterval(() => {
          pollBulkStatus(operation.bulk_id);
        }, POLLING_INTERVALS.BULK);
      }
    });

    setPollingIntervals(intervals);

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [bulkOperations]);

  const fetchBulkOperations = async () => {
    try {
      const data = await analysisService.listBulkOperations();
      setBulkOperations(data.operations || []);
    } catch (err) {
      console.error('Failed to fetch bulk operations:', err);
    }
  };

  const pollBulkStatus = async (bulkId) => {
    try {
      const status = await analysisService.getBulkStatus(bulkId);
      
      setBulkOperations(prev => 
        prev.map(op => 
          op.bulk_id === bulkId ? { ...op, ...status } : op
        )
      );

      if (activeBulk?.bulk_id === bulkId) {
        setActiveBulk(prev => ({ ...prev, ...status }));
      }

      // Stop polling if completed
      if (status.status === BULK_STATUS.COMPLETED || status.status === BULK_STATUS.FAILED) {
        if (pollingIntervals[bulkId]) {
          clearInterval(pollingIntervals[bulkId]);
          setPollingIntervals(prev => {
            const { [bulkId]: removed, ...rest } = prev;
            return rest;
          });
        }
      }
    } catch (err) {
      console.error('Failed to poll bulk status:', err);
    }
  };

  const handleBulkSubmit = async ({ type, data }) => {
    setLoading(true);
    try {
      let result;
      if (type === 'urls') {
        result = await analysisService.bulkAnalyzeUrls(data);
      } else if (type === 'file') {
        result = await analysisService.bulkUploadFile(data);
      }

      setActiveBulk(result);
      fetchBulkOperations(); // Refresh list
    } catch (err) {
      console.error('Bulk submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (bulkId) => {
    try {
      setResultsLoading(true);
      const results = await analysisService.getBulkResults(bulkId);
      const normalized = Array.isArray(results.results) ? results.results : [];
      setResultsPreview(normalized);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setResultsPreview([]);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleDeleteBulk = async (bulkId) => {
    if (window.confirm('Are you sure you want to delete this bulk operation?')) {
      try {
        await analysisService.deleteBulkOperation(bulkId);
        setBulkOperations(prev => prev.filter(op => op.bulk_id !== bulkId));
        if (activeBulk?.bulk_id === bulkId) {
          setActiveBulk(null);
        }
      } catch (err) {
        console.error('Failed to delete bulk operation:', err);
      }
    }
  };

  const handleExportResults = async (bulkId, format = 'csv') => {
    try {
      await analysisService.exportBulkResults(bulkId, format);
    } catch (err) {
      console.error('Failed to export results:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Website Analysis</h1>
          <p className="mt-2 text-gray-600">
            Analyze multiple websites simultaneously using URL list or file upload
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Start Bulk Analysis
              </h2>
              <BulkUpload onBulkSubmit={handleBulkSubmit} loading={loading} />
            </div>

            {/* Active Operation */}
            {activeBulk && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Operation
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Operation ID:</span>
                    <span className="text-sm font-mono">{activeBulk.bulk_id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      activeBulk.status === BULK_STATUS.COMPLETED ? 'bg-green-100 text-green-800' :
                      activeBulk.status === BULK_STATUS.PROCESSING ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activeBulk.status}
                    </span>
                  </div>
                  
                  <ProgressBar
                    total={activeBulk.total_urls}
                    completed={activeBulk.completed}
                    failed={activeBulk.failed}
                    progress={activeBulk.completed + activeBulk.failed}
                    label="Analysis Progress"
                  />

                  {activeBulk.status === BULK_STATUS.COMPLETED && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleViewResults(activeBulk.bulk_id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Results
                      </button>
                      <button
                        onClick={() => handleExportResults(activeBulk.bulk_id, 'csv')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Export CSV
                      </button>
                    </div>
                  )}
                  {resultsLoading && (
                    <div className="mt-4">
                      <LoadingSpinner size="sm" text="Loading results..." />
                    </div>
                  )}
                  {!resultsLoading && resultsPreview.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Results Preview</h4>
                      <div className="overflow-x-auto border border-gray-200 rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Digital Maturity</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {resultsPreview.slice(0, 10).map((row) => {
                              const data = row.result_data || {};
                              return (
                                <tr key={row.analysis_id}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{row.url}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{row.status}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{row.company_name || data.company_name || 'N/A'}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{row.industry || data.industry || 'N/A'}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{data.digital_maturity_score ?? 0}</td>
                                  <td className="px-4 py-2 text-sm text-gray-700">{data.urgency_score ?? 0}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      {resultsPreview.length > 10 && (
                        <p className="mt-2 text-xs text-gray-500">Showing first 10 results. Export CSV to download all.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Operations History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Operations
              </h3>
              
              {bulkOperations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No bulk operations yet
                </p>
              ) : (
                <div className="space-y-4">
                  {bulkOperations.slice(0, 5).map((operation) => (
                    <div
                      key={operation.bulk_id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gray-500">
                          {formatDate(operation.created_at)}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          operation.status === BULK_STATUS.COMPLETED ? 'bg-green-100 text-green-800' :
                          operation.status === BULK_STATUS.PROCESSING ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {operation.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-2">
                        {operation.total_urls} URLs
                      </div>
                      
                      {operation.status === BULK_STATUS.PROCESSING && (
                        <ProgressBar
                          total={operation.total_urls}
                          completed={operation.completed}
                          failed={operation.failed}
                          progress={operation.completed + operation.failed}
                          size="sm"
                          showStats={false}
                        />
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => setActiveBulk(operation)}
                          className="text-xs text-blue-600 hover:text-blue-500"
                        >
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleDeleteBulk(operation.bulk_id)}
                          className="text-xs text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkPage;