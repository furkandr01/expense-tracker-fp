import React from 'react';
import { useAuth } from '../../context/authContext';
import './SettingsPage.css';

const ThemeSettings = ({ onClose }) => {
  const { theme, updateTheme } = useAuth();

  const handleThemeChange = async (newTheme) => {
    await updateTheme(newTheme);
    onClose();
  };

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <h2>Theme Settings</h2>
        <p>Choose your preferred theme for the application.</p>
        
        <div className="theme-options">
          <div 
            className={`theme-option ${theme === 'light' ? 'theme-selected' : ''}`}
            onClick={() => handleThemeChange('light')}
          >
            <div className="theme-preview light-theme-preview">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-sidebar"></div>
              <div className="theme-preview-content"></div>
            </div>
            <p>Light Theme</p>
          </div>
          
          <div 
            className={`theme-option ${theme === 'dark' ? 'theme-selected' : ''}`}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="theme-preview dark-theme-preview">
              <div className="theme-preview-header"></div>
              <div className="theme-preview-sidebar"></div>
              <div className="theme-preview-content"></div>
            </div>
            <p>Dark Theme</p>
          </div>
        </div>
        
        <div className="settings-modal-actions">
          <button onClick={onClose} className="settings-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings; 