const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const clientModel = require("./clients.model");
const dispatchModel = require("./dispatch.model");

const vendorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true
  },
  name: String,
  password: String,
  phone_number: String,
  shops: Array,
  role: String,
  country: String,
  bought_items: Array,
  favorites: Array,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const vendorModel = mongoose.model("Vendor", vendorSchema);

passport.use("vendorLocal", new localStrategy(function(username, password, done) {
  vendorModel.findOne({username: username}, function(err, vendor) {
    if (err) {return done(err);}
    if (!vendor) {
      return done(null, false, {message: "Incorrect username!"});
    }
    bcrypt.compare(password, vendor.password, function(err, result) {
      if (err) {console.log(err);}
      if (result == true) {
        return done(null, vendor);
      } else {
        return done(null, false, {message: "Incorrect password!"});
      }
    });
  });
}));

passport.serializeUser(function (user, done) {
  const key = {
    id: user._id,
    type: user.role
  };
  done(null, key);
});
passport.deserializeUser(function (key, done) {
  const model = key.type === "vendor" ? vendorModel : key.type === "client" ? clientModel : dispatchModel;
  model.findById(key.id, function (err, user) {
    done(err, user);
  });
});


module.exports = vendorModel;
