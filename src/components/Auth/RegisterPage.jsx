import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match. Please enter the same password.');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    
    setPasswordError('');
    await register(username, email, password);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>Register</h1>
        {error && (
          <div className="auth-error">
            <strong>Registration Error:</strong> {error}
          </div>
        )}
        {passwordError && (
          <div className="auth-error">
            <strong>Password Error:</strong> {passwordError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <div className="auth-help">
          <p>To register:</p>
          <ul>
            <li>Username must be at least 3 characters</li>
            <li>Use a valid email address</li>
            <li>Password must be at least 6 characters</li>
            <li>Passwords must match exactly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 