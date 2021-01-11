const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema ({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    amount: Number,
    vendor_id: Number,
    vendor_amount: Number,
    commission: Number,
    delivery_amount: Number,
    delivery_commission: Number,
    dispatch_amount: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
});

exports.purchaseModel = mongoose.model("Purchase", purchaseSchema);