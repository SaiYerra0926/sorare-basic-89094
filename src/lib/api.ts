const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
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
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
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
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
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
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
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
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch completed referrals. Please check your connection and try again.');
    }
  },
};

