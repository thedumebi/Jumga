require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const crypto = require('crypto');
const { connectDB } = require("./database.utils");
const { createVendor } = require("./create/vendor");
const { createClient } = require("./create/clients");
const { createDispatch } = require("./create/dispatch");
const { loginVendor } = require("./login/vendors.login");
const { loginClient } = require("./login/clients.login");
const { loginDispatch } = require("./login/dispatch.login");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

connectDB();

app.get("/", function(req, res) {
  res.render("home");
});

app.route("/register")
.get(function(req, res) {
  res.render("register");
})
.post(function(req, res) {
  if (req.body.role == "vendor") {
    createVendor(req, res);
  } else if (req.body.role == "client") {
    createClient(req, res);
  } else if (req.body.role == "dispatch") {
    createDispatch(req, res);
  }
});

app.route("/login")
.get(function(req, res) {
  res.render("login");
})
.post(function(req, res) {
  if (req.body.role == "vendor") {
    loginVendor(req, res);
  } else if (req.body.role == "client") {
    loginClient(req, res);
  } else if (req.body.role == "dispatch") {
    loginDispatch(req, res);
  }
});

app.get("/account", function(req, res) {
  if (req.isAuthenticated()) {
    Vendor.findById(req.user.id, function(err, foundVendor) {
      if (err) {
        console.log(err);
      } else {
        if (foundVendor) {
          res.render("account", {vendor: foundVendor});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.route("/createshop")
.get(function(req, res) {
  if (req.isAuthenticated()) {
    res.render("createshop");
  } else {
    res.redirect("/login");
  }
})
.post(function(req, res) {
  if (req.isAuthenticated()) {
    const tx_ref = crypto.randomBytes(16).toString("hex");
    const options = {
      url: "https://api.flutterwave.com/v3/payments",
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.SECRET_KEY
      },
      // json: true,
      body: JSON.stringify({
        "tx_ref":tx_ref,
        "amount":"20",
        "currency":"NGN",
        "type": "ussd",
        "redirect_url":"https://localhost:3000/account",
        "payment_options":"card, ussd",
        "meta":{
          "consumer_id":req.user.id,
        },
        "customer":{
            "email":req.user.username,
            "phonenumber":req.user.phone,
            "name":req.user.name
        },
        "customizations":{
            "title":"Jumga",
            "description":"Pay to create a new shop",
        }
      })
    }
    request(options, function(error, response, body) {
      console.log("here");
      if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        console.log(info);
      }
    });
    // const shop = new Shop ({
    //   name: req.body.name,
    //   category: req.body.category
    // });
    // const shopId = shop._id;
    // Vendor.findById(req.user.id, function(err, foundVendor) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     if (foundVendor) {
    //       foundVendor.shops.push(shop);
    //       foundVendor.save(() => res.redirect("/account/" + shopId));
    //     }
    //   }
    // });
  } else {
    res.redirect("/login");
  }
});

app.get("/account/:shopId", function(req, res) {
  const shopId = req.params.shopId
  Vendor.findOne({"shops": {$elemMatch: {"_id": shopId}}}, function(err, foundVendor) {
    if (err) {
      console.log(err);
    } else {
      const shop = foundVendor.shops.filter((shop) => {
        return (shop._id == shopId);
      });
      res.render("shop", {shop: shop[0]});
    }
  });
});

app.route("/account/:shopId/additem")
.get(function(req, res) {
  const shopId = req.params.shopId;
  res.render("item", {shopId: shopId});
})
.post(function(req, res) {
  const shopId = req.params.shopId;
  const item = new Item ({
    name: req.body.name,
    price: req.body.price
  });
  Vendor.findOne({"shops": {$elemMatch: {"_id": shopId}}}, function(err, foundVendor) {
    if (err) {
      console.log(err);
    } else {
      const shop = foundVendor.shops.filter((shop) => {
        return (shop._id == shopId);
      });
      shop[0].items.push(item);
      foundVendor.save(() => res.redirect("/account/" + shopId));
    }
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.listen(port, function() {
  console.log("Server started successfully on " + port);
});
