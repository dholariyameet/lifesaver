const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const authMiddleware = require('../middleware/authmiddleware');

// Get all requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requestedBy', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new blood request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const request = new BloodRequest({
      ...req.body,
      requestedBy: req.user.id
    });
    await request.save();
    res.status(201).json({ message: 'Blood request submitted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single request
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requestedBy', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update request status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json({ message: 'Request updated', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;