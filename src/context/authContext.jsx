import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by token in localStorage
    const checkUserLoggedIn = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setCurrentUser(response.data);
          
          // Set theme from user preferences if available
          if (response.data.theme) {
            setTheme(response.data.theme);
            localStorage.setItem('theme', response.data.theme);
          }
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data);
      
      // Set theme from user preferences
      if (response.data.theme) {
        setTheme(response.data.theme);
      }
      
      navigate('/');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Özel hata mesajı varsa kullan
      if (error.displayMessage) {
        setError(error.displayMessage);
        return false;
      }
      
      // Daha açıklayıcı hata mesajları
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.message === 'Invalid credentials') {
            setError('Invalid email or password. Please check your information and try again.');
          } else {
            setError(error.response.data.message || 'An error occurred during login.');
          }
        } else if (error.response.status === 404) {
          setError('User not found. Please register or check your email address.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Login failed. Please check your information and try again.');
        }
      } else if (error.request) {
        setError('Cannot connect to server. Please make sure the backend server is running and check your internet connection.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register({ username, email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data);
      navigate('/');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      
      // Özel hata mesajı varsa kullan
      if (error.displayMessage) {
        setError(error.displayMessage);
        return false;
      }
      
      // Daha açıklayıcı hata mesajları
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.message === 'User already exists') {
            setError('A user with this email already exists. Please login or use a different email.');
          } else if (error.response.data.message && error.response.data.message.includes('duplicate key')) {
            setError('This username or email is already in use. Please try a different username or email address.');
          } else {
            setError(error.response.data.message || 'An error occurred during registration.');
          }
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Registration failed. Please check your information and try again.');
        }
      } else if (error.request) {
        setError('Cannot connect to server. Please make sure the backend server is running and check your internet connection.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Password change failed');
      setLoading(false);
      return false;
    }
  };
  
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(profileData);
      setCurrentUser({...currentUser, ...response.data});
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      setLoading(false);
      return false;
    }
  };
  
  const uploadProfileImage = async (imageFile) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.uploadProfileImage(imageFile);
      setCurrentUser({...currentUser, profileImage: response.data.profileImage});
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile image upload failed');
      setLoading(false);
      return false;
    }
  };
  
  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    
    if (currentUser) {
      try {
        await authService.updateTheme(newTheme);
        setCurrentUser({...currentUser, theme: newTheme});
        return true;
      } catch (error) {
        console.error('Failed to save theme preference', error);
        return false;
      }
    }
  };
  
  const updateNotificationSettings = async (notificationSettings) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateNotificationSettings(notificationSettings);
      setCurrentUser({...currentUser, notificationSettings: response.data.notificationSettings});
      setLoading(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Notification settings update failed');
      setLoading(false);
      return false;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    theme,
    login,
    register,
    logout,
    changePassword,
    updateProfile,
    uploadProfileImage,
    updateTheme,
    updateNotificationSettings
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 