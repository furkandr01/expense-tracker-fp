const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');


router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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


router.put('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }


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


router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget entry not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget entry removed' });
  } catch (error) {
    console.error('Budget delete error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 