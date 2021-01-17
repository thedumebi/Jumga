const passport = require("passport");
const vendorModel = require("../models/vendors.models");

exports.loginVendor = async function (req, res) {
  try {
    passport.authenticate("vendorLocal", function(err, vendor, info) {
      if (err) {console.log(err);}
      if (!vendor) {
        return res.send({status: "failed", message: info.message})
      }
      req.login(vendor, function(err) {
        if (err) {console.log(err);}
        return res.send({status: "success", user: req.user})
      });
    })(req, res);
  } catch (error) {
    console.log(error);
  }
};
