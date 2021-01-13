require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const { connectDB } = require("./database.utils");
const { createVendor } = require("./create/vendor");
const { createClient } = require("./create/clients");
const { createDispatch } = require("./create/dispatch");
const { loginVendor } = require("./login/vendors.login");
const { loginClient } = require("./login/clients.login");
const { loginDispatch } = require("./login/dispatch.login");
const { ensureOnlyVendor } = require("./models/control");
const vendorModel = require("./models/vendors.models");
const { makeShopPayment } = require("./create/shopPayment");
const shopModel = require("./models/shops.model");
const { createItem } = require("./create/items");
const itemModel = require("./models/items.model");
const { createPurchase } = require("./create/purchases");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

connectDB();

app.get("/", function (req, res) {
  res.render("home");
});

app.route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    if (req.body.role == "vendor") {
      createVendor(req, res);
    } else if (req.body.role == "client") {
      createClient(req, res);
    } else if (req.body.role == "dispatch") {
      createDispatch(req, res);
    }
  });

app.route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    if (req.body.role == "vendor") {
      loginVendor(req, res);
    } else if (req.body.role == "client") {
      loginClient(req, res);
    } else if (req.body.role == "dispatch") {
      loginDispatch(req, res);
    }
  });

app.get("/vendor", ensureOnlyVendor, function (req, res) {
  vendorModel.findById(req.user._id, function (err, foundVendor) {
    if (err) {
      console.log(err);
    } else {
      if (foundVendor) {
        res.render("vendor", { vendor: foundVendor });
      }
    }
  });
});

app.route("/createshop")
  .get(ensureOnlyVendor, function (req, res) {
    res.render("createshop");
  })
  .post(ensureOnlyVendor, function (req, res) {
    makeShopPayment(req, res);
  });
  
app.get("/shops", function(req, res) {
  shopModel.find(function(err, shops) {
    if (err) {
      console.log(err);
    } else {
      res.render("shops", {shops: shops});
    }
  });
});

app.get("/shops/:shopId", function (req, res) {
  const shopId = req.params.shopId;
  shopModel.findOne({id: shopId}, function(err, foundShop) {
    if (!err) {
      res.render("shop", {shop: foundShop, user: req.user});
    } else {
      res.send("shop does not exist");
    }
  });
});

app.route("/vendor/:shopId/additem")
  .get(ensureOnlyVendor, function (req, res) {
    const shopId = req.params.shopId;
    res.render("addItem", { shopId: shopId });
  })
  .post(ensureOnlyVendor, function (req, res) {
    createItem(req, res);
  });

app.get("/items", function(req, res) {
  itemModel.find(function(err, foundItems) {
    if (!err) {
      if (foundItems) {
        res.render("items", {items: foundItems})
      } else {
        alert("No items yet");
        res.redirect("/");
      }
    }
  });
});

app.get("/items/:itemId", function(req, res) {
  const itemId = req.params.itemId;
  itemModel.findOne({id: itemId}, function(err, foundItem) {
    if (!err) {
      res.render("item", {item: foundItem, user: req.user});
    }
  });
});

app.route("/items/:itemId/buy")
.get(function(req, res) {
  const itemId = req.params.itemId
  if (req.isAuthenticated()) {
    itemModel.findOne({id: itemId}, function(err, foundItem) {
      if (!err) {
        if (req.user.role == "vendor" && req.user.id == foundItem.vendor_id) {
          res.redirect("/shops");
        } else {
          res.render("buyItem", {item: foundItem, user: req.user});
        }
      }
    });
  } else {
    res.redirect("/login");
  }
})
.post(function(req, res) {
  const itemId = req.params.itemId
  if (req.isAuthenticated()) {
    if (req.body.quantity> req.body.available_quantity) {
      res.redirect(`/items/${itemId}/buy`)
    } else {
      createPurchase(req, res);
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully on " + port);
});
