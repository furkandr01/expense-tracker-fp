const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

// @route   GET /api/budget
// @desc    Get all budget entries for a user
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/budget
// @desc    Create a new budget entry
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, type, isFixed } = req.body;

    const budget = await Budget.create({
      user: req.user._id,
      title,
      amount,
      type,
      isFixed
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/budget/:id
// @desc    Update a budget entry
router.put('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    // Check if the budget belongs to the user
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/budget/:id
// @desc    Delete a budget entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    // Check if the budget belongs to the user
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.remove();
    res.json({ message: 'Budget entry removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 