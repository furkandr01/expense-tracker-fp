import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import './SettingsPage.css';

const NotificationSettings = ({ onClose }) => {
  const { currentUser, updateNotificationSettings, error, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  // Initialize notification settings from user data or defaults
  const defaultSettings = {
    email: {
      transactions: true,
      budgetAlerts: true,
      billReminders: true,
      weeklyReports: true
    },
    push: {
      transactions: true,
      budgetAlerts: true,
      billReminders: true
    }
  };
  
  const [settings, setSettings] = useState(
    currentUser?.notificationSettings || defaultSettings
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await updateNotificationSettings(settings);
    
    if (success) {
      setSuccessMessage('Notification settings updated successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleToggle = (category, type) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [type]: !prevSettings[category][type]
      }
    }));
  };

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <h2>Notification Settings</h2>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="notification-section">
            <h3>Email Notifications</h3>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Transactions</span>
                <div 
                  className={`toggle-switch ${settings.email.transactions ? 'active' : ''}`}
                  onClick={() => handleToggle('email', 'transactions')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Receive emails about new transactions</p>
            </div>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Budget Alerts</span>
                <div 
                  className={`toggle-switch ${settings.email.budgetAlerts ? 'active' : ''}`}
                  onClick={() => handleToggle('email', 'budgetAlerts')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Get notified when you approach budget limits</p>
            </div>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Bill Reminders</span>
                <div 
                  className={`toggle-switch ${settings.email.billReminders ? 'active' : ''}`}
                  onClick={() => handleToggle('email', 'billReminders')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Get reminders about upcoming bill payments</p>
            </div>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Weekly Reports</span>
                <div 
                  className={`toggle-switch ${settings.email.weeklyReports ? 'active' : ''}`}
                  onClick={() => handleToggle('email', 'weeklyReports')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Receive weekly spending and saving summaries</p>
            </div>
          </div>
          
          <div className="notification-section">
            <h3>Push Notifications</h3>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Transactions</span>
                <div 
                  className={`toggle-switch ${settings.push.transactions ? 'active' : ''}`}
                  onClick={() => handleToggle('push', 'transactions')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Receive push notifications about new transactions</p>
            </div>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Budget Alerts</span>
                <div 
                  className={`toggle-switch ${settings.push.budgetAlerts ? 'active' : ''}`}
                  onClick={() => handleToggle('push', 'budgetAlerts')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Get push notifications when you approach budget limits</p>
            </div>
            
            <div className="notification-option">
              <label className="toggle-label">
                <span>Bill Reminders</span>
                <div 
                  className={`toggle-switch ${settings.push.billReminders ? 'active' : ''}`}
                  onClick={() => handleToggle('push', 'billReminders')}
                >
                  <div className="toggle-slider"></div>
                </div>
              </label>
              <p className="notification-description">Get push reminders about upcoming bill payments</p>
            </div>
          </div>
          
          <div className="settings-modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings; 