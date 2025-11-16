const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper to get the server URL for error messages (removes /api suffix)
const getServerUrl = (): string => {
  const baseUrl = API_BASE_URL.replace(/\/api$/, '');
  return baseUrl;
};

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Helper function to detect network errors
const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for common network error patterns
  const errorMessage = error.message?.toLowerCase() || '';
  const errorName = error.name || '';
  
  // Network-related error indicators
  const networkErrorPatterns = [
    'failed to fetch',
    'networkerror',
    'network error',
    'network request failed',
    'fetch',
    'connection',
    'connection refused',
    'econnrefused',
    'econnreset',
    'timeout',
    'err_network',
    'network_change',
    'load failed'
  ];
  
  // Check error name
  if (errorName === 'TypeError' || errorName === 'NetworkError' || errorName === 'AbortError') {
    return true;
  }
  
  // Check error message for network-related patterns
  return networkErrorPatterns.some(pattern => 
    errorMessage.includes(pattern)
  );
};

// Helper function to add timeout to fetch requests
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError: any = new Error('Request timeout. The server is taking too long to respond.');
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    throw error;
  }
};

export const api = {
  async submitReferral(data: any): Promise<ApiResponse<{ referralId: number }>> {
    try {
      console.log('Submitting referral data:', data);
      console.log('API URL:', `${API_BASE_URL}/referrals`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is ok before trying to parse JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting referral:', error);
      
      // Handle network errors specifically
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      // Handle other errors
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit referral. Please check your connection and try again.');
    }
  },

  async getReferrals(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/referrals`);
      
      // Check if response is ok before trying to parse JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      return responseData;
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      
      // Handle network errors specifically
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch referrals. Please check your connection and try again.');
    }
  },

  async getReferralById(id: number): Promise<ApiResponse<any>> {
    try {
      const url = `${API_BASE_URL}/referrals/${id}`;
      console.log('Fetching referral by ID from:', url);
      
      const response = await fetchWithTimeout(url);
      
      // Check if response is ok before trying to parse JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      return responseData;
    } catch (error: any) {
      console.error('Error fetching referral:', error);
      
      // Handle network errors specifically
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch referral. Please check your connection and try again.');
    }
  },

  async getCompletedReferralsCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/referrals/count/completed`);
      
      // Check if response is ok before trying to parse JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      return responseData;
    } catch (error: any) {
      console.error('Error fetching completed referrals count:', error);
      
      // Handle network errors specifically
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch completed referrals count. Please check your connection and try again.');
    }
  },

  async getCompletedReferrals(params?: {
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/referrals/completed${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching completed referrals from:', url);
      
      const response = await fetchWithTimeout(url);
      
      // Check if response is ok before trying to parse JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      return responseData;
    } catch (error: any) {
      console.error('Error fetching completed referrals:', error);
      
      // Handle network errors specifically
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch completed referrals. Please check your connection and try again.');
    }
  },

  async submitHandbook(data: any): Promise<ApiResponse<{ submissionId: number }>> {
    try {
      console.log('Submitting handbook data:', data);
      console.log('API URL:', `${API_BASE_URL}/handbook`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/handbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting handbook:', error);
      
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit handbook. Please check your connection and try again.');
    }
  },

  async submitEncounter(data: any): Promise<ApiResponse<{ encounterId: number }>> {
    try {
      console.log('Submitting encounter form data:', data);
      console.log('API URL:', `${API_BASE_URL}/encounters`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/encounters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting encounter form:', error);
      
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit encounter form. Please check your connection and try again.');
    }
  },

  async submitSnapAssessment(data: any): Promise<ApiResponse<{ assessmentId: number }>> {
    try {
      console.log('Submitting SNAP Assessment data:', data);
      console.log('API URL:', `${API_BASE_URL}/snap-assessments`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/snap-assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting SNAP Assessment:', error);
      
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit SNAP Assessment. Please check your connection and try again.');
    }
  },

  async submitDischargeSummary(data: any): Promise<ApiResponse<{ dischargeId: number }>> {
    try {
      console.log('Submitting Discharge Summary data:', data);
      console.log('API URL:', `${API_BASE_URL}/discharge-summaries`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/discharge-summaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting Discharge Summary:', error);
      
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit Discharge Summary. Please check your connection and try again.');
    }
  },

  async submitWrapPlan(data: any): Promise<ApiResponse<{ wrapPlanId: number }>> {
    try {
      console.log('Submitting WRAP Plan data:', data);
      console.log('API URL:', `${API_BASE_URL}/wrap-plans`);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/wrap-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned an invalid response. Please ensure the server is running.');
      }
      
      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(responseData.error || responseData.message || `Server error: ${response.status} ${response.statusText}`);
      }

      console.log('Success Response:', responseData);
      return responseData;
    } catch (error: any) {
      console.error('Error submitting WRAP Plan:', error);
      
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to submit WRAP Plan. Please check your connection and try again.');
    }
  },

  // Authentication APIs
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Get response text first to check content type
      const responseText = await response.text();
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response:', responseText);
        if (response.status === 404) {
          throw new Error(`API endpoint not found. Please check if the server is running and the endpoint is correct.`);
        }
        if (response.status === 0 || responseText.includes('Failed to fetch')) {
          throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
        }
        throw new Error(`Server returned an invalid response (${response.status}). Please ensure the backend server is running on ${getServerUrl()}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', responseText);
        throw new Error('Server returned an invalid response. Please ensure the backend server is running and properly configured.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || `Login failed (${response.status})`);
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server. Please ensure the backend server is running on ${getServerUrl()}`);
      }
      // Re-throw the error if it's already an Error object
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  async verifyToken(token: string): Promise<ApiResponse<{ user: any }>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Token verification failed');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },

  // User Management APIs (Admin only)
  async getUsers(token: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch users');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },

  async createUser(token: string, userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create user');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },

  async updateUser(token: string, userId: number, userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update user');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },

  async deleteUser(token: string, userId: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete user');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },

  async changePassword(token: string, userId: number, newPassword: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to change password');
      }

      return responseData;
    } catch (error: any) {
      if (isNetworkError(error)) {
        throw new Error(`Cannot connect to the server.`);
      }
      throw error;
    }
  },
};

