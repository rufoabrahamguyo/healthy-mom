// Use relative path in development (with Vite proxy) or env variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to server. Make sure the backend server is running.');
    }
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Forum API calls
export const forumAPI = {
  getQuestions: async () => {
    return apiRequest('/forum');
  },

  createQuestion: async (questionData) => {
    return apiRequest('/forum', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  addAnswer: async (questionId, answerData) => {
    return apiRequest(`/forum/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  },

  updateQuestion: async (questionId, questionData) => {
    return apiRequest(`/forum/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  },

  deleteQuestion: async (questionId) => {
    return apiRequest(`/forum/${questionId}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;

