require('dotenv').config();
const mongoose = require('mongoose');

async function cleanupDuplicates() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: 'loafer' });
        const db = mongoose.connection.db;

        const items = await db.collection('items').find().toArray();
        console.log(`Found ${items.length} items total.`);

        const seenNames = new Set();
        const duplicateIds = [];

        for (const item of items) {
            if (seenNames.has(item.name)) {
                duplicateIds.push(item._id);
            } else {
                seenNames.add(item.name);
            }
        }

        console.log(`Found ${duplicateIds.length} duplicate items to remove.`);

        if (duplicateIds.length > 0) {
            const result = await db.collection('items').deleteMany({
                _id: { $in: duplicateIds }
            });
            console.log(`Deleted ${result.deletedCount} items.`);
        } else {
            console.log("No duplicates found to delete.");
        }

    } catch (error) {
        console.error("Error cleaning up duplicates:", error);
    } finally {
        await mongoose.disconnect();
    }
}

cleanupDuplicates();
