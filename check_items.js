require('dotenv').config();
const mongoose = require('mongoose');

async function checkItems() {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'loafer' });
    const db = mongoose.connection.db;

    const items = await db.collection('items').find().toArray();
    console.log("items collection length:", items.length);

    const ItemsColl = await db.collection('Items').find().toArray();
    console.log("Items collection length:", ItemsColl.length);

    // Group items by name to see duplicates
    const names = {};
    for (const item of items) {
        names[item.name] = (names[item.name] || 0) + 1;
    }
    const duplicated = Object.entries(names).filter(([k, v]) => v > 1);
    console.log("Duplicated names in 'items' collection:", duplicated.length);
    console.log(duplicated.slice(0, 5));

    await mongoose.disconnect();
}
checkItems();
