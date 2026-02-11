import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!token || !userId || !isLoggedIn) {
        handleLogout();
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile/me/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add token!
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token invalid or expired
            handleLogout();
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Call backend logout endpoint
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear everything regardless of API response
    localStorage.clear();
    navigate('/', { replace: true });
  }
};

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        <h1>Dashboard</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/profile')} className="profile-btn">
            View Profile
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {user?.firstName || user?.username}!</h2>
          <p>View your profile!</p>
        </div>
        </div>
      </div>
  );
};

export default Dashboard;