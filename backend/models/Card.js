const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: [true, 'Please provide card owner name'],
    trim: true
  },
  cardNumber: {
    type: String,
    required: [true, 'Please provide a card number'],
    trim: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  cardType: {
    type: String,
    enum: ['credit', 'debit'],
    default: 'credit'
  },
  /* cvv: {
    type: String,
    required: [true, 'Please provide CVV'],
    trim: true
  }, */
  /* bank: {
    type: String,
    required: [true, 'Please provide bank name'],
    trim: true
  }, */
  /* limit: {
    type: Number,
    required: function() {
      return this.type === 'credit';
    }
  }, */
  /* currentBalance: {
    type: Number,
    default: 0
  }, */
  /* isActive: {
    type: Boolean,
    default: true
  }, */
  /* createdAt: {
    type: Date,
    default: Date.now
  } */
});

module.exports = mongoose.model('Card', cardSchema); 