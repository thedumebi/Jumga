const passport = require("passport");
const vendorModel = require("../models/vendors.models");

exports.createVendor = async function (req, res) {
  try {
    const [vendor] = await vendorModel.find().sort({ created_at: -1 }).exec();
    vendorModel.register(
      { username: req.body.username },
      req.body.password,
      function (err, newVendor) {
        if (err) {
          console.log(err);
        } else {
          newVendor.id = vendor ? vendor.id + 1 : 1;
          newVendor.name = req.body.name;
          newVendor.phone_number = req.body.phone_number;
          newVendor.created_at = Date.now();
          newVendor.save();
          passport.authenticate("local", { failureRedirect: "/register" })(req, res, function() { 
            res.redirect("/account");
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
