const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

// Customers
router.post('/sync-user', shopController.syncUser);

// Orders
router.post('/orders', shopController.createOrder);

// Clover Charge
router.post('/clover/charge', shopController.cloverCharge);

module.exports = router;
