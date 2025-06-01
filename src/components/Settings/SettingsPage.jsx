import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Navigate } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import ThemeSettings from './ThemeSettings';
import './SettingsPage.css';

const SettingsPage = () => {
  const { currentUser, loading } = useAuth();
  const [activeModal, setActiveModal] = useState(null);

  // If no user is logged in, redirect to login
  if (!loading && !currentUser) {
    return <Navigate to="/login" />;
  }
  
  const openModal = (modalName) => {
    setActiveModal(modalName);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>
      
      {loading ? (
        <div className="loading">Loading settings...</div>
      ) : (
        <div className="settings-grid">
          <div className="settings-card">
            <h3>Profile Settings</h3>
            <p>Update your name, surname, and email information.</p>
            <button 
              className="settings-button"
              onClick={() => openModal('profile')}
            >
              Update
            </button>
          </div>
          
          <div className="settings-card">
            <h3>Notification Settings</h3>
            <p>Choose which notifications you want to receive.</p>
            <button 
              className="settings-button"
              onClick={() => openModal('notifications')}
            >
              Edit
            </button>
          </div>
          
          <div className="settings-card">
            <h3>Account Security</h3>
            <p>Change your password or add two-factor authentication.</p>
            <button 
              className="settings-button"
              onClick={() => openModal('security')}
            >
              Security Settings
            </button>
          </div>
          
          <div className="settings-card">
            <h3>Themes</h3>
            <p>Customize the application's theme.</p>
            <button 
              className="settings-button"
              onClick={() => openModal('theme')}
            >
              Change Theme
            </button>
          </div>
        </div>
      )}
      
      {/* Profile Settings Modal */}
      {activeModal === 'profile' && (
        <ProfileSettings onClose={closeModal} />
      )}
      
      {/* Notification Settings Modal */}
      {activeModal === 'notifications' && (
        <NotificationSettings onClose={closeModal} />
      )}
      
      {/* Security Settings Modal */}
      {activeModal === 'security' && (
        <SecuritySettings onClose={closeModal} />
      )}
      
      {/* Theme Settings Modal */}
      {activeModal === 'theme' && (
        <ThemeSettings onClose={closeModal} />
      )}
    </div>
  );
};

export default SettingsPage;
