const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Hot Drinks",
                "Soft Drinks",
                "Burger Bar",
                "Big Foot Hot Dogs",
                "Salad Bar",
                "Savouries",
                "Meal Deals",
                "Shakes",
                "Sweet Treats",
                "Breakfast",
                "Omelettes",
                "Indian Breakfast",
                "Triple Toasties",
                "Burritos",
                "Sandwiches",
                "Jacket Potatoes",
                "Chippy",
                "Loaded French Fries",
                "Loaded Chilli Or Garlic French Fries"
            ]
        },
        subsection: {
            type: String,
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
