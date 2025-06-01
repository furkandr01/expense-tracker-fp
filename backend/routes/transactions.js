const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check user ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      date,
      category,
      description,
      image
    } = req.body;
    
    const newTransaction = new Transaction({
      user: req.user.id,
      title,
      amount,
      type,
      date,
      category,
      description,
      image
    });
    
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      title,
      amount,
      type,
      date,
      category,
      description,
      image
    } = req.body;
    
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check user ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        type,
        date,
        category,
        description,
        image
      },
      { new: true, runValidators: true }
    );
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Check user ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    await transaction.deleteOne();
    
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 