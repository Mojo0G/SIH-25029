const API_BASE_URL = 'http://localhost:3000/api';
const PY_API_URL = 'http://127.0.0.1:8000';

// Health check endpoints
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, message: 'Backend not available' };
  }
};

export const checkPythonHealth = async () => {
  try {
    const response = await fetch(`${PY_API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Python API health check failed:', error);
    return { success: false, message: 'Python API not available' };
  }
};

// OCR API functions
export const extractOCR = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/ocr/extract`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return { success: false, message: 'OCR extraction failed' };
  }
};

export const extractAllOCR = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ocr/extract-all`, {
      method: 'POST',
    });

    return await response.json();
  } catch (error) {
    console.error('OCR extraction failed:', error);
    return { success: false, message: 'OCR extraction failed' };
  }
};

export const getOCRResult = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ocr/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Get OCR result failed:', error);
    return { success: false, message: 'Failed to get OCR result' };
  }
};

// AI Verification API functions
export const verifyAI = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/ai/verify`, {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('AI verification failed:', error);
    return { success: false, message: 'AI verification failed' };
  }
};

export const verifyAllAI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/verify-all`, {
      method: 'POST',
    });

    return await response.json();
  } catch (error) {
    console.error('AI verification failed:', error);
    return { success: false, message: 'AI verification failed' };
  }
};

export const getAIResult = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Get AI result failed:', error);
    return { success: false, message: 'Failed to get AI result' };
  }
};

// Database validation functions
export const getGraduationData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/graduation`);
    return await response.json();
  } catch (error) {
    console.error('Get graduation data failed:', error);
    return { success: false, message: 'Failed to get graduation data' };
  }
};

export const getIdentityData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/identity`);
    return await response.json();
  } catch (error) {
    console.error('Get identity data failed:', error);
    return { success: false, message: 'Failed to get identity data' };
  }
};

export const getInternshipData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/internships`);
    return await response.json();
  } catch (error) {
    console.error('Get internship data failed:', error);
    return { success: false, message: 'Failed to get internship data' };
  }
};

// Authentication functions
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: 'Login failed' };
  }
};
