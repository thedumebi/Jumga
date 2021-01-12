const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const clientSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true
  },
  name: String,
  password: String,
  phone_number: String,
  role: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const clientModel = mongoose.model("Client", clientSchema);

passport.use("clientLocal", new localStrategy(function(username, password, done) {
  clientModel.findOne({username: username}, function(err, client) {
    if (err) {return done(err);}
    if (!client) {
      return done(null, false, {message: "Incorrect username!"});
    }
    bcrypt.compare(password, client.password, function(err, result) {
      if (err) {console.log(err);}
      if (result == true) {
        return done(null, client);
      } else {
        return done(null, false, {message: "Incorrect password!"});
      }
    });
  });
}));

// passport.serializeUser(function (client, done) {
//   done(null, client._id);
// });
// passport.deserializeUser(function (_id, done) {
//   clientModel.findById(_id, function (err, client) {
//     done(err, client);
//   });
// });


module.exports = clientModel;