import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import PasswordChange from './PasswordChange';
import { Navigate } from 'react-router-dom';
import './AccountPage.css';

const AccountPage = () => {
  const { currentUser, logout, loading } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // If no user is logged in, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="page-container" style={{ flex: 1, padding: '24px' }}>
      <h1 className="page-title">Account</h1>
      
      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : (
        <div className="page-content">
          <div className="users-info">
            <h3>User Information</h3>
            <p>Name: {currentUser?.username}</p>
            <p>Email: {currentUser?.email}</p>
          </div>
          
          <div className="account-actions">
            <h3>Account Transactions</h3>
            <button 
              className="account-button"
              onClick={() => setShowPasswordChange(true)}
            >
              Password Change
            </button>
            <button 
              className="account-button logout-button"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
      
      {showPasswordChange && (
        <PasswordChange onClose={() => setShowPasswordChange(false)} />
      )}
    </div>
  );
};

export default AccountPage;
