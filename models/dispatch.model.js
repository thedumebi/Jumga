const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const dispatchSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: String,
  name: String,
  password: String,
  phone_number: String,
  revenue: Number,
  shops: Array,
  role: String,
  bought_items: Array,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const dispatchModel = mongoose.model("Dispatch", dispatchSchema);

passport.use("dispatchLocal", new localStrategy(function(username, password, done) {
  dispatchModel.findOne({username: username}, function(err, dispatch) {
    if (err) {return done(err);}
    if (!dispatch) {
      return done(null, false, {message: "Incorrect username!"});
    }
    bcrypt.compare(password, dispatch.password, function(err, result) {
      if (err) {console.log(err);}
      if (result == true) {
        return done(null, dispatch);
      } else {
        return done(null, false, {message: "Incorrect password!"});
      }
    });
  });
}));

// passport.serializeUser(function (dispatch, done) {
//   done(null, dispatch._id);
//   console.log("serialize", dispatch);
// });
// passport.deserializeUser(function (_id, done) {
//   dispatchModel.findById(_id, function (err, dispatch) {
//     done(err, dispatch);
//     console.log("deserialize", vendor);
//   });
// });

module.exports = dispatchModel;
