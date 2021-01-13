const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema ({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    tx_ref: String,
    amount: Number,
    currency: String,
    item_id: Number,
    vendor_id: Number,
    vendor_amount: Number,
    jumga_commission: Number,
    delivery_amount: Number,
    delivery_commission: Number,
    dispatch_amount: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = purchaseModel;