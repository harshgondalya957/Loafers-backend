const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    item_id: { type: String },
    name: { type: String },
    price: { type: Number }, // Changed from price_at_sale to match frontend if needed, keeping simple
    quantity: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    customizations: [{
        name: String,
        price: Number
    }]
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional link if logged in
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_phone: { type: String, required: true },

    store_id: { type: String, default: '1' },

    items: [OrderItemSchema],

    total_amount: { type: Number, required: true },
    subtotal: { type: Number },
    delivery_fee: { type: Number },
    service_charge: { type: Number },
    tip_amount: { type: Number },
    discount_amount: { type: Number },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'assigned', 'picked_up', 'on_the_way', 'delivered', 'completed', 'cancelled'],
        default: 'pending'
    },

    order_type: { type: String, enum: ['delivery', 'pickup', 'dine-in'], default: 'delivery' },
    payment_method: { type: String, default: 'cod' }, // 'card', 'upi', 'cash'

    delivery_address: { type: String },
    postcode: { type: String },
    delivery_instructions: { type: String },

    scheduled_time: { type: String }, // 'ASAP' or ISO string

    rider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },

    order_date: { type: String },
    order_time: { type: String },

    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Order', OrderSchema);
