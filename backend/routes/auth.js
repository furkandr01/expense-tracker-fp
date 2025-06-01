const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profile-images');
    // Ensure the directory exists
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, 
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }
}).single('profileImage');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(`Register attempt - username: ${username}, email: ${email}`);

    // Validate username, email and password
    if (!username || !email || !password) {
      console.log('Missing required fields for registration');
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists by email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      console.log(`Email already exists: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if username is taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log(`Username already exists: ${username}`);
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    console.log(`User registered successfully: ${user.username}`);

    const token = generateToken(user._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Validate email and password
    if (!email || !password) {
      console.log('Email or password missing');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`Invalid password for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`Login successful for user: ${user.username}`);

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      theme: user.theme,
      notificationSettings: user.notificationSettings,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/auth/password
// @desc    Change user password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Set new password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { 
        firstName, 
        lastName,
        email
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/profile-image
// @desc    Upload profile image
router.post('/profile-image', protect, async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    try {
      // Get file path - use forward slashes for URL paths
      const profileImage = `/uploads/profile-images/${req.file.filename}`;
      
      // Update user with new profile image path
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage },
        { new: true }
      );
      
      res.json({
        profileImage: updatedUser.profileImage,
        message: 'Profile image uploaded successfully'
      });
    } catch (error) {
      console.error('Profile image upload error:', error);
      res.status(400).json({ message: error.message });
    }
  });
});

// @route   PUT /api/auth/theme
// @desc    Update user theme
router.put('/theme', protect, async (req, res) => {
  try {
    const { theme } = req.body;
    
    if (!theme || !['light', 'dark'].includes(theme)) {
      return res.status(400).json({ message: 'Please provide a valid theme (light or dark)' });
    }
    
    // Update user theme
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true }
    );
    
    res.json({
      theme: updatedUser.theme,
      message: 'Theme updated successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/auth/notifications
// @desc    Update notification settings
router.put('/notifications', protect, async (req, res) => {
  try {
    const { notificationSettings } = req.body;
    
    // Update user notification settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { notificationSettings },
      { new: true }
    );
    
    res.json({
      notificationSettings: updatedUser.notificationSettings,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = router; 