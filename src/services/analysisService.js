// frontend/src/services/analysisService.js - FIXED VERSION
import apiClient from './api';

export const analysisService = {
  // Single URL analysis
  analyzeWebsite: async (url) => {
    return await apiClient.post('/analyze', { url });
  },

  // Get analysis by ID
  getAnalysis: async (analysisId) => {
    return await apiClient.get(`/analyze/${analysisId}`);
  },

  // List all analyses
  listAnalyses: async (skip = 0, limit = 100) => {
    return await apiClient.get('/analyze', { skip, limit });
  },

  // Delete analysis
  deleteAnalysis: async (analysisId) => {
    return await apiClient.delete(`/analyze/${analysisId}`);
  },

  // Bulk analysis with URLs
  bulkAnalyzeUrls: async (urls) => {
    return await apiClient.post('/bulk/urls', { urls });
  },

  // Bulk upload file
  bulkUploadFile: async (file) => {
    return await apiClient.uploadFile('/bulk/upload', file);
  },

  // Get bulk operation status
  getBulkStatus: async (bulkId) => {
    return await apiClient.get(`/bulk/${bulkId}/status`);
  },

  // Get bulk results
  getBulkResults: async (bulkId) => {
    return await apiClient.get(`/bulk/${bulkId}/results`);
  },

  // List bulk operations
  listBulkOperations: async () => {
    return await apiClient.get('/bulk/operations');
  },

  // Delete bulk operation
  deleteBulkOperation: async (bulkId) => {
    return await apiClient.delete(`/bulk/${bulkId}`);
  },

  // Export bulk results
  exportBulkResults: async (bulkId, format = 'json') => {
    const response = await apiClient.get(`/bulk/${bulkId}/export`, { format });
    
    if (format === 'csv') {
      // response is text for CSV; ensure string
      const csvText = typeof response === 'string' ? response : await response.text?.();
      const url = window.URL.createObjectURL(new Blob([csvText || ''], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulk_results_${bulkId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    
    return response;
  }
};