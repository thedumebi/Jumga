const mongoose = require("mongoose");

const shopPaymentSchema = new mongoose.Schema ({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    tx_ref: String,
    amount: Number,
    currency: String,
    name: String,
    email: String,
    country: String,
    bank: String,
    account_number: String,
    vendor_id: Number,
    status: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const shopPaymentModel = mongoose.model("ShopPayment", shopPaymentSchema);

module.exports = shopPaymentModel;