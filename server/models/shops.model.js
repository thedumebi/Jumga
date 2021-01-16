const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema ({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  country: String,
  dispatch_rider: Object,
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

const shopModel = mongoose.model("Shop", shopSchema);

module.exports = shopModel;