const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicle_no: { type: String, required: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Rider', RiderSchema);
