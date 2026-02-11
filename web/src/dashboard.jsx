import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');
      
      if (!email || !token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Phone:</strong> {user?.phoneNumber}</p>
          <p><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
          <p><strong>Last Login:</strong> {user?.lastLoginAt ? new Date(user?.lastLoginAt).toLocaleString() : 'First login'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;