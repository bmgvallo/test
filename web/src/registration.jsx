import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.css';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!username || !firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    showMessage('Creating account...', 'info');

    try {
      const userData = {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }

      const result = await response.text();
      
      showMessage('Registration successful! Please login.', 'success');

      // clear form
      setUsername('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');

      // redirect to login page
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      showMessage(error.message || 'Registration failed. Please try again.', 'error');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength="6"
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <div className="register-link">
            <p>
              Already have an account? <a href="/">Sign in</a>
            </p>
          </div>

        </form>

        {message && (
          <div className={`register-message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;