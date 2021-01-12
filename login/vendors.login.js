const passport = require("passport");
const vendorModel = require("../models/vendors.models");

exports.loginVendor = async function (req, res) {
  try {
    const newVendor = new vendorModel({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(newVendor, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("vendorLocal", { failureRedirect: "/login", failureMessage: true })(req, res,
          function () {
            res.redirect("/vendor");
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};
