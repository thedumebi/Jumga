const passport = require("passport");
const clientModel = require("../models/clients.model");

exports.createClient = async function(req, res) {
  try {
    const [client] = await clientModel.find().sort({ created_at: -1 }).exec();
    clientModel.register(
      { username: req.body.username },
      req.body.password,
      function (err, newClient) {
        if (err) {
          console.log(err);
        } else {
          newClient.id = client ? client.id + 1 : 1;
          newClient.name = req.body.name;
          newClient.phone_number = req.body.phone;
          newClient.created_at = Date.now();
          newClient.save();
          passport.authenticate("local", { failureRedirect: "/register" })(req, res, function() { 
            res.redirect("/account");
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
