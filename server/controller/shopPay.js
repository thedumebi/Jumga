const _ = require("lodash");
const crypto = require("crypto");
const shopPaymentModel = require("../models/shopPayment.model");
const request = require("request");
const { createShop } = require("./shops");

exports.createShopPayment = async function (req, res) {
  const shopFee = 20;
  const tx_ref = crypto.randomBytes(16).toString("hex");
  try {
    const [shop] = await shopPaymentModel
      .find()
      .sort({ created_at: -1 })
      .exec();
    const newShop = new shopPaymentModel({
      id: shop ? shop.id + 1 : 1,
      tx_ref: tx_ref,
      amount: shopFee,
      currency: "USD",
      name: req.body.name,
      email: req.body.email,
      country: req.body.country,
      bank: req.body.bank,
      account_number: req.body.account_number,
      vendor_id: req.user.id,
      status: "pending",
      created_at: Date.now(),
    });
    await newShop.save();
    const options = {
      url: "https://api.flutterwave.com/v3/payments",
      method: "POST",
      body: {
        tx_ref: newShop.tx_ref,
        amount: newShop.amount,
        currency: newShop.currency,
        redirect_url: "http://localhost:3000/shoppayment",
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
    request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send({status: "initialized", link: body.data.link})
        }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createNewShop = async function(req) {
    try {
        await shopPaymentModel.updateOne({tx_ref: req.query.tx_ref}, {$set: {status: "verified"}});
        const [shop] = await shopPaymentModel.find({tx_ref: req.query.tx_ref}).exec();
        createShop(shop);
    } catch (error) {
        console.log(error);
    }
}