const Order = require('../models/Order');
const User = require('../models/User');
const Store = require('../models/Store'); // Assumed compatible or I create it
// const Rider = require('../models/Rider');

exports.createStore = async (req, res) => {
    try {
        const { name, location } = req.body;
        const store = await Store.create({ name, location });
        res.status(201).json(store);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getOrderReports = async (req, res) => {
    const { type } = req.query; // date, month, year
    let format = "%Y-%m-%d";
    if (type === 'month') format = "%Y-%m";
    if (type === 'year') format = "%Y";

    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format, date: "$created_at" } },
                    total_orders: { $sum: 1 },
                    total_revenue: { $sum: "$total_amount" }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const formatted = stats.map(s => ({
            period: s._id,
            total_orders: s.total_orders,
            total_revenue: s.total_revenue
        }));

        res.json(formatted);
    } catch (e) {
        console.error("Report Error:", e);
        res.status(500).json({ error: e.message });
    }
};

exports.getSalesReports = async (req, res) => {
    const { type } = req.query;
    let format = "%Y-%m-%d";
    if (type === 'month') format = "%Y-%m";
    if (type === 'year') format = "%Y";

    try {
        const stats = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: {
                        name: "$items.name",
                        period: { $dateToString: { format, date: "$created_at" } }
                    },
                    total_sold: { $sum: "$items.quantity" },
                    total_revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    category: { $first: "$items.category" }
                }
            },
            { $sort: { "_id.period": -1, total_sold: -1 } }
        ]);

        const formatted = stats.map(s => ({
            name: s._id.name || 'Unknown Item',
            period: s._id.period,
            total_sold: s.total_sold,
            total_revenue: s.total_revenue,
            category: s.category || 'Uncategorized'
        }));

        res.json(formatted);
    } catch (e) {
        console.error("Sales Report Error:", e);
        res.status(500).json({ error: e.message });
    }
};

exports.getDeliveryReports = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { status: 'completed', rider_id: { $exists: true, $ne: null } } },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider_id',
                    foreignField: '_id',
                    as: 'rider'
                }
            },
            { $unwind: "$rider" },
            {
                $group: {
                    _id: "$rider.name",
                    total_deliveries: { $sum: 1 },
                    total_revenue: { $sum: "$total_amount" }
                }
            },
            { $sort: { total_deliveries: -1 } }
        ]);

        const formatted = stats.map(s => ({
            rider_name: s._id,
            total_deliveries: s.total_deliveries,
            total_revenue: s.total_revenue
        }));

        res.json(formatted);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        // Use lean() for performance
        const customers = await User.find().sort({ created_at: -1 });
        res.json(customers);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ created_at: -1 });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteAllOrders = async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: 'All orders deleted' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndDelete(id);
        res.json({ message: `Order ${id} deleted` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
