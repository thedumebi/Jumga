const purchaseModel = require("../models/purchases.model");
const shopModel = require("../models/shops.model");
const dispatchModel = require("../models/dispatch.model");
const _ = require("lodash");
const crypto = require("crypto");

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
      item_id: req.body.item_id,
      vendor_id: req.body.vendor_id,
      vendor_amount: (req.body.quantity * req.body.price) * (1 - commission),
      jumga_commission: (req.body.quantity * req.body.price) * commission,
      delivery_amount: Number(req.body.delivery),
      delivery_commission: Number(req.body.delivery) * delivery_commission,
      dispatch_amount: Number(req.body.delivery) * (1 - delivery_commission),
      created_at: Date.now(),
    });
    const createdPurchase = await newPurchase.save();
    const [shop] = await shopModel.find({id: req.body.vendor_id}).exec();
    await dispatchModel.updateOne({name: shop.dispatch_rider}, {$inc: {revenue: createdPurchase.dispatch_amount}});
    res.send({..._.pick(createdPurchase, ["id", "amount", "vendor_amount", "dispatch_amount"])});
  } catch (error) {
    console.log(error);
  }
};
