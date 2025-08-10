// frontend/src/hooks/useLeads.js
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const fetchLeads = useCallback(async (limit = 100, skip = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getLeads(limit, skip);
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLeads = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const data = await apiClient.searchLeads(query);
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching leads:', err);
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }, []);

  const getLeadDetail = useCallback(async (leadId) => {
    try {
      setError(null);
      const data = await apiClient.getLeadDetail(leadId);
      return data;
    } catch (err) {
      console.error('Error fetching lead detail:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const getLeadTracking = useCallback(async (leadId) => {
    try {
      setError(null);
      return await apiClient.getLeadTracking(leadId);
    } catch (err) {
      console.error('Error fetching lead tracking:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const updateLeadTracking = useCallback(async (leadId, updates) => {
    try {
      setError(null);
      const updated = await apiClient.updateLeadTracking(leadId, updates);
      // Optimistically update local list if present
      setLeads((prev) => prev.map(l => l.id === leadId ? { ...l, tracking: updated, tracking_stage: updated.stage, proposal_generated: updated.proposal_generated, proposal_sent: updated.proposal_sent, proposal_sent_at: updated.proposal_sent_at, last_contacted_at: updated.last_contacted_at, next_follow_up_at: updated.next_follow_up_at, notes: updated.notes } : l));
      return updated;
    } catch (err) {
      console.error('Error updating lead tracking:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLeads(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLeads]);

  return {
    leads,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    fetchLeads,
    searchLeads,
    getLeadDetail,
    getLeadTracking,
    updateLeadTracking,
    refreshLeads: () => fetchLeads()
  };
};
