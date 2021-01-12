const itemModel = require("../models/items.model");
const _ = require("lodash");
const shopModel = require("../models/shops.model");
const vendorModel = require("../models/vendors.models");

exports.createItem = async function(req, res) {
    try {
        const [item] = await itemModel.find().sort({created_at: -1}).exec();
        const newItem = new itemModel({
            id : item ? item.id + 1 : 1,
            name : req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            vendor_id: req.user.id,
            shop_id: req.body.shop_id,
            created_at: Date.now()
        });
        await newItem.save();
        await shopModel.updateOne({id: newItem.shop_id}, {$push: {items: {..._.pick(newItem, ["id", "name", "price", "quantity"])}}});
        await vendorModel.updateOne({id: newItem.vendor_id, shops: {$elemMatch: {id: newItem.shop_id}}}, {$push: {"shops.$.items": {..._.pick(newItem, ["id", "name", "price", "quantity"])}}});
        res.redirect(`/shops/${req.body.shop_id}`);
    } catch (error) {
        console.log(error);
    }
}