// frontend/src/hooks/useReports.js
import { useState, useCallback } from 'react';
import {reportService} from '../services/reportService';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch reports list
  const fetchReports = useCallback(async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.listReports(skip, limit);
      setReports(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch report statistics
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const data = await reportService.getReportStats();
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
      throw err;
    }
  }, []);

  // Download PDF report
  const downloadPdf = useCallback(async (analysisId) => {
    try {
      setError(null);
      await reportService.downloadPdfReport(analysisId);
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
      throw err;
    }
  }, []);

  // Export CSV report
  const exportCsv = useCallback(async () => {
    try {
      setError(null);
      await reportService.exportCsvReport();
    } catch (err) {
      setError(err.message || 'Failed to export CSV');
      throw err;
    }
  }, []);

  // Export Excel report
  const exportExcel = useCallback(async () => {
    try {
      setError(null);
      await reportService.exportExcelReport();
    } catch (err) {
      setError(err.message || 'Failed to export Excel');
      throw err;
    }
  }, []);

  // Delete report
  const deleteReport = useCallback(async (analysisId) => {
    try {
      setError(null);
      await reportService.deleteReport(analysisId);
      
      // Remove from local state
      setReports(prev => prev.filter(r => r.id !== analysisId));
      
      // Update stats if available
      if (stats) {
        setStats(prev => ({
          ...prev,
          total_analyses: prev.total_analyses - 1,
          completed: prev.completed - 1
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete report');
      throw err;
    }
  }, [stats]);

  // Get reports with high scores
  const getHighScoreReports = useCallback((threshold = 70) => {
    return reports.filter(report => 
      report.digital_maturity_score >= threshold || 
      report.urgency_score >= threshold
    );
  }, [reports]);

  // Get reports by industry
  const getReportsByIndustry = useCallback((industry) => {
    return reports.filter(report => 
      report.industry && 
      report.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }, [reports]);

  // Get recent reports
  const getRecentReports = useCallback((days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return reports.filter(report => 
      new Date(report.created_at) >= cutoffDate
    );
  }, [reports]);

  return {
    // State
    reports,
    stats,
    loading,
    error,

    // Actions
    fetchReports,
    fetchStats,
    downloadPdf,
    exportCsv,
    exportExcel,
    deleteReport,

    // Helpers
    getHighScoreReports,
    getReportsByIndustry,
    getRecentReports,

    // Clear functions
    clearError: () => setError(null)
  };
};

export default useReports;