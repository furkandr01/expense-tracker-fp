const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth');

// @desc    Get all subscriptions for user
// @route   GET /api/subscriptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check user ownership
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a subscription
// @route   POST /api/subscriptions
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      amount,
      frequency,
      startDate,
      endDate,
      category,
      nextBillingDate,
      isActive
    } = req.body;
    
    const newSubscription = new Subscription({
      user: req.user.id,
      title,
      amount,
      frequency,
      startDate,
      endDate,
      category,
      isActive: isActive !== undefined ? isActive : true,
      nextBillingDate
    });
    
    const subscription = await newSubscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update a subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const {
      title,
      amount,
      frequency,
      startDate,
      endDate,
      category,
      nextBillingDate,
      isActive
    } = req.body;
    
    let subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check user ownership
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        frequency,
        startDate,
        endDate,
        category,
        nextBillingDate,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    res.json(subscription);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check user ownership
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    await subscription.deleteOne();
    
    res.json({ message: 'Subscription removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router; 