// frontend/src/utils/constants.js

export const API_ENDPOINTS = {
  ANALYZE: '/analyze',
  BULK: '/bulk',
  REPORTS: '/reports',
  LEADS: '/leads'
};

export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const BULK_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const FILE_TYPES = {
  ACCEPTED: ['.csv', '.xlsx', '.xls'],
  MAX_SIZE: 10 * 1024 * 1024 // 10MB
};

export const POLLING_INTERVALS = {
  ANALYSIS: 2000, // 2 seconds
  BULK: 3000      // 3 seconds
};

export const MESSAGES = {
  SUCCESS: {
    ANALYSIS_STARTED: 'Analysis started successfully',
    BULK_STARTED: 'Bulk processing started',
    ANALYSIS_DELETED: 'Analysis deleted successfully',
    FILE_UPLOADED: 'File uploaded successfully'
  },
  ERROR: {
    INVALID_URL: 'Please enter a valid URL',
    FILE_TOO_LARGE: 'File size exceeds 10MB limit',
    INVALID_FILE_TYPE: 'Only CSV and Excel files are supported',
    NETWORK_ERROR: 'Network error occurred. Please try again.',
    ANALYSIS_FAILED: 'Analysis failed. Please try again.'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ANALYZE: '/analyze',
  BULK: '/bulk',
  REPORTS: '/reports',
  PROPOSALS: '/proposals',
  LEADS: '/leads',
  LEAD_TRACKER: '/lead-tracker',
  SETTINGS: '/settings'
};