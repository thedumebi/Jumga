const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const vendorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  username: String,
  name: String,
  password: String,
  phone_number: String,
  shops: Array,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

vendorSchema.plugin(passportLocalMongoose);

const vendorModel = mongoose.model("Vendor", vendorSchema);
passport.use(vendorModel.createStrategy());
passport.serializeUser(function (vendor, done) {
  done(null, vendor.id);
});
passport.deserializeUser(function (id, done) {
  vendorModel.findById(id, function (err, vendor) {
    done(err, vendor);
  });
});

module.exports = vendorModel;
