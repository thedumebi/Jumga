const purchaseModel = require("../models/purchases.model");
const shopModel = require("../models/shops.model");
const dispatchModel = require("../models/dispatch.model");
const _ = require("lodash");

exports.createPurchase = async function (req, res) {
  const commission = 0.025;
  const delivery_commission = 0.2;
  try {
    const purchase = await purchaseModel.find().sort({ created_at: -1 }).exec();
    const newPurchase = new purchaseModel({
      id: purchase ? purchase.id + 1 : 1,
      amount: req.body.amount,
      vendor_id: req.body.vendor_id,
      vendor_amount: req.body.amount * (1 - commission),
      commission: req.body.amount * commission,
      delivery_amount: req.body.delivery,
      delivery_commission: req.body.delivery * delivery_commission,
      dispatch_amount: req.body.delivery * (1 - delivery_commission),
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
