// frontend/src/pages/AnalyzePage.js
import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import URLInput from '../components/forms/URLInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate, getStatusColor } from '../utils/helpers';
import { ANALYSIS_STATUS } from '../utils/constants';

const AnalyzePage = () => {
  const { startAnalysis, currentAnalysis, analysisLoading, error, pollAnalysis } = useAnalysis();
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = async (url) => {
    try {
      const result = await startAnalysis(url);
      setAnalysisResult(result);

      // Start polling if analysis is processing or pending
      if (
        result.analysis_id &&
        (result.status === ANALYSIS_STATUS.PROCESSING || result.status === ANALYSIS_STATUS.PENDING)
      ) {
        pollAnalysis(result.analysis_id, (updatedResult) => {
          setAnalysisResult(prev => ({ ...prev, ...updatedResult }));
        });
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const renderAnalysisResult = () => {
    // Always render a container to avoid layout collapse
    if (!analysisResult) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
          Enter a URL above and click Analyze to see results here.
        </div>
      );
    }

    const { status, result } = analysisResult;

    if (status === ANALYSIS_STATUS.PROCESSING || status === ANALYSIS_STATUS.PENDING) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing Website</h3>
            <p className="text-gray-600">This may take a few moments...</p>
          </div>
        </div>
      );
    }

    if (status === ANALYSIS_STATUS.FAILED) {
      return (
        <ErrorMessage 
          message={result?.error || 'Analysis failed. Please try again.'} 
          onRetry={() => setAnalysisResult(null)}
        />
      );
    }

    if (status === ANALYSIS_STATUS.COMPLETED && result) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Analysis Complete</h3>
            <p className="text-sm text-gray-600 mt-1">
              Analyzed on {formatDate(new Date())}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Company Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Company Name:</span>
                    <p className="text-sm text-gray-900">{result.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Industry:</span>
                    <p className="text-sm text-gray-900">{result.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Business Purpose:</span>
                    <p className="text-sm text-gray-900">{result.business_purpose || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Company Size:</span>
                    <p className="text-sm text-gray-900">{result.company_size || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              {result.technologies && result.technologies.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scores and Analysis */}
            <div className="space-y-4">
              {/* Scores */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Scores</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Digital Maturity</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {result.digital_maturity_score || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Urgency Score</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {result.urgency_score || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Potential Value</span>
                    <span className="text-sm font-semibold text-green-600">
                      {result.potential_value || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              {result.contact_info && Object.keys(result.contact_info).length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-1">
                    {Object.entries(result.contact_info).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-700 capitalize">{key}:</span>
                        <span className="ml-2 text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pain Points */}
          {result.pain_points && result.pain_points.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Identified Pain Points</h4>
              <ul className="space-y-2">
                {result.pain_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outreach Strategy */}
          {result.outreach_strategy && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Outreach Strategy</h4>
              <p className="text-sm text-gray-700">{result.outreach_strategy}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
            <button
              onClick={() => setAnalysisResult(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Analyze Another
            </button>
            <button
              onClick={() => window.location.href = '/reports'}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              View All Reports
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Website Analysis</h1>
          <p className="mt-2 text-gray-600">
            Enter a website URL to get comprehensive AI-powered analysis
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <URLInput 
            onSubmit={handleAnalyze} 
            loading={analysisLoading} 
          />
        </div>

        {renderAnalysisResult()}
      </div>
    </div>
  );
};

export default AnalyzePage;