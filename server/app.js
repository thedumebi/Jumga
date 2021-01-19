require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const { connectDB } = require("./database.utils");
const { createItem } = require("./controller/items");
const { createVendor } = require("./controller/vendor");
const { createClient } = require("./controller/clients");
const { loginVendor } = require("./login/vendors.login");
const { loginClient } = require("./login/clients.login");
const { addFavorite } = require("./controller/favorite");
const { loginDispatch } = require("./login/dispatch.login");
const { createDispatch } = require("./controller/dispatch");
const { removeFavorite } = require("./controller/unfavorite");
const { createNewShop, createShopPayment } = require("./controller/shopPay");
const { createPurchase, confirmPurchase } = require("./controller/purchases");
const { ensureOnlyVendor, ensureOnlyClient, ensureOnlyDispatch } = require("./controller/control");
const verifyTransaction = require("./controller/shopPayment");
const vendorModel = require("./models/vendors.models");
const shopModel = require("./models/shops.model");
const itemModel = require("./models/items.model");
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

app.post("/createshop", ensureOnlyVendor, function (req, res) {
    // makeShopPayment(req, res);
    createShopPayment(req, res);
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
      res.status(200).json({shop: foundShop});
    } else {
      res.send({status: "shop does not exist"});
    }
  });
});

app.post("/vendor/:shopId/additem", ensureOnlyVendor, upload.single("image"), function (req, res) {
    createItem(req, res);
  });

app.get("/items", function(req, res) {
  itemModel.find(function(err, foundItems) {
    if (!err) {
      if (foundItems) {
        res.status(200).json({items: foundItems});
      } else {
        res.send({status: "there are no items yet"});
      }
    }
  });
});

app.get("/items/:itemId", function(req, res) {
  const itemId = req.params.itemId;
  itemModel.findOne({id: itemId}, function(err, foundItem) {
    if (!err) {
      res.status(200).json({item: foundItem});
    }
  });
});

app.get("/items/:itemId/favorite", function(req, res) {
  if (req.isAuthenticated()) {
    addFavorite(req, res);
  }
});

app.get("/items/:itemId/unfavorite", async function(req, res) {
  if (req.isAuthenticated()) {
    removeFavorite(req, res);
  }
});

app.post("/items/:itemId/buy", function(req, res) {
  if (req.isAuthenticated()) {
    createPurchase(req, res);
  }
});

app.get("/success", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.query.status == "successful") {
      verifyTransaction.verifyTransaction(req.query.transaction_id, req, confirmPurchase);
    } 
  } else {
    res.send({status: "failed"});
  }
});

app.get("/shoppayment", function(req, res) {
  if (req.isAuthenticated()) {
    if (req.query.status == "successful") {
      verifyTransaction.verifyTransaction(req.query.transaction_id, req, createNewShop);
    } 
  } else {
    res.send({status: "failed"});
  }
});

app.get("/purchase/:purchaseId", function(req, res) {
  const purchaseId = req.params.purchaseId
  if (req.isAuthenticated()) {
    purchaseModel.findOne({tx_ref: purchaseId}, function(err, foundPurchase) {
      if (req.user.role == foundPurchase.purchase_role && req.user.id == foundPurchase.user_id) {
        res.status(200).json({purchase: foundPurchase});
      } else {
        res.status(200).json({status: "fail"})
      }
    });
  } else {
    res.status(200).json({status: "fail"})
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
  res.status(200).json({status: "success"});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}

app.listen(port, function () {
  console.log("Server started successfully on " + port);
});
