const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'loafers_db.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // 1. Store Settings
        db.run(`CREATE TABLE IF NOT EXISTS store_settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            open_time TEXT,
            close_time TEXT,
            delivery_enabled INTEGER DEFAULT 1,
            pickup_enabled INTEGER DEFAULT 1,
            auto_print_enabled INTEGER DEFAULT 0
        )`);

        // Initialize settings if not exists
        db.run("INSERT OR IGNORE INTO store_settings (id, open_time, close_time) VALUES (1, '09:00', '22:00')");

        // 2. Riders
        db.run(`CREATE TABLE IF NOT EXISTS riders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            vehicle_no TEXT,
            status TEXT DEFAULT 'available', -- available, busy, offline
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 3. Categories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 4. Sub-Categories
        db.run(`CREATE TABLE IF NOT EXISTS sub_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY(category_id) REFERENCES categories(id)
        )`);

        // 5. Customization Groups
        db.run(`CREATE TABLE IF NOT EXISTS customization_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_name TEXT NOT NULL,
            customer_name TEXT,
            min_selection INTEGER DEFAULT 0,
            max_selection INTEGER DEFAULT 1,
            is_required INTEGER DEFAULT 0, -- 0: Optional, 1: Required
            sort_order INTEGER DEFAULT 0
        )`);

        // 6. Customization Items
        db.run(`CREATE TABLE IF NOT EXISTS customization_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER,
            name TEXT NOT NULL,
            price REAL DEFAULT 0,
            calories INTEGER,
            FOREIGN KEY(group_id) REFERENCES customization_groups(id)
        )`);

        // 7. Items (Enhanced)
        // Check if description column exists, if not, we assume table needs migration or is new
        // For simplicity in this environment, we'll try to add columns if they don't exist
        // specific to SQLite: separate ALTER statements
        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            image TEXT,
            price REAL NOT NULL,
            category_id INTEGER,
            sub_category_id INTEGER,
            customization_group_id INTEGER,
            energy_kcal INTEGER,
            tags TEXT, -- JSON string for tags like ["Veg", "Gluten Free"]
            is_active INTEGER DEFAULT 1, -- 1: Publish, 0: Draft/Off
            sort_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Attempt to add columns to existing items table if run on existing DB
        const columnsToAdd = [
            "ALTER TABLE items ADD COLUMN description TEXT",
            "ALTER TABLE items ADD COLUMN image TEXT",
            "ALTER TABLE items ADD COLUMN category_id INTEGER",
            "ALTER TABLE items ADD COLUMN sub_category_id INTEGER",
            "ALTER TABLE items ADD COLUMN customization_group_id INTEGER",
            "ALTER TABLE items ADD COLUMN energy_kcal INTEGER",
            "ALTER TABLE items ADD COLUMN tags TEXT",
            "ALTER TABLE items ADD COLUMN is_active INTEGER DEFAULT 1",
            "ALTER TABLE items ADD COLUMN sort_order INTEGER DEFAULT 0"
        ];

        columnsToAdd.forEach(sql => {
            db.run(sql, (err) => {
                // Ignore errors (like duplicate column name) 
            });
        });

        // 8. Coupons
        db.run(`CREATE TABLE IF NOT EXISTS coupons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            type TEXT NOT NULL, -- amount, percentage, bogo
            value REAL, -- Amount or Percentage value
            expiry_date DATE,
            is_active INTEGER DEFAULT 1
        )`);

        // 9. Customers (Existing)
        db.run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 10. Stores (Existing)
        db.run(`CREATE TABLE IF NOT EXISTS stores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // 13. OTPs (New)
        db.run(`CREATE TABLE IF NOT EXISTS otps (
            email TEXT PRIMARY KEY,
            otp TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        )`);

        // 11. Orders (Existing - Add rider_id and status)
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            store_id INTEGER,
            rider_id INTEGER,
            total_amount REAL,
            status TEXT DEFAULT 'pending', -- pending, preparing, ready, delivery, completed, cancelled
            order_type TEXT DEFAULT 'delivery', -- delivery, pickup
            payment_method TEXT,
            order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(customer_id) REFERENCES customers(id),
            FOREIGN KEY(store_id) REFERENCES stores(id),
            FOREIGN KEY(rider_id) REFERENCES riders(id)
        )`, (err) => {
            // Migration for orders
            db.run("ALTER TABLE orders ADD COLUMN rider_id INTEGER", () => { });
            db.run("ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending'", () => { });
            db.run("ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'delivery'", () => { });
            db.run("ALTER TABLE orders ADD COLUMN payment_method TEXT", () => { });
            db.run("ALTER TABLE orders ADD COLUMN delivery_address TEXT", () => { });
            db.run("ALTER TABLE orders ADD COLUMN latitude REAL", () => { });
            db.run("ALTER TABLE orders ADD COLUMN longitude REAL", () => { });
        });

        // 12. Order Items (Existing)
        db.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            item_id INTEGER,
            quantity INTEGER,
            price_at_sale REAL,
            FOREIGN KEY(order_id) REFERENCES orders(id),
            FOREIGN KEY(item_id) REFERENCES items(id)
        )`);

        console.log("Database initialized with full Store Admin schema.");
        seedData();
    });
}

function seedData() {
    db.get("SELECT count(*) as count FROM items", (err, row) => {
        if (!err && row && row.count === 0) {
            console.log("Seeding initial data...");
            db.serialize(() => {
                // Seed Categories
                db.run("INSERT INTO categories (name) VALUES ('Burgers')");
                db.run("INSERT INTO categories (name) VALUES ('Drinks')");

                // Seed Items
                const stmtItem = db.prepare("INSERT INTO items (name, price, energy_kcal, tags, description) VALUES (?, ?, ?, ?, ?)");
                stmtItem.run("Classic Cheeseburger", 10.99, 550, '["Veg"]', "Juicy patty with cheese");
                stmtItem.run("Vanilla Latte", 4.50, 150, '["Gluten Free"]', "Smooth espresso with milk");
                stmtItem.finalize();

                console.log("Data seeded.");
            });
        }
    });
}

module.exports = db;
