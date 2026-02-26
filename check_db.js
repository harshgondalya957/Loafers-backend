const db = require('./db/database');

db.serialize(() => {
    db.all("PRAGMA table_info(orders)", (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Columns in orders table:", rows.map(r => r.name));
        }
    });
});
