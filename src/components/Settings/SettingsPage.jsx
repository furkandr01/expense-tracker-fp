import React from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile Settings</h3>
          <p>Update your name, surname, and email information.</p>
          <button className="settings-button">Update</button>
        </div>
        <div className="settings-card">
          <h3>Notification Settings</h3>
          <p>Choose which notifications you want to receive.</p>
          <button className="settings-button">Edit</button>
        </div>
        <div className="settings-card">
          <h3>Account Security</h3>
          <p>Change your password or add two-factor authentication.</p>
          <button className="settings-button">Security Settings</button>
        </div>
        <div className="settings-card">
          <h3>Themes</h3>
          <p>Customize the application's theme.</p>
          <button className="settings-button">Change Theme</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
