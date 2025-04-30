const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be positive']
  },
  type: {
    type: String,
    required: [true, 'Please add an investment type'],
    enum: ['stock', 'bond', 'real estate', 'crypto', 'mutual fund', 'other']
  },
  riskLevel: {
    type: String,
    required: [true, 'Please add a risk level'],
    enum: ['low', 'medium', 'high']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
    default: Date.now
  },
  expectedReturn: {
    type: Number,
    required: [true, 'Please add an expected return percentage'],
    min: [0, 'Expected return must be positive']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  returns: [returnSchema],
  totalReturn: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
investmentSchema.index({ user: 1, type: 1 });
investmentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Investment', investmentSchema); 