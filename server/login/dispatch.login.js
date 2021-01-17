const passport = require("passport");
const dispatchModel = require("../models/dispatch.model");

exports.loginDispatch = async function (req, res) {
  try {
    passport.authenticate("dispatchLocal", function(err, dispatch, info) {
      if (err) {console.log(err);}
      if (!dispatch) {
        return res.send({status: "failed", message: info.message})
      }
      req.login(dispatch, function(err) {
        if (err) {console.log(err);}
        return res.send({status: "success", user: req.user})
      });
    })(req, res);
  } catch (error) {
    console.log(error);
  }
};
