const purchaseModel = require("../models/purchases.model");
const shopModel = require("../models/shops.model");
const dispatchModel = require("../models/dispatch.model");
const _ = require("lodash");
const crypto = require("crypto");
const request = require("request");
const itemModel = require("../models/items.model");
const vendorModel = require("../models/vendors.models");
const clientModel = require("../models/clients.model");

exports.createPurchase = async function (req, res) {
  const commission = 0.025;
  const delivery_commission = 0.2;
  const tx_ref = crypto.randomBytes(16).toString("hex");
  try {
    const [purchase] = await purchaseModel.find().sort({ created_at: -1 }).exec();
    const newPurchase = new purchaseModel({
      id: purchase ? purchase.id + 1 : 1,
      tx_ref: tx_ref,
      amount: req.body.quantity * req.body.price,
      currency: req.body.currency,
      item_id: req.body.item_id,
      item_quantity: req.body.quantity,
      item_name: req.body.name,
      purchase_role: req.user.role,
      shop_id: req.body.shop_id,
      vendor_id: req.body.vendor_id,
      user_id: req.user.id,
      user_role: req.user.role,
      vendor_amount: req.body.quantity * req.body.price * (1 - commission),
      jumga_commission: req.body.quantity * req.body.price * commission,
      delivery_amount: Number(req.body.delivery),
      delivery_commission: Number(req.body.delivery) * delivery_commission,
      dispatch_amount: Number(req.body.delivery) * (1 - delivery_commission),
      status: "pending",
      created_at: Date.now(),
    });
    await newPurchase.save();
    const options = {
      url: "https://api.flutterwave.com/v3/payments",
      method: "POST",
      body: {
        tx_ref: newPurchase.tx_ref,
        amount: newPurchase.amount,
        currency: newPurchase.currency,
        redirect_url: "http://localhost:3000/success",
        payment_options: "card",
        meta: {
          consumer_id: req.user.id,
        },
        customer: {
          email: req.user.username,
          phonenumber: req.user.phone_number,
          name: req.user.name,
        },
        customizations: {
          title: "Jumga E-commerce site",
          description: "One stop for all your needs",
        },
      },
      json: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.SECRET_KEY,
      },
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // res.redirect(body.data.link);
        res.send({status: "initialized", link: body.data.link})
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.confirmPurchase = async function (req) {
  try {
    await purchaseModel.updateOne(
      { tx_ref: req.query.tx_ref },
      { $set: { status: "verified" } }
    );
    const [purchase] = await purchaseModel
      .find({ tx_ref: req.query.tx_ref })
      .exec();
    await itemModel.updateOne(
      { id: purchase.item_id },
      { $inc: { quantity: -purchase.item_quantity } }
    );
    await shopModel.updateOne(
      { id: purchase.shop_id, items: { $elemMatch: { id: purchase.item_id } } },
      { $inc: { "items.$.quantity": -purchase.item_quantity } }
    );
    await shopModel.updateOne(
      { id: purchase.shop_id },
      { $inc: { revenue: purchase.vendor_amount } }
    );
    const model =
      purchase.purchase_role == "vendor"
        ? vendorModel
        : purchase.purchase_role == "client"
        ? clientModel
        : dispatchModel;
    await model.updateOne(
      { id: req.user.id },
      {
        $push: {
          bought_items: {
            ..._.pick(purchase, [
              "item_id",
              "item_name",
              "item_quantity",
              "shop_id",
              "tx_ref",
            ]),
          },
        },
      }
    );
    const [shop] = await shopModel.find({ id: purchase.shop_id }).exec();
    await dispatchModel.updateOne(
      { name: shop.dispatch_rider },
      { $inc: { revenue: purchase.dispatch_amount } }
    );
  } catch (error) {
    console.log(error);
  }
};
