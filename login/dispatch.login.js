const passport = require("passport");
const dispatchModel = require("../models/dispatch.model");

exports.loginDispatch = async function (req, res) {
  try {
    const newDispatch = new dispatchModel({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(newDispatch, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("dispatchLocal", { failureRedirect: "/login", failureMessage: true })(req,res,
          function () {
            res.redirect("/account");
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};
