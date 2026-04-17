const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'critical'],
    default: 'medium'
  },
  message: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);