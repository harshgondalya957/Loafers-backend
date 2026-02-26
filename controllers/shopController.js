const Order = require('../models/Order');
const User = require('../models/User');

exports.syncUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            user.name = name;
            user.phone = phone;
            await user.save();
        } else {
            user = await User.create({ name, email, phone });
        }
        res.json({ message: 'User synced', id: user.id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            store_id,
            total_amount,
            items,
            delivery_address,
            payment_method,
            order_type,
            scheduled_time,
            postcode,
            instructions // Frontend sends 'instructions' in formData
        } = req.body;

        console.log("Creating Order for:", customer_email);

        // 1. Find or Create User
        let user = await User.findOne({ email: customer_email });
        if (!user) {
            user = await User.create({
                name: customer_name || 'Guest',
                email: customer_email,
                phone: customer_phone || ''
            });
        } else {
            // Update fields if provided
            if (customer_phone) user.phone = customer_phone;
            if (customer_name && user.name === 'Customer') user.name = customer_name;
            await user.save();
        }

        // Check store timings logic
        const StoreSettings = require('../models/StoreSettings');
        const settings = await StoreSettings.findOne() || { open_time: '09:00', close_time: '22:00' };

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const openParts = (settings.open_time || '09:00').split(':');
        const closeParts = (settings.close_time || '22:00').split(':');

        const openMins = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
        const closeMins = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

        let isStoreOpen = false;
        if (closeMins > openMins) {
            isStoreOpen = currentTime >= openMins && currentTime <= closeMins;
        } else {
            isStoreOpen = currentTime >= openMins || currentTime <= closeMins;
        }

        // Validate ASAP outside hours
        if (!isStoreOpen && (!scheduled_time || scheduled_time === 'ASAP')) {
            return res.status(400).json({ error: "Store is currently closed. You must schedule your order for later." });
        }

        // Validate scheduled time valid
        if (scheduled_time && scheduled_time !== 'ASAP') {
            const requestedTime = new Date(scheduled_time);
            if (requestedTime < now) {
                return res.status(400).json({ error: "Cannot schedule an order in the past." });
            }

            // Check if the scheduled time is within operating hours for the scheduled day (simplified check for time part)
            const scheduledMins = requestedTime.getHours() * 60 + requestedTime.getMinutes();
            let isScheduledWithinHours = false;

            if (closeMins > openMins) {
                isScheduledWithinHours = scheduledMins >= openMins && scheduledMins <= closeMins;
            } else {
                isScheduledWithinHours = scheduledMins >= openMins || scheduledMins <= closeMins;
            }

            if (!isScheduledWithinHours) {
                return res.status(400).json({ error: `Scheduled time must be within our opening hours (${settings.open_time} to ${settings.close_time}).` });
            }
        }

        // 2. Create Order
        // Map items to schema structure
        const orderItems = (items || []).map(i => ({
            item_id: i.id,
            name: i.name,
            price: parseFloat(i.price),
            quantity: i.quantity,
            image: i.image,
            category: i.category,
            customizations: i.customizations // if any
        }));

        const order_date_formatted = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const order_time_formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const newOrder = new Order({
            customer_id: user._id,
            customer_name: customer_name || user.name,
            customer_email: customer_email || user.email,
            customer_phone: customer_phone || user.phone,
            store_id: store_id || '1',
            total_amount: parseFloat(total_amount),
            items: orderItems,
            order_type: order_type || 'delivery',
            payment_method: payment_method || 'cod',
            delivery_address: delivery_address ? `${delivery_address}${postcode ? ', ' + postcode : ''}` : '', // Combine if needed or check schema
            postcode: postcode,
            delivery_instructions: instructions,
            scheduled_time: scheduled_time,
            order_date: order_date_formatted,
            order_time: order_time_formatted,
            status: 'pending'
        });

        await newOrder.save();
        console.log("Order Saved:", newOrder.id);

        res.status(201).json({ message: 'Order created', id: newOrder.id, order: newOrder });

    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

const axios = require('axios');

exports.cloverCharge = async (req, res) => {
    try {
        const { amount, sourceToken } = req.body;

        const appId = process.env.CLOVER_APP_ID;
        const appSecret = process.env.CLOVER_APP_SECRET;
        const envUrl = (process.env.CLOVER_ENVIRONMENT || 'sandbox') === 'production'
            ? 'https://scl.clover.com'
            : 'https://scl-sandbox.dev.clover.com';

        if (!appId || !appSecret || appSecret === 'YAHAN_APNA_APP_SECRET_COPY_KAR_KE_PASTE_KARO') {
            return res.status(500).json({ error: 'Clover configuration is missing or invalid on the server.' });
        }

        // 1. Generate Token from Clover API using raw card data
        let expMonth = sourceToken.expiry.split('/')[0];
        let expYear = "20" + sourceToken.expiry.split('/')[1];
        let cardNumber = sourceToken.cardNumber.replace(/\s+/g, '');

        let tokenResponse;
        try {
            tokenResponse = await axios.post(`${envUrl}/v1/tokens`, {
                card: {
                    number: cardNumber,
                    exp_month: expMonth,
                    exp_year: expYear,
                    cvv: sourceToken.cvv
                }
            }, {
                headers: {
                    'apikey': appId,
                    'Content-Type': 'application/json'
                }
            });
        } catch (tokenErr) {
            console.error("Clover Tokenization failed:", tokenErr.response?.data || tokenErr.message);
            return res.status(400).json({ error: "Failed to verify card details with Clover." });
        }

        const cloverToken = tokenResponse.data.id;

        // 2. Charge the Token
        const amountInCents = Math.round(parseFloat(amount) * 100);

        let chargeResponse;
        try {
            chargeResponse = await axios.post(`${envUrl}/v1/charges`, {
                amount: amountInCents,
                currency: 'gbp',
                source: cloverToken
            }, {
                headers: {
                    'Authorization': `Bearer ${appSecret}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (chargeErr) {
            console.error("Clover Charge failed:", chargeErr.response?.data || chargeErr.message);
            return res.status(400).json({ error: "Payment was declined by Clover." });
        }

        res.json({
            success: true,
            status: chargeResponse.data.status,
            orderId: chargeResponse.data.id,
            message: 'Payment completed successfully.'
        });

    } catch (e) {
        console.error("Payment Exception:", e.message);
        res.status(500).json({ error: 'An error occurred during payment processing.' });
    }
};
