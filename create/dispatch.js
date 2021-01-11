const passport = require("passport");
const dispatchModel = require("../models/dispatch.model");

exports.createDispatch = async function (req, res) {
  try {
    const [dispatch] = await dispatchModel.find().sort({ created_at: -1 }).exec();
    dispatchModel.register(
      { username: req.body.username },
      req.body.password,
      function (err, newDispatch) {
        if (err) {
          console.log(err);
        } else {
          newDispatch.id = dispatch ? dispatch.id + 1 : 1;
          newDispatch.name = req.body.name;
          newDispatch.phone_number = req.body.phone;
          newDispatch.created_at = Date.now();
          newDispatch.save();
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
