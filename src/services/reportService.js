// frontend/src/services/reportService.js - FIXED VERSION
import apiClient from './api';

export const reportService = {
  // List reports
  listReports: async (skip = 0, limit = 100) => {
    return await apiClient.get('/reports', { skip, limit });
  },

  // Download PDF report
  downloadPdfReport: async (analysisId) => {
    const response = await apiClient.get(`/reports/${analysisId}/pdf`);
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analysis_${analysisId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  // Export CSV report
  exportCsvReport: async () => {
    const response = await apiClient.get('/reports/export/csv');
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'website_analyses.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  // Export Excel report
  exportExcelReport: async () => {
    const response = await apiClient.get('/reports/export/excel');
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'website_analyses.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  // Delete report
  deleteReport: async (analysisId) => {
    return await apiClient.delete(`/reports/${analysisId}`);
  },

  // Get report statistics
  getReportStats: async () => {
    return await apiClient.get('/reports/stats');
  }
};