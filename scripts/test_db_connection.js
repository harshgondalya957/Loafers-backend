require('dotenv').config();
const mongoose = require('mongoose');

console.log("Testing MongoDB Connection...");
console.log("URI:", process.env.MONGO_URI ? "Found (Hidden)" : "MISSING");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    }).catch(err => {
        console.error("ERROR: Failed to connect.", err);
        process.exit(1);
    });
