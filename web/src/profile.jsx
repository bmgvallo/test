import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!token || !userId || !isLoggedIn) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile/me/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const userData = await response.json();
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          firstName: parsedUser.firstName || '',
          lastName: parsedUser.lastName || '',
          phoneNumber: parsedUser.phoneNumber || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userID');

    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: parseInt(userId),
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditing(false);
      showMessage('Profile updated successfully!', 'success');
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      }));
      
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-nav">
        <h1>My Profile</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/dashboard')} className="dashboard-btn">
            Dashboard
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0)}
          </div>
          <div className="profile-title">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p className="profile-username">@{user?.username}</p>
          </div>
          <button 
            onClick={() => setEditing(!editing)} 
            className="edit-btn"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {message && (
          <div className={`profile-message ${messageType}`}>
            {message}
          </div>
        )}

        {editing ? (
          <form onSubmit={handleUpdate} className="profile-edit-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-card">
              <div className="detail-info">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-info">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user?.phoneNumber}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-info">
                <span className="detail-label">Member Since</span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-info">
                <span className="detail-label">Last Login</span>
                <span className="detail-value">
                  {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'First login'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;