const StoreSettings = require('../models/StoreSettings');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Item = require('../models/Item');
const CustomizationGroup = require('../models/CustomizationGroup');
const CustomizationItem = require('../models/CustomizationItem');
const Coupon = require('../models/Coupon');
const Rider = require('../models/Rider');
const Order = require('../models/Order');

// 1. Store Settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await StoreSettings.findOne();
        if (!settings) settings = await StoreSettings.create({});
        res.json(settings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settings = await StoreSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 2. Riders
exports.getRiders = async (req, res) => {
    try {
        let riders = await Rider.find().sort({ created_at: -1 }).lean();

        // Fallback: Check if user manually created a capitalized 'Riders' collection in MongoDB Compass
        if (riders.length === 0) {
            try {
                const mongoose = require('mongoose');
                const db = mongoose.connection.db;
                const manualRiders = await db.collection('Riders').find().toArray();
                const singularRider = await db.collection('Rider').find().toArray();

                if (manualRiders.length > 0) riders = manualRiders;
                else if (singularRider.length > 0) riders = singularRider;
            } catch (err) {
                console.error("Fallback DB check error:", err);
            }
        }

        // Ensure status exists for legacy/manual data
        const ridersWithStatus = riders.map(r => ({
            ...r,
            id: r._id, // Map _id to id for frontend compatibility since we use lean()
            status: r.status || 'available',
            name: r.name || 'Unnamed Rider',
            phone: r.phone || 'N/A',
            vehicle_no: r.vehicle_no || 'N/A'
        }));
        res.json(ridersWithStatus);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createRider = async (req, res) => {
    try {
        const rider = await Rider.create(req.body);
        res.status(201).json(rider);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteRider = async (req, res) => {
    try {
        await Rider.findByIdAndDelete(req.params.id);
        res.json({ message: "Rider deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 3. Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort('sort_order');
        res.json(categories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Category updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Category deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 4. Sub-Categories
exports.getSubCategories = async (req, res) => {
    try {
        const subs = await SubCategory.find().sort('sort_order');
        res.json(subs);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createSubCategory = async (req, res) => {
    try {
        const sub = await SubCategory.create(req.body);
        res.status(201).json(sub);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Sub-Category updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.json({ message: "Sub-Category deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 5. Items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().sort('sort_order');
        // If frontend expects JSON tags, Mongoose array works if handled, but frontend might expect string. 
        // My Item.js schema probably has tags as [String].
        // AdminController logic (Step 1024) parsed string. 
        // IF front-end expects ARRAY, we are good.
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        await Item.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Item updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.toggleItemStatus = async (req, res) => {
    try {
        const { is_active } = req.body;
        await Item.findByIdAndUpdate(req.params.id, { is_active });
        res.json({ message: "Status updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 6. Customization Groups
exports.getCustomizationGroups = async (req, res) => {
    try {
        const groups = await CustomizationGroup.find().sort('sort_order');
        res.json(groups);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createCustomizationGroup = async (req, res) => {
    try {
        const group = await CustomizationGroup.create(req.body);
        res.status(201).json(group);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteCustomizationGroup = async (req, res) => {
    try {
        await CustomizationGroup.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Customization Items
exports.getCustomizationItems = async (req, res) => {
    try {
        const items = await CustomizationItem.find({ group_id: req.params.groupId });
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createCustomizationItem = async (req, res) => {
    try {
        const item = await CustomizationItem.create({ ...req.body, group_id: req.params.groupId });
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteCustomizationItem = async (req, res) => {
    try {
        await CustomizationItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 7. Coupons
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ _id: -1 });
        res.json(coupons);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 8. Active Orders
exports.getActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            status: { $nin: ['completed', 'cancelled'] }
        }).sort({ created_at: -1 });

        // Removed populate('rider_id') to return ID string for frontend dropdown compatibility.

        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, rider_id } = req.body;
        const update = { status };
        if (rider_id) update.rider_id = rider_id;

        await Order.findByIdAndUpdate(req.params.id, update);
        res.json({ message: "Order status updated" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
