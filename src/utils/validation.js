// frontend/src/utils/validation.js

// Validate URL
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Add protocol if missing
  let formattedUrl = trimmedUrl;
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + trimmedUrl;
  }

  try {
    new URL(formattedUrl);
    return { isValid: true, formattedUrl };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Validate multiple URLs
export const validateUrls = (urls) => {
  if (!Array.isArray(urls)) {
    return { isValid: false, error: 'URLs must be an array' };
  }

  if (urls.length === 0) {
    return { isValid: false, error: 'At least one URL is required' };
  }

  if (urls.length > 500) {
    return { isValid: false, error: 'Maximum 500 URLs allowed' };
  }

  const validUrls = [];
  const errors = [];

  urls.forEach((url, index) => {
    const validation = validateUrl(url);
    if (validation.isValid) {
      validUrls.push(validation.formattedUrl);
    } else {
      errors.push(`URL ${index + 1}: ${validation.error}`);
    }
  });

  if (validUrls.length === 0) {
    return { isValid: false, error: 'No valid URLs found' };
  }

  return {
    isValid: true,
    validUrls,
    errors: errors.length > 0 ? errors : null
  };
};

// Validate file upload
export const validateFileUpload = (file) => {
  if (!file) {
    return { isValid: false, error: 'Please select a file' };
  }

  // Check file type
  const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
  
  if (!isValidType) {
    return { isValid: false, error: 'Only CSV and Excel files are supported' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  return { isValid: true };
};

// Validate form fields
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

// Validate email
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

// Validate analysis ID
export const validateAnalysisId = (id) => {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'Analysis ID is required' };
  }

  // MongoDB ObjectId validation (24 character hex string)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(id)) {
    return { isValid: false, error: 'Invalid analysis ID format' };
  }

  return { isValid: true };
};