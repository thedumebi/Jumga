const shopModel = require("../models/shops.model");
const _ = require("lodash");
const vendorModel = require("../models/vendors.models");

exports.createShop = async function(req, res) {
    try {
        const [shop] = await shopModel.find().sort({created_at: -1}).exec();
        const newShop = new shopModel({
            id: shop ? shop.id + 1 : 1,
            name: req.body.name,
            email: req.body.email,
            country: req.body.country,
            bank: req.body.bank,
            account_number: req.body.account_number,
            vendor_id: req.user.id,
            created_at: Date.now()
        });
        await newShop.save();
        await vendorModel.updateOne({id: req.user.id}, {$push: {shops: {..._.pick(newShop, ["id", "name", "country"])}}});
        res.redirect("/vendor");
    } catch (error) {
        console.log(error);
    }
}