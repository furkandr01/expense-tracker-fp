const express = require('express');
const router = express.Router();
const FinancialAdvice = require('../models/FinancialAdvice');
const { protect } = require('../middleware/auth');

// @route   GET /api/financial
// @desc    Get all financial advice entries for a user
router.get('/', protect, async (req, res) => {
  try {
    const financialAdvice = await FinancialAdvice.find({ user: req.user._id });
    res.json(financialAdvice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/financial
// @desc    Create a new financial advice entry
router.post('/', protect, async (req, res) => {
  try {
    const { title, frequency, link, type } = req.body;

    const financialAdvice = await FinancialAdvice.create({
      user: req.user._id,
      title,
      frequency,
      link,
      type
    });

    res.status(201).json(financialAdvice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/financial/:id
// @desc    Update a financial advice entry
router.put('/:id', protect, async (req, res) => {
  try {
    const financialAdvice = await FinancialAdvice.findById(req.params.id);

    if (!financialAdvice) {
      return res.status(404).json({ message: 'Financial advice entry not found' });
    }

    // Check if the entry belongs to the user
    if (financialAdvice.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedFinancialAdvice = await FinancialAdvice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedFinancialAdvice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/financial/:id
// @desc    Delete a financial advice entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const financialAdvice = await FinancialAdvice.findById(req.params.id);

    if (!financialAdvice) {
      return res.status(404).json({ message: 'Financial advice entry not found' });
    }

    // Check if the entry belongs to the user
    if (financialAdvice.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await financialAdvice.deleteOne();
    res.json({ message: 'Financial advice entry removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 