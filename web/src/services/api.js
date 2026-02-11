const API_BASE_URL = 'http://localhost:8080/api';

export const authAPI = {
  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return await response.text();
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(loginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  async getProfile(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};