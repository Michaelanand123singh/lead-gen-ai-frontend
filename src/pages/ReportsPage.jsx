// frontend/src/pages/ReportsPage.js
import React, { useState, useCallback } from 'react';
import ReportList from '../components/reports/ReportList';
import ReportExport from '../components/reports/ReportExport';
import { analysisService } from '../services/analysisService';
import ReportDetailsModal from '../components/reports/ReportDetailsModal';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewReport = useCallback(async (reportSummary) => {
    try {
      setDetailsError(null);
      setDetailsLoading(true);
      const full = await analysisService.getAnalysis(reportSummary.id);
      setSelectedReport(full);
      setIsModalOpen(true);
    } catch (e) {
      setDetailsError(e.message || 'Failed to load report details');
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-2">
              View and manage your website analysis reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <ReportList onViewReport={handleViewReport} />
            <ReportDetailsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              report={selectedReport}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ReportExport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;