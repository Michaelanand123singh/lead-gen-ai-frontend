// frontend/src/hooks/useAnalysis.js
import { useState, useEffect, useCallback } from 'react';
import {analysisService} from '../services/analysisService';
import { ANALYSIS_STATUS, POLLING_INTERVALS } from '../utils/constants';

export const useAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Single analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Fetch all analyses
  const fetchAnalyses = useCallback(async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analysisService.listAnalyses(skip, limit);
      setAnalyses(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analyses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Start single analysis
  const startAnalysis = useCallback(async (url) => {
    try {
      setAnalysisLoading(true);
      setError(null);
      const result = await analysisService.analyzeWebsite(url);
      
      // Normalize for UI expectations
      const normalized = {
        analysis_id: result.analysis_id,
        status: result.status || ANALYSIS_STATUS.PROCESSING,
        result: result.result || null,
        message: result.message,
      };
      
      // Add to analyses list
      if (normalized.analysis_id) {
        fetchAnalyses(); // Refresh list
      }
      
      return normalized;
    } catch (err) {
      setError(err.message || 'Failed to start analysis');
      throw err;
    } finally {
      setAnalysisLoading(false);
    }
  }, [fetchAnalyses]);

  // Get specific analysis
  const getAnalysis = useCallback(async (analysisId) => {
    try {
      setAnalysisLoading(true);
      setError(null);
      const data = await analysisService.getAnalysis(analysisId);
      setCurrentAnalysis(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis');
      throw err;
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  // Delete analysis
  const deleteAnalysis = useCallback(async (analysisId) => {
    try {
      setError(null);
      await analysisService.deleteAnalysis(analysisId);
      
      // Remove from local state
      setAnalyses(prev => prev.filter(a => a.id !== analysisId));
      
      if (currentAnalysis?.id === analysisId) {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete analysis');
      throw err;
    }
  }, [currentAnalysis]);

  // Poll for analysis status updates
  const pollAnalysis = useCallback((analysisId, onUpdate) => {
    const interval = setInterval(async () => {
      try {
        const data = await analysisService.getAnalysis(analysisId);
        const normalized = {
          id: data.id,
          url: data.url,
          status: data.status || ANALYSIS_STATUS.PROCESSING,
          result: data.result || data.result_data || null,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        onUpdate(normalized);
        
        // Stop polling if completed or failed
        if (normalized.status === ANALYSIS_STATUS.COMPLETED || normalized.status === ANALYSIS_STATUS.FAILED) {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(interval);
      }
    }, POLLING_INTERVALS.ANALYSIS);

    return () => clearInterval(interval);
  }, []);

  // Get analyses by status
  const getAnalysesByStatus = useCallback((status) => {
    return analyses.filter(analysis => analysis.status === status);
  }, [analyses]);

  // Get analysis statistics
  const getAnalysisStats = useCallback(() => {
    const total = analyses.length;
    const completed = getAnalysesByStatus(ANALYSIS_STATUS.COMPLETED).length;
    const processing = getAnalysesByStatus(ANALYSIS_STATUS.PROCESSING).length;
    const failed = getAnalysesByStatus(ANALYSIS_STATUS.FAILED).length;
    const pending = getAnalysesByStatus(ANALYSIS_STATUS.PENDING).length;

    return {
      total,
      completed,
      processing,
      failed,
      pending,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [analyses, getAnalysesByStatus]);

  return {
    // State
    analyses,
    currentAnalysis,
    loading,
    analysisLoading,
    error,

    // Actions
    fetchAnalyses,
    startAnalysis,
    getAnalysis,
    deleteAnalysis,
    pollAnalysis,

    // Helpers
    getAnalysesByStatus,
    getAnalysisStats,

    // Clear functions
    clearError: () => setError(null),
    clearCurrentAnalysis: () => setCurrentAnalysis(null)
  };
};