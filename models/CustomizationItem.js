const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    group_id: { type: String, required: true },
    name: String,
    price: Number,
    calories: Number
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('CustomizationItem', ItemSchema);
