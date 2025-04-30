const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const { protect } = require('../middleware/auth');

// @route   GET /api/loans
// @desc    Get all loans for a user
router.get('/', protect, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });
    res.json(loans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/loans
// @desc    Create a new loan
router.post('/', protect, async (req, res) => {
  try {
    const { 
      title,
      amount,
      interestRate,
      term,
      startDate,
      lender,
      type,
      status
    } = req.body;

    const loan = await Loan.create({
      user: req.user._id,
      title,
      amount,
      interestRate,
      term,
      startDate,
      lender,
      type,
      status
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/loans/:id
// @desc    Update a loan
router.put('/:id', protect, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLoan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/loans/:id
// @desc    Delete a loan
router.delete('/:id', protect, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await loan.remove();
    res.json({ message: 'Loan removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/loans/:id/payment
// @desc    Add a payment to loan
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { amount, date } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    loan.payments.push({ amount, date });
    loan.paidAmount += amount;
    
    if (loan.paidAmount >= loan.amount) {
      loan.status = 'paid';
    }

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 