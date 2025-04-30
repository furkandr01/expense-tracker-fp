const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const { protect } = require('../middleware/auth');

// @route   GET /api/investments
// @desc    Get all investments for a user
router.get('/', protect, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.json(investments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/investments
// @desc    Create a new investment
router.post('/', protect, async (req, res) => {
  try {
    const { 
      title,
      amount,
      type,
      riskLevel,
      startDate,
      expectedReturn,
      status
    } = req.body;

    const investment = await Investment.create({
      user: req.user._id,
      title,
      amount,
      type,
      riskLevel,
      startDate,
      expectedReturn,
      status
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/investments/:id
// @desc    Update an investment
router.put('/:id', protect, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedInvestment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/investments/:id
// @desc    Delete an investment
router.delete('/:id', protect, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await investment.remove();
    res.json({ message: 'Investment removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/investments/:id/return
// @desc    Add a return to investment
router.put('/:id/return', protect, async (req, res) => {
  try {
    const { amount, date } = req.body;
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    investment.returns.push({ amount, date });
    investment.totalReturn += amount;
    await investment.save();
    
    res.json(investment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 