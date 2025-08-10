// frontend/src/pages/LeadTrackerPage.jsx
import React, { useMemo } from 'react';
import { useLeads } from '../hooks/useLeads';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import LeadSearch from '../components/leads/LeadSearch';

const pipelineStages = ['new','contacted','qualified','proposal_generated','proposal_sent','negotiation','won','lost'];

const LeadTrackerPage = () => {
  const {
    leads,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchResults,
    searching,
    refreshLeads,
    updateLeadTracking
  } = useLeads();

  const displayData = searchQuery ? searchResults : leads;

  const stats = useMemo(() => {
    const total = displayData.length;
    const proposalGenerated = displayData.filter(l => l?.tracking?.proposal_generated || l.proposal_generated).length;
    const proposalSent = displayData.filter(l => l?.tracking?.proposal_sent || l.proposal_sent).length;
    const byStage = Object.fromEntries(pipelineStages.map(s => [s, displayData.filter(l => (l?.tracking?.stage || l.tracking_stage || 'new') === s).length]));
    return { total, proposalGenerated, proposalSent, byStage };
  }, [displayData]);

  if (loading && !leads.length) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !leads.length) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={refreshLeads} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Tracker</h1>
        <p className="text-gray-600">Track proposals, outreach, follow-ups, and pipeline stages for each lead.</p>
      </div>

      {/* Tracker Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-xl font-semibold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Proposal Generated</div>
          <div className="text-xl font-semibold">{stats.proposalGenerated}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs text-gray-500">Proposal Sent</div>
          <div className="text-xl font-semibold">{stats.proposalSent}</div>
        </div>
        {pipelineStages.map((s) => (
          <div key={s} className="bg-white rounded-lg shadow p-4 hidden md:block">
            <div className="text-xs text-gray-500">{s.replace('_',' ').toUpperCase()}</div>
            <div className="text-xl font-semibold">{stats.byStage[s]}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <LeadSearch value={searchQuery} onChange={setSearchQuery} searching={searching} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">
            {searchQuery ? `Search Results (${displayData.length})` : `All Leads (${displayData.length})`}
          </div>
          <button onClick={refreshLeads} disabled={loading} className="px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50">{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Company</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Website</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Proposal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Follow-up</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayData.map((lead) => {
                const stage = lead?.tracking?.stage || lead.tracking_stage || 'new';
                const proposalGenerated = lead?.tracking?.proposal_generated ?? lead.proposal_generated ?? false;
                const proposalSent = lead?.tracking?.proposal_sent ?? lead.proposal_sent ?? false;
                const nextFollowUp = lead?.tracking?.next_follow_up_at || lead.next_follow_up_at;
                return (
                  <tr key={lead.id}>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-900">{lead.name || 'Unknown'}</div>
                      <div className="text-gray-500">{lead.industry || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <a className="text-blue-600 hover:underline" href={lead.website} target="_blank" rel="noreferrer">{lead.website}</a>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={stage}
                        onChange={async (e) => {
                          await updateLeadTracking(lead.id, { stage: e.target.value });
                        }}
                        className="border-gray-300 rounded text-sm"
                      >
                        {pipelineStages.map(s => (
                          <option key={s} value={s}>{s.replace('_',' ').toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={proposalGenerated}
                            onChange={async (e) => {
                              await updateLeadTracking(lead.id, { proposal_generated: e.target.checked });
                            }}
                          />
                          <span>Generated</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={proposalSent}
                            onChange={async (e) => {
                              const checked = e.target.checked;
                              const payload = { proposal_sent: checked };
                              if (checked) payload.proposal_sent_at = new Date().toISOString();
                              await updateLeadTracking(lead.id, payload);
                            }}
                          />
                          <span>Sent</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {nextFollowUp ? new Date(nextFollowUp).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="px-3 py-1 border rounded hover:bg-gray-50"
                          onClick={async () => {
                            await updateLeadTracking(lead.id, { last_contacted_at: new Date().toISOString(), stage: 'contacted' });
                          }}
                        >Mark Contacted</button>
                        <button
                          className="px-3 py-1 border rounded hover:bg-gray-50"
                          onClick={async () => {
                            const dt = new Date();
                            dt.setDate(dt.getDate() + 3);
                            await updateLeadTracking(lead.id, { next_follow_up_at: dt.toISOString() });
                          }}
                        >Follow-up in 3 days</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadTrackerPage;


