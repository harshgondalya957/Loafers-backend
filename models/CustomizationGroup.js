const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    admin_name: String,
    customer_name: String,
    min_selection: Number,
    max_selection: Number,
    is_required: Boolean,
    sort_order: { type: Number, default: 0 }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('CustomizationGroup', GroupSchema);
