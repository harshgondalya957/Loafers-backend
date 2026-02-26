const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// 1. Settings
router.get('/settings', storeController.getSettings);
router.put('/settings', storeController.updateSettings);

// 2. Riders
router.get('/riders', storeController.getRiders);
router.post('/riders', storeController.createRider);
router.delete('/riders/:id', storeController.deleteRider);

router.get('/debug-db', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        const colls = await db.listCollections().toArray();
        const ridersData = await db.collection('riders').find().toArray();
        const RidersCapData = await db.collection('Riders').find().toArray();
        res.json({
            database: db.databaseName,
            collections: colls.map(c => c.name),
            ridersCollData: ridersData,
            RidersCapData: RidersCapData
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Categories
router.get('/categories', storeController.getCategories);
router.post('/categories', storeController.createCategory);
router.put('/categories/:id', storeController.updateCategory);
router.delete('/categories/:id', storeController.deleteCategory);

// 4. Sub-Categories
router.get('/sub-categories', storeController.getSubCategories);
router.post('/sub-categories', storeController.createSubCategory);
router.put('/sub-categories/:id', storeController.updateSubCategory);
router.delete('/sub-categories/:id', storeController.deleteSubCategory);

// 5. Items
router.get('/items', storeController.getItems);
router.post('/items', storeController.createItem);
router.put('/items/:id', storeController.updateItem);
router.delete('/items/:id', storeController.deleteItem);
router.patch('/items/:id/status', storeController.toggleItemStatus);

// 6. Customization Groups
router.get('/customization-groups', storeController.getCustomizationGroups);
router.post('/customization-groups', storeController.createCustomizationGroup);
router.delete('/customization-groups/:id', storeController.deleteCustomizationGroup);

// Customization Items
router.get('/customization-groups/:groupId/items', storeController.getCustomizationItems);
router.post('/customization-groups/:groupId/items', storeController.createCustomizationItem);
router.delete('/customization-items/:id', storeController.deleteCustomizationItem);

// 7. Coupons
router.get('/coupons', storeController.getCoupons);
router.post('/coupons', storeController.createCoupon);
router.delete('/coupons/:id', storeController.deleteCoupon);

// 8. Orders (Active & Status)
router.get('/orders/active', storeController.getActiveOrders);
router.put('/orders/:id/status', storeController.updateOrderStatus);

module.exports = router;
