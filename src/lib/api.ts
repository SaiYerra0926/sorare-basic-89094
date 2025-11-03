const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export const api = {
  async submitReferral(data: any): Promise<ApiResponse<{ referralId: number }>> {
    try {
      console.log('Submitting referral data:', data);
      console.log('API URL:', `${API_BASE_URL}/referrals`);
      
      const response = await fetch(`${API_BASE_URL}/referrals`, {
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
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
      const response = await fetch(`${API_BASE_URL}/referrals`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching referrals:', error);
      throw error;
    }
  },

  async getReferralById(id: number): Promise<ApiResponse<any>> {
    try {
      const url = `${API_BASE_URL}/referrals/${id}`;
      console.log('Fetching referral by ID from:', url);
      
      const response = await fetch(url);
      
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
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
      const response = await fetch(`${API_BASE_URL}/referrals/count/completed`);
      
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
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
      
      const response = await fetch(url);
      
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
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to the server. Please ensure the backend server is running on http://localhost:3001');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(error.message || 'Failed to fetch completed referrals. Please check your connection and try again.');
    }
  },
};

