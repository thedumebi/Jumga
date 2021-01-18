const shopModel = require("../models/shops.model");
const _ = require("lodash");
const vendorModel = require("../models/vendors.models");
const { assignDispatch } = require("./assignDispatch");

exports.createShop = async function(req) {
    try {
        const [shop] = await shopModel.find().sort({created_at: -1}).exec();
        const newShop = new shopModel({
            id: shop ? shop.id + 1 : 1,
            name: req.name,
            email: req.email,
            country: req.country,
            bank: req.bank,
            account_number: req.account_number,
            vendor_id: req.vendor_id,
            created_at: Date.now()
        });
        await newShop.save(function(err) {
            if (!err) {
                assignDispatch();
            }
        });
        await vendorModel.updateOne({id: newShop.vendor_id}, {$push: {shops: {..._.pick(newShop, ["id", "name", "country"])}}});
    } catch (error) {
        console.log(error);
    }
}