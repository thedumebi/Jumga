const mongoose = require("mongoose");

const shopShema = new mongoose.Schema ({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  country: String,
  dispatch_rider: String,
  bank: String,
  account_number: String,
  revenue: Number,
  items: Array,
  vendor_id: Number,
  created_at: {
    type: Date,
    default: Date.now()
  }
});

exports.shopModel = mongoose.model("Shop", shopSchema);