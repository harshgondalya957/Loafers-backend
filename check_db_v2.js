const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'db/loafers_db.sqlite');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(orders)", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        const columns = rows.map(r => r.name);
        console.log("Full columns list:", JSON.stringify(columns));
        if (columns.includes('delivery_address')) {
            console.log("delivery_address CHECK: FOUND");
        } else {
            console.log("delivery_address CHECK: MISSING");
        }
    }
});
