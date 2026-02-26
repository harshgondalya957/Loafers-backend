const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Rider Auth
router.post('/login', deliveryController.loginRider);

// Rider Orders
router.get('/orders/:riderId', deliveryController.getRiderOrders);
router.get('/order/:orderId', deliveryController.getOrderDetails);

// Status Update
router.put('/order/:orderId/status', deliveryController.updateOrderStatus);

module.exports = router;
