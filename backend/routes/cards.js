const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { protect } = require('../middleware/auth');

// @desc    Get all cards for user
// @route   GET /api/cards
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single card
// @route   GET /api/cards/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    // Check user ownership
    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a card
// @route   POST /api/cards
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      ownerName,
      cardNumber,
      expiryDate,
      cardType,
      balance
    } = req.body;
    
    const newCard = new Card({
      user: req.user.id,
      ownerName,
      cardNumber,
      expiryDate,
      cardType: cardType || 'credit',
      balance: balance || 0
    });
    
    const card = await newCard.save();
    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      ownerName,
      cardNumber,
      expiryDate,
      cardType,
      balance
    } = req.body;
    
    let card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    // Check user ownership
    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    const updateData = {};
    if (ownerName) updateData.ownerName = ownerName;
    if (cardNumber) updateData.cardNumber = cardNumber;
    if (expiryDate) updateData.expiryDate = expiryDate;
    if (cardType) updateData.cardType = cardType;
    if (balance !== undefined) updateData.balance = balance;
    
    card = await Card.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(card);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    // Check user ownership
    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    await card.deleteOne();
    
    res.json({ message: 'Card removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 