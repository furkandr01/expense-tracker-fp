const express = require('express');
const router = express.Router();
const Savings = require('../models/Savings');
const { protect } = require('../middleware/auth');

// @route   GET /api/savings
// @desc    Get all savings for a user
router.get('/', protect, async (req, res) => {
  try {
    const savings = await Savings.find({ user: req.user._id });
    res.json(savings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/savings
// @desc    Create a new savings goal
router.post('/', protect, async (req, res) => {
  try {
    const { title, targetAmount, deadline, category } = req.body;

    const savings = await Savings.create({
      user: req.user._id,
      title,
      targetAmount,
      deadline,
      category
    });

    res.status(201).json(savings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/savings/:id
// @desc    Update a savings goal
router.put('/:id', protect, async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id);

    if (!savings) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (savings.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedSavings = await Savings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSavings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/savings/:id
// @desc    Delete a savings goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const savings = await Savings.findById(req.params.id);

    if (!savings) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (savings.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await savings.remove();
    res.json({ message: 'Savings goal removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/savings/:id/add
// @desc    Add amount to savings
router.put('/:id/add', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const savings = await Savings.findById(req.params.id);

    if (!savings) {
      return res.status(404).json({ message: 'Savings goal not found' });
    }

    if (savings.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    savings.currentAmount += amount;
    await savings.save();

    res.json(savings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 