const express = require('express');
const router = express.Router();
const BloodInventory = require('../models/BloodInventory');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminmiddleware');

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await BloodInventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add blood stock (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = new BloodInventory({ ...req.body, addedBy: req.user.id });
    await item.save();
    res.status(201).json({ message: 'Blood stock added', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update stock
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const item = await BloodInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Inventory updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete stock
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await BloodInventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;