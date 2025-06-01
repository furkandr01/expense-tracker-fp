import React from 'react';
import { useAuth } from '../../context/authContext';
import PasswordChange from '../Account/PasswordChange';
import './SettingsPage.css';

const SecuritySettings = ({ onClose }) => {
  const { loading } = useAuth();

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <h2>Account Security</h2>
        
        <div className="security-settings">
          <PasswordChange onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 