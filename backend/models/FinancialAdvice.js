const mongoose = require('mongoose');

const financialAdviceSchema = new mongoose.Schema({
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
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true
  },
  link: {
    type: String,
    required: [true, 'Please provide a link'],
    trim: true
  },
  type: {
    type: String,
    enum: ['investment', 'market', 'finance', 'crypto'],
    required: true
  },
  /* createdAt: {
    type: Date,
    default: Date.now
  } */
});

module.exports = mongoose.model('FinancialAdvice', financialAdviceSchema); 