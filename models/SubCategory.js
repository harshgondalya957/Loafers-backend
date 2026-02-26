const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    category_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);
