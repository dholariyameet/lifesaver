const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const BloodInventory = require('../models/BloodInventory');
const authMiddleware = require('../middleware/authmiddleware');
const adminMiddleware = require('../middleware/adminmiddleware');

// Dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalDonors    = await Donor.countDocuments();
    const totalRequests  = await BloodRequest.countDocuments();
    const pendingReqs    = await BloodRequest.countDocuments({ status: 'pending' });
    const totalUsers     = await User.countDocuments();
    const inventory      = await BloodInventory.find();

    res.json({ totalDonors, totalRequests, pendingReqs, totalUsers, inventory });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;