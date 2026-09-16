const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/addressController');

router.use(protect);
router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;
