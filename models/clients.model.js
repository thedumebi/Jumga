const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const clientSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  username: String,
  name: String,
  password: String,
  phone_number: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

clientSchema.plugin(passportLocalMongoose);

const clientModel = mongoose.model("Client", clientSchema);

passport.use(clientModel.createStrategy());
passport.serializeUser(function (client, done) {
  done(null, client.id);
});
passport.deserializeUser(function (id, done) {
  clientModel.findById(id, function (err, client) {
    done(err, client);
  });
});


module.exports = clientModel;