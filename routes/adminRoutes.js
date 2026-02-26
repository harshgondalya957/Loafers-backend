const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Store Creation
router.post('/store', adminController.createStore);

// Reports
router.get('/reports/orders', adminController.getOrderReports); // query param type=date|month|year
router.get('/reports/sales', adminController.getSalesReports); // query param type=date|month|year
router.get('/reports/delivery', adminController.getDeliveryReports);

// Customers
router.get('/customers', adminController.getCustomers);

// Orders
router.get('/orders', adminController.getAllOrders);
router.get('/orders/all', adminController.getAllOrders); // Alias for intuitiveness
router.delete('/orders/all', adminController.deleteAllOrders);
router.delete('/orders/:id', adminController.deleteOrder);
router.get('/orders/:id', adminController.getOrderDetails);

module.exports = router;
