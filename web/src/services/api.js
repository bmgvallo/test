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

      return await response.json(); // Returns the created user
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
        const error = await response.text();
        throw new Error(error || 'Invalid credentials');
      }

      return await response.json(); // Returns {user, userID, username, email, firstName, lastName}
    } catch (error) {
      throw error;
    }
  },

  // Get user profile by ID
  async getProfileById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/me/${userId}`, {
        method: 'GET',
        headers: {
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

  // Get user profile by email or username
  async getProfile(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/${identifier}`, {
        method: 'GET',
        headers: {
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

  // Check if username exists
  async checkUsername(username) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-username?username=${username}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      throw error;
    }
  },

  // Check if email exists
  async checkEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${email}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      throw error;
    }
  }
};