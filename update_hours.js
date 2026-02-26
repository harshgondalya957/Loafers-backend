const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'db/loafers_db.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("Updating store settings to Open: 08:00, Close: 15:00");

db.run(`UPDATE store_settings SET open_time = '08:00', close_time = '15:00' WHERE id = 1`, function (err) {
    if (err) {
        console.error("Error updating settings:", err.message);
    } else {
        console.log(`Row(s) updated: ${this.changes}`);
    }

    // Verify
    db.get("SELECT * FROM store_settings WHERE id = 1", (err, row) => {
        if (err) console.error(err);
        else console.log("New Settings:", row);
    });
});
