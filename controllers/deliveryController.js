const Order = require('../models/Order');
const Rider = require('../models/Rider');

exports.getRiderOrders = async (req, res) => {
    try {
        const { riderId } = req.params;
        const orders = await Order.find({
            rider_id: riderId,
            status: { $nin: ['completed', 'cancelled'] }
        }).sort({ created_at: -1 });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ message: "Order status updated", status });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.loginRider = async (req, res) => {
    try {
        const { phone } = req.body;
        const rider = await Rider.findOne({ phone }).lean();
        if (!rider) return res.status(404).json({ error: "Rider not found" });
        res.json({
            ...rider,
            id: rider._id,
            status: rider.status || 'available'
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
