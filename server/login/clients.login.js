const passport = require("passport");
const clientModel = require("../models/clients.model");

exports.loginClient = async function (req, res) {
  try {
    passport.authenticate("clientLocal", function(err, client, info) {
      if (err) {console.log(err);}
      if (!client) {
        return res.send({status: "failed", message: info.message})
      }
      req.login(client, function(err) {
        if (err) {console.log(err);}
        return res.send({status: "success", user: req.user})
      });
    })(req, res);
  } catch (error) {
    console.log(error);
  }
};
