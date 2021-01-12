const passport = require("passport");
const vendorModel = require("../models/vendors.models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.createVendor = async function (req, res) {
  try {
    const [vendor] = await vendorModel.find().sort({ created_at: -1 }).exec();
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newVendor = new vendorModel({
        id : vendor ? vendor.id + 1 : 1,
        username: req.body.username,
        password: hash,
        name: req.body.name,
        phone_number: req.body.phone,
        role: req.body.role,
        created_at: Date.now()
      });
      newVendor.save(function(err) {
        if (!err) {
          passport.authenticate("vendorLocal", {failureRedirect: "/register", failureMessage: true})(req, res, function() {
            res.redirect("/vendor");
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
