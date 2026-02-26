const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'db/loafers_db.sqlite');
const db = new sqlite3.Database(dbPath);

db.get("SELECT * FROM orders ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Latest Order ID:", row.id);
        console.log("Delivery Address:", row.delivery_address);
        console.log("Raw Row:", JSON.stringify(row));
    }
});
