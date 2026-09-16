const express = require('express');
const router = express.Router();
const { placeOrder, placeCheckoutOrder, getMyOrders, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.post('/checkout', protect, placeCheckoutOrder);
router.get('/my', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
