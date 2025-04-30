import React from 'react';
import './AccountPage.css';

const AccountPage = () => (
  <div className="page-container" style={{ flex: 1, padding: '24px' }}>
    <h1 className="page-title">Account</h1>
    <div className="page-content">
      <div className="users-info">
        <h3>User Information</h3>
        <p>Name: Furkan Adar</p>
        <p>Email: furkan.adar@example.com</p>
      </div>
      <div className="account-actions">
        <h3>Account Transactions</h3>
        <button className="account-button">Password Change</button>
        <button className="account-button">Log Out</button>
      </div>
    </div>
  </div>
);

export default AccountPage;
