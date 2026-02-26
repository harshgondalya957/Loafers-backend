const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '10m' } // The document will be automatically deleted after 10 minutes
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
