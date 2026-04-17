const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  units: {
    type: Number,
    required: true,
    default: 0
  },
  hospital: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['available', 'low', 'out_of_stock'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);