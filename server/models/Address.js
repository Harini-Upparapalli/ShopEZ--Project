const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  label: { type: String, default: 'Home', trim: true },
  name: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  addressLine: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
