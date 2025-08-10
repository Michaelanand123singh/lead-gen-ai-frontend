import React, { useEffect, useMemo, useState } from 'react';
import { useReports } from '../hooks/useReports';
import apiClient from '../services/api';

const ProposalResult = ({ item }) => {
  if (!item) return null;
  const { kind, company_name, website, content } = item;
  if (kind === 'email') {
    return (
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="text-sm text-gray-500">Email for {company_name || 'Unknown'} ({website})</div>
        <div>
          <div className="font-semibold">Subject</div>
          <div className="text-gray-800">{content.subject}</div>
        </div>
        <div>
          <div className="font-semibold">Opening</div>
          <div className="text-gray-800 whitespace-pre-wrap">{content.opening}</div>
        </div>
        <div>
          <div className="font-semibold">Body</div>
          <div className="text-gray-800 whitespace-pre-wrap">{content.body}</div>
        </div>
        {content.call_to_action && (
          <div>
            <div className="font-semibold">Call to Action</div>
            <div className="text-gray-800 whitespace-pre-wrap">{content.call_to_action}</div>
          </div>
        )}
        {Array.isArray(content.key_talking_points) && content.key_talking_points.length > 0 && (
          <div>
            <div className="font-semibold">Key Talking Points</div>
            <ul className="list-disc list-inside text-gray-800">
              {content.key_talking_points.map((p, idx) => (<li key={idx}>{p}</li>))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="bg-white border rounded-lg p-4 space-y-3">
      <div className="text-sm text-gray-500">Proposal for {company_name || 'Unknown'} ({website})</div>
      {['executive_summary','problem_statement','proposed_solution','timeline','investment_range','next_steps'].map((key) => (
        content[key] ? (
          <div key={key}>
            <div className="font-semibold capitalize">{key.replace('_',' ')}</div>
            <div className="text-gray-800 whitespace-pre-wrap">{content[key]}</div>
          </div>
        ) : null
      ))}
      {Array.isArray(content.key_deliverables) && content.key_deliverables.length > 0 && (
        <div>
          <div className="font-semibold">Key Deliverables</div>
          <ul className="list-disc list-inside text-gray-800">
            {content.key_deliverables.map((d, idx) => (<li key={idx}>{d}</li>))}
          </ul>
        </div>
      )}
      {Array.isArray(content.expected_benefits) && content.expected_benefits.length > 0 && (
        <div>
          <div className="font-semibold">Expected Benefits</div>
          <ul className="list-disc list-inside text-gray-800">
            {content.expected_benefits.map((b, idx) => (<li key={idx}>{b}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ProposalPage = () => {
  const { reports, fetchReports, loading: reportsLoading, error: reportsError } = useReports();
  const [selectedIds, setSelectedIds] = useState([]);
  const [kind, setKind] = useState('email');
  const [serviceFocus, setServiceFocus] = useState('');
  const [tone, setTone] = useState('professional');
  const [cta, setCta] = useState('');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => { fetchReports(0, 200); }, [fetchReports]);

  const allReports = useMemo(() => reports || [], [reports]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelectedIds(allReports.map(r => r.id));
  const clearAll = () => setSelectedIds([]);

  const canGenerate = selectedIds.length > 0 && !generating;

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);
      setResults([]);

      if (selectedIds.length === 1) {
        const payload = {
          analysis_id: selectedIds[0],
          kind,
          service_focus: serviceFocus || null,
          tone,
          call_to_action: cta || null,
        };
        const res = await apiClient.post('/proposals/generate', payload);
        setResults([res]);
      } else {
        const payload = {
          analysis_ids: selectedIds,
          kind,
          service_focus: serviceFocus || null,
          tone,
          call_to_action: cta || null,
        };
        const res = await apiClient.post('/proposals/generate/bulk', payload);
        const items = Array.isArray(res?.results) ? res.results : [];
        setResults(items);
        if (Array.isArray(res?.failures) && res.failures.length) {
          setError(`Generated ${items.length} items with ${res.failures.length} failures.`);
        }
      }
    } catch (e) {
      setError(e.message || 'Failed to generate');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Proposal Generation</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border rounded-lg p-4 space-y-3">
            <div className="font-semibold">Configuration</div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Type</label>
              <select className="mt-1 w-full border rounded px-2 py-1" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option value="email">Outreach Email</option>
                <option value="proposal">Detailed Proposal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Focus (optional)</label>
              <input className="mt-1 w-full border rounded px-2 py-1" placeholder="e.g., Website modernization, SEO, Cloud Migration" value={serviceFocus} onChange={(e) => setServiceFocus(e.target.value)} />
            </div>
            {kind === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tone</label>
                  <select className="mt-1 w-full border rounded px-2 py-1" value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Call to Action (optional)</label>
                  <input className="mt-1 w-full border rounded px-2 py-1" placeholder="e.g., Would you be open to a 15-minute call next week?" value={cta} onChange={(e) => setCta(e.target.value)} />
                </div>
              </>
            )}
            <button disabled={!canGenerate} onClick={handleGenerate} className={`w-full py-2 rounded text-white ${canGenerate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
              {generating ? 'Generating...' : `Generate for ${selectedIds.length} ${selectedIds.length === 1 ? 'item' : 'items'}`}
            </button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">Select Analyses</div>
              <div className="space-x-2 text-sm">
                <button onClick={selectAll} className="text-blue-600 hover:underline">Select all</button>
                <button onClick={clearAll} className="text-gray-600 hover:underline">Clear</button>
              </div>
            </div>
            <div className="max-h-80 overflow-auto divide-y">
              {reportsLoading ? (
                <div className="p-3 text-gray-500">Loading...</div>
              ) : reportsError ? (
                <div className="p-3 text-red-600">{reportsError}</div>
              ) : allReports.length === 0 ? (
                <div className="p-3 text-gray-500">No completed analyses found.</div>
              ) : (
                allReports.map((r) => (
                  <label key={r.id} className="flex items-start p-2 gap-2 cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="mt-1" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                    <div>
                      <div className="font-medium text-gray-900">{r.company_name || r.url}</div>
                      <div className="text-sm text-gray-500">{r.url}</div>
                      <div className="text-xs text-gray-400">Industry: {r.industry || 'N/A'} | Scores: DM {r.digital_maturity_score ?? '-'} / UR {r.urgency_score ?? '-'}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Generated Content</div>
            {results.length > 0 && (
              <div className="text-sm text-gray-500">{results.length} item(s)</div>
            )}
          </div>
          {results.length === 0 ? (
            <div className="bg-white border rounded-lg p-6 text-gray-500">Select analyses and click Generate to create proposals or outreach emails.</div>
          ) : (
            <div className="space-y-4">
              {results.map((item, idx) => (
                <ProposalResult key={idx} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;


