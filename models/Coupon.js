const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    value: Number,
    expiry_date: Date,
    min_order_amount: Number,
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
