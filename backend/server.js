// Load environment variables FIRST before everything else
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budget');
const financialRoutes = require('./routes/financial');
const subscriptionRoutes = require('./routes/subscriptions');
const cardRoutes = require('./routes/cards');
const transactionRoutes = require('./routes/transactions');
const loanRoutes = require('./routes/loans');
const savingsRoutes = require('./routes/savings');
const investmentRoutes = require('./routes/investments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Statik dosyalar için klasör
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with better configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Trying to start MongoDB service...');
    // Optionally try to start MongoDB service
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/investments', investmentRoutes);

// Basit sağlık kontrolü endpointi
app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 