const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    zip: String,
    state: String,
    isDefault: { type: Boolean, default: false }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, default: 'Customer' },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String }, // Hashed
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' },
    googleId: { type: String },
    addresses: [AddressSchema],
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('User', UserSchema);
