const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema ({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: String,
    price: Number,
    vendor_id: Number,
    shop_id: Number,
    created_at: {
        type: Date,
        default: Date.now()
    }
  });

 exports.itemModel = mongoose.model("Item", itemSchema);