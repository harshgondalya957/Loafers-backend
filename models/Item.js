const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    category_id: { type: String, required: true },
    sub_category_id: { type: String },
    customization_group_id: { type: String },

    name: { type: String, required: true },
    description: String,
    image: String,
    price: { type: Number, required: true },
    energy_kcal: Number,
    tags: [String],

    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 },

    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Item', ItemSchema);
