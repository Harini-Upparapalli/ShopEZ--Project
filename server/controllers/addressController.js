const Address = require('../models/Address');

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const { label, name, mobile, addressLine, city, state, pincode } = req.body;
    if (!name || !mobile || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Please fill all address fields.' });
    }
    const address = await Address.create({ userId: req.user.id, label: label || 'Home', name, mobile, addressLine, city, state, pincode });
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found.' });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!address) return res.status(404).json({ message: 'Address not found.' });
    res.json({ message: 'Address deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
