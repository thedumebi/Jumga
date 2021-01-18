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
    item_quantity: Number,
    item_name: String,
    shop_id: Number,
    vendor_id: Number,
    user_id: Number,
    user_role: String,
    vendor_amount: Number,
    purchase_role: String,
    jumga_commission: Number,
    delivery_amount: Number,
    delivery_commission: Number,
    dispatch_amount: Number,
    status: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = purchaseModel;