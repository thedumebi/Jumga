const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const dispatchSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: false,
    unique: true,
  },
  username: String,
  name: String,
  password: String,
  phone_number: String,
  revenue: Number,
  shops: Array,
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

dispatchSchema.plugin(passportLocalMongoose);

const dispatchModel = mongoose.model("Dispatch", dispatchSchema);

passport.use(dispatchModel.createStrategy());
passport.serializeUser(function (dispatch, done) {
  done(null, dispatch.id);
});
passport.deserializeUser(function (id, done) {
  dispatchModel.findById(id, function (err, dispatch) {
    done(err, dispatch);
  });
});

module.exports = dispatchModel;
