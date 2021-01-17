require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const { connectDB } = require("./database.utils");
const { createVendor } = require("./create/vendor");
const { createClient } = require("./create/clients");
const { createDispatch } = require("./create/dispatch");
const { loginVendor } = require("./login/vendors.login");
const { loginClient } = require("./login/clients.login");
const { loginDispatch } = require("./login/dispatch.login");
const { ensureOnlyVendor, ensureOnlyClient, ensureOnlyDispatch } = require("./models/control");
const vendorModel = require("./models/vendors.models");
const { makeShopPayment } = require("./create/shopPayment");
const shopModel = require("./models/shops.model");
const { createItem } = require("./create/items");
const itemModel = require("./models/items.model");
const { createPurchase, confirmPurchase } = require("./create/purchases");
const verifyTransaction = require("./create/shopPayment");
const clientModel = require("./models/clients.model");
const dispatchModel = require("./models/dispatch.model");
const purchaseModel = require("./models/purchases.model");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  credentials: true
}));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/uploads/images")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname)
  }
});
const upload = multer({
  storage: storage,
  onFileUploadStart: function(file) {
    console.log("upload side", file.originalname + "is starting...")
  }
});

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
        res.render("user", { user: foundVendor });
      }
    }
  });
});

app.get("/client", ensureOnlyClient, function (req, res) {
  clientModel.findById(req.user._id, function (err, foundClient) {
    if (err) {
      console.log(err);
    } else {
      if (foundClient) {
        res.render("user", { user: foundClient });
      }
    }
  });
});

app.get("/dispatch", ensureOnlyDispatch, function (req, res) {
  dispatchModel.findById(req.user._id, function (err, foundDispatch) {
    if (err) {
      console.log(err);
    } else {
      if (foundDispatch) {
        res.render("user", { user: foundDispatch });
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
      res.status(200).json({shops: shops});
    }
  });
});

app.get("/shops/:shopId", function (req, res) {
  const shopId = req.params.shopId;
  shopModel.find({id: shopId}, function(err, foundShop) {
    if (!err) {
      // res.render("shop", {shop: foundShop, user: req.user});
      res.status(200).json({shop: foundShop});
    } else {
      res.send("shop does not exist");
    }
  });
});

app.route("/vendor/:shopId/additem")
  .get(ensureOnlyVendor, function (req, res) {
    const shopId = req.params.shopId;
    shopModel.findOne({id: shopId}, function(err, foundShop) {
      if (!err) {
        res.render("addItem", { shop: foundShop });
      }
    });
  })
  .post(ensureOnlyVendor, upload.single("image"), function (req, res) {
    createItem(req, res);
  });

app.get("/items", function(req, res) {
  itemModel.find(function(err, foundItems) {
    if (!err) {
      if (foundItems) {
        // res.render("items", {items: foundItems})
        res.status(200).json({items: foundItems});
      } else {
        res.redirect("/");
      }
    }
  });
});

app.get("/items/:itemId", function(req, res) {
  const itemId = req.params.itemId;
  itemModel.findOne({id: itemId}, function(err, foundItem) {
    if (!err) {
      // res.render("item", {item: foundItem, user: req.user});
      res.status(200).json({item: foundItem});
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
    createPurchase(req, res);
  } else {
    res.redirect("/login");
  }
});

app.get("/success", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.query.status == "successful") {
      verifyTransaction.verifyTransaction(req.query.transaction_id, req, confirmPurchase);
      res.render("success");
    } 
  } else {
    res.redirect("/");
  }
});

app.get("/purchase/:purchaseId", function(req, res) {
  const purchaseId = req.params.purchaseId
  if (req.isAuthenticated()) {
    purchaseModel.findOne({tx_ref: purchaseId}, function(err, foundPurchase) {
      if (req.user.role == foundPurchase.purchase_role && req.user.id == foundPurchase.user_id) {
        // res.render("purchase", {purchase: foundPurchase});
        res.status(200).json({purchase: foundPurchase});
      } else {
        // res.redirect("/login");
        res.status(200).json({status: "fail"})
      }
    });
  } else {
    console.log(res.statusCode);
    res.status(200).json({status: "fail"})
    // res.redirect("/login");
  }
});

app.get("/checkAuthentication", function(req, res) {
  const authenticated= Boolean(req.user !== "undefined");
  if (req.isAuthenticated()) {
    const user = req.user
    res.status(200).json({user: user, authenticated});
  } else {
    res.send({});
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  // res.redirect("/");
  res.status(200).json({status: "success"});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}

app.listen(port, function () {
  console.log("Server started successfully on " + port);
});
