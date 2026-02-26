require('dotenv').config();
const mongoose = require('mongoose');

console.log("Starting Connection Check...");
const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("ERROR: MONGO_URI is missing in .env");
    process.exit(1);
}

console.log("URI found. Attempting connection (5s timeout)...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    })
    .catch(err => {
        console.error("CONNECTION FAILED.");
        console.error("Error Name:", err.name);
        console.error("Error Message:", err.message);
        if (err.reason && err.reason.servers) {
            console.error("Failure Reason:", JSON.stringify(err.reason.servers, null, 2));
        }
        process.exit(1);
    });
