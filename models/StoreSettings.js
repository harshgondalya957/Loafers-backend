const mongoose = require('mongoose');

const StoreSettingsSchema = new mongoose.Schema({
    open_time: { type: String, default: '09:00' },
    close_time: { type: String, default: '22:00' },
    delivery_enabled: { type: Boolean, default: true },
    pickup_enabled: { type: Boolean, default: true },
    auto_print_enabled: { type: Boolean, default: false }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('StoreSettings', StoreSettingsSchema);
