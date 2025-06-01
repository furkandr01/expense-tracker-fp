import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import './SettingsPage.css';

const ProfileSettings = ({ onClose }) => {
  const { currentUser, updateProfile, uploadProfileImage, error, loading } = useAuth();
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    currentUser?.profileImage 
    ? `http://localhost:5001${currentUser.profileImage}` 
    : ''
  );
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First update text profile data
      const success = await updateProfile({ firstName, lastName, email });
      
      // Then upload profile image if selected
      if (success && profileImage) {
        console.log("Profil resmi yükleniyor:", profileImage.name);
        await uploadProfileImage(profileImage);
      }
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      // Error is handled by authContext and displayed via the error state
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Seçilen dosya:", file.name, "Boyut:", file.size, "Tip:", file.type);
      
      // Dosya türü kontrolü
      if (!file.type.match('image.*')) {
        console.error("Lütfen geçerli bir resim dosyası seçin");
        return;
      }
      
      // Dosya boyutu kontrolü (5MB'dan küçük olmalı)
      if (file.size > 5 * 1024 * 1024) {
        console.error("Dosya boyutu çok büyük, maksimum 5MB olabilir");
        return;
      }
      
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="settings-modal">
      <div className="settings-modal-content">
        <h2>Profile Settings</h2>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="profile-image-container">
            <div 
              className="profile-image" 
              onClick={handleImageClick}
              style={{ 
                backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                backgroundColor: previewUrl ? 'transparent' : '#e0e0e0'
              }}
            >
              {!previewUrl && (
                <span className="profile-image-placeholder">
                  {firstName && lastName 
                    ? `${firstName[0]}${lastName[0]}` 
                    : currentUser?.username?.[0] || 'U'}
                </span>
              )}
              <div className="profile-image-overlay">
                <span>Change</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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

export default ProfileSettings; 