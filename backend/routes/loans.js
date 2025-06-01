const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const { protect } = require('../middleware/auth');

// @route   GET /api/loans
// @desc    Get all loans for a user
router.get('/', protect, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });
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
      endDate,
      monthlyPayment,
      lender,
      status
    } = req.body;

    // Validate required fields
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    if (!interestRate) return res.status(400).json({ message: 'Interest rate is required' });
    if (!term) return res.status(400).json({ message: 'Term is required' });
    if (!startDate) return res.status(400).json({ message: 'Start date is required' });
    if (!endDate) return res.status(400).json({ message: 'End date is required' });
    if (!monthlyPayment) return res.status(400).json({ message: 'Monthly payment is required' });

    const loan = await Loan.create({
      user: req.user.id,
      title,
      amount,
      interestRate,
      term,
      startDate,
      endDate,
      monthlyPayment,
      lender: lender || 'Bank',
      status: status || 'active'
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error('Loan creation error:', error);
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

    if (loan.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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

    if (loan.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await loan.deleteOne();
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

    if (loan.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Initialize payments array if it doesn't exist
    if (!loan.payments) {
      loan.payments = [];
      loan.paidAmount = 0;
    }

    loan.payments.push({ amount, date });
    loan.paidAmount = (loan.paidAmount || 0) + Number(amount);
    
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