const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Load environment variables for email commands
// Resolve .env relative to this script location (scripts/.env -> ../.env)
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    // Fallback: try loading from CWD
    require('dotenv').config();
}

const nodemailer = require('nodemailer');

const dbPath = path.resolve(__dirname, '../db/loafers_db.sqlite');
const db = new sqlite3.Database(dbPath);

const command = process.argv[2];

switch (command) {
    case 'check-schema':
        checkSchema();
        break;
    case 'latest-order':
        checkLatestOrder();
        break;
    case 'update-hours':
        updateHours(process.argv[3], process.argv[4]);
        break;
    case 'test-email':
        testEmail(process.argv[3]);
        break;
    default:
        console.log(`
Usage: node manage_db.js <command> [args]

Database Commands:
  check-schema          Check database schema (orders table)
  latest-order          Show latest order details
  update-hours <open> <close>   Update store hours (default: 08:00 15:00)

Utility Commands:
  test-email [to]       Send a test email (defaults to EMAIL_USER)
`);
        // Close DB if no command
        db.close();
        process.exit(1);
}

function checkSchema() {
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
        db.close();
    });
}

function checkLatestOrder() {
    db.get("SELECT * FROM orders ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) {
            console.error(err);
        } else {
            if (!row) {
                console.log("No orders found.");
            } else {
                console.log("Latest Order ID:", row.id);
                console.log("Delivery Address:", row.delivery_address);
                console.log("Raw Row:", JSON.stringify(row));
            }
        }
        db.close();
    });
}

function updateHours(openTime = '08:00', closeTime = '15:00') {
    console.log(`Updating store settings to Open: ${openTime}, Close: ${closeTime}`);
    db.run(`UPDATE store_settings SET open_time = ?, close_time = ? WHERE id = 1`, [openTime, closeTime], function (err) {
        if (err) {
            console.error("Error updating settings:", err.message);
        } else {
            console.log(`Row(s) updated: ${this.changes}`);
            // Verify
            db.get("SELECT * FROM store_settings WHERE id = 1", (err, row) => {
                if (err) console.error(err);
                else console.log("New Settings:", row);
                db.close();
            });
        }
    });
}

function testEmail(toAddress) {
    db.close(); // DB not needed for email

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log("Testing Email Config...");
    console.log("User:", emailUser);
    console.log("Pass:", emailPass ? "****" : "Not Set");

    if (!emailUser || !emailPass) {
        console.error("ERROR: EMAIL_USER or EMAIL_PASS not found in .env");
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const targetEmail = toAddress || emailUser;

    const mailOptions = {
        from: emailUser,
        to: targetEmail,
        subject: 'Loafers Backend Test Email',
        text: `This is a test email sent from manage_db.js utility.\nTime: ${new Date().toISOString()}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            process.exit(1);
        } else {
            console.log('Email sent successfully: ' + info.response);
            process.exit(0);
        }
    });
}
