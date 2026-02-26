const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const categories = [
    "Hot Drinks", "Soft Drinks", "Burger Bar", "Big Foot Hot Dogs", "Salad Bar",
    "Savouries", "Meal Deals", "Shakes", "Sweet Treats", "Breakfast",
    "Omelettes", "Indian Breakfast", "Triple Toasties", "Burritos",
    "Sandwiches", "Jacket Potatoes", "Chippy", "Loaded French Fries",
    "Loaded Chilli Or Garlic French Fries"
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/loafer', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            dbName: 'loafer'
        });

        console.log('Connected to DB');

        for (let i = 0; i < categories.length; i++) {
            const name = categories[i];
            const existing = await Category.findOne({ name });
            if (!existing) {
                await Category.create({ name, sort_order: i + 1, is_active: true });
                console.log(`Created category: ${name}`);
            } else {
                console.log(`Category already exists: ${name}`);
            }
        }
        console.log('Finished seeding categories!');
        process.exit(0);
    } catch (e) {
        console.error('Error seeding categories:', e);
        process.exit(1);
    }
}

seed();
