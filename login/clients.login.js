const passport = require("passport");
const clientModel = require("../models/clients.model");

exports.loginClient = async function (req, res) {
  try {
    const newClient = new clientModel({
      username: req.body.username,
      password: req.body.password,
    });
    req.login(newClient, function (err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("clientLocal", { failureRedirect: "/login", failureMessage: true })(req, res,
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
