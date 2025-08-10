// frontend/src/components/reports/ReportDetailsModal.jsx
import React, { useEffect } from 'react';
import { formatDate } from '../../utils/helpers';

const Field = ({ label, children }) => (
  <div className="text-sm">
    <span className="font-medium text-gray-700">{label}:</span>{' '}
    <span className="text-gray-900">{children}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-md font-semibold text-gray-900 mb-2">{title}</h4>
    {children}
  </div>
);

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const data = report?.result || report?.result_data || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl mx-4 rounded-lg shadow-xl border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
            <p className="text-xs text-gray-500">{report?.url}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Company">
              <div className="space-y-2">
                <Field label="Name">{report?.company_name || data.company_name || 'N/A'}</Field>
                <Field label="Industry">{report?.industry || data.industry || 'N/A'}</Field>
                <Field label="Created">{formatDate(report?.created_at)}</Field>
                <Field label="Status">{report?.status || 'completed'}</Field>
              </div>
            </Section>

            <Section title="Scores">
              <div className="space-y-2">
                <Field label="Digital Maturity">{data.digital_maturity_score ?? 0}</Field>
                <Field label="Urgency Score">{data.urgency_score ?? 0}</Field>
                <Field label="Potential Value">{data.potential_value || 'N/A'}</Field>
                <Field label="Company Size">{data.company_size || 'N/A'}</Field>
              </div>
            </Section>
          </div>

          {Array.isArray(data.technologies) && data.technologies.length > 0 && (
            <Section title="Technologies">
              <div className="flex flex-wrap gap-2">
                {data.technologies.map((t, i) => (
                  <span key={i} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {data.contact_info && Object.keys(data.contact_info).length > 0 && (
            <Section title="Contact Info">
              <div className="space-y-1 text-sm text-gray-700">
                {Object.entries(data.contact_info).map(([k, v]) => (
                  <div key={k}>
                    <span className="font-medium capitalize">{k}:</span> <span>{v}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {Array.isArray(data.pain_points) && data.pain_points.length > 0 && (
            <Section title="Pain Points">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {data.pain_points.map((p, i) => (<li key={i}>{p}</li>))}
              </ul>
            </Section>
          )}

          {Array.isArray(data.recommendations) && data.recommendations.length > 0 && (
            <Section title="Recommendations">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {data.recommendations.map((r, i) => (<li key={i}>{r}</li>))}
              </ul>
            </Section>
          )}

          {data.outreach_strategy && (
            <Section title="Outreach Strategy">
              <p className="text-sm text-gray-700">{data.outreach_strategy}</p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;


