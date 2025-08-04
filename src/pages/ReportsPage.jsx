// frontend/src/pages/ReportsPage.js
import React from 'react';
import ReportList from '../components/reports/ReportList';
import ReportExport from '../components/reports/ReportExport';

const ReportsPage = () => {
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
          <div className="lg:col-span-3">
            <ReportList />
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