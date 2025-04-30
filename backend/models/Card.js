const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: [true, 'Please provide a card number'],
    trim: true
  },
  cardHolder: {
    type: String,
    required: [true, 'Please provide card holder name'],
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  cvv: {
    type: String,
    required: [true, 'Please provide CVV'],
    trim: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  bank: {
    type: String,
    required: [true, 'Please provide bank name'],
    trim: true
  },
  limit: {
    type: Number,
    required: function() {
      return this.type === 'credit';
    }
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema); 