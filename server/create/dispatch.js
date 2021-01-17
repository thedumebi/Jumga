const passport = require("passport");
const dispatchModel = require("../models/dispatch.model");
const bcrypt = require("bcrypt");
const { assignDispatch } = require("./assignDispatch");
const saltRounds = 10;

exports.createDispatch = async function (req, res) {
  try {
    const [dispatch] = await dispatchModel.find().sort({ created_at: -1 }).exec();
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newDispatch = new dispatchModel({
        id : dispatch ? dispatch.id + 1 : 1,
        username: req.body.username,
        password: hash,
        name: req.body.fname + " " + req.body.lname,
        phone_number: req.body.phone,
        role: req.body.role,
        created_at: Date.now()
      });
      newDispatch.save(function(err) {
        if (!err) {
          assignDispatch();
          passport.authenticate("dispatchLocal", {failureRedirect: "/register", failureMessage: true})(req, res, function() {
            // res.redirect("/dispatch");
            res.send({status: "success", user: req.user});
          });
        }
      });
    });
  } catch (error) {
      console.log(error);
  }
};
