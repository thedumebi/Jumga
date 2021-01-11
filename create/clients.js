const passport = require("passport");
const clientModel = require("../models/clients.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.createClient = async function(req, res) {
  try {
    const [client] = await clientModel.find().sort({ created_at: -1 }).exec();
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newClient = new clientModel({
        id : client ? client.id + 1 : 1,
        username: req.body.username,
        password: hash,
        name: req.body.name,
        phone_number: req.body.phone,
        role: req.body.role,
        created_at: Date.now()
      });
      newClient.save(function(err) {
        if (!err) {
          passport.authenticate("clientLocal", {failureRedirect: "/register", failureMessage: true})(req, res, function() {
            res.redirect("/account");
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}
