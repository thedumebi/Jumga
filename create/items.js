const itemModel = require("../models/items.model");
const _ = require("lodash");

exports.createItem = async function(req, res) {
    try {
        const [item] = await itemModel.find().sort({created_at: -1}).exec();
        const newItem = new itemModel({
            id : item ? item.id + 1 : 1,
            name : req.body.name,
            price: req.body.price,
            vendor_id: req.body.vendor_id,
            shop_id: req.body.shop_id,
            created_at: Date.now()
        });
        await newItem.save();
        res.send({..._.pick(newItem, ["id", "name", "price", "seller_id"])});
    } catch (error) {
        console.log(error);
    }
}