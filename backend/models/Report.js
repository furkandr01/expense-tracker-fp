const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  income: {
    total: {
      type: Number,
      default: 0
    },
    categories: [{
      name: String,
      amount: Number
    }]
  },
  expenses: {
    total: {
      type: Number,
      default: 0
    },
    categories: [{
      name: String,
      amount: Number
    }]
  },
  savings: {
    total: {
      type: Number,
      default: 0
    },
    categories: [{
      name: String,
      amount: Number
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema); 