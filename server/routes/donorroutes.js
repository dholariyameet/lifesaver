const express            = require('express');
const router             = express.Router();
const Donor              = require('../models/Donor');
const authMiddleware     = require('../middleware/authMiddleware');
const generateCertificate = require('../utils/generateCertificate');
const sendCertificateEmail = require('../utils/sendEmail');

// Get all donors (with optional filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.bloodGroup) filter.bloodGroup = req.query.bloodGroup;
    if (req.query.city)       filter.city       = req.query.city;
    const donors = await Donor.find(filter);
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add donor + generate certificate + send email
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Generate unique certificate ID
    const certificateId = 'LS-' + Date.now() + '-' +
      Math.random().toString(36).substring(2, 7).toUpperCase();

    // Save donor with certificateId
    const donor = new Donor({ ...req.body, certificateId });
    await donor.save();

    // Generate PDF certificate
    const pdfBuffer = await generateCertificate(donor);

    // Send email with certificate attached
    await sendCertificateEmail(donor, pdfBuffer);

    res.status(201).json({
      message: 'Donor registered! Certificate sent to ' + donor.email,
      donor
    });
  } catch (error) {
    console.error('Donor registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single donor
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update donor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Donor updated', donor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete donor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;