const _ = require("lodash");
const itemModel = require("../models/items.model");
const vendorModel = require("../models/vendors.models");
const clientModel = require("../models/clients.model");
const dispatchModel = require("../models/dispatch.model");

exports.removeFavorite = async function (req, res) {
    const itemId = req.params.itemId;
    const model = req.user.role === "vendor" ? vendorModel : req.user.role === "client" ? clientModel : dispatchModel;
    const userId = req.user.id
    await model.updateOne({id: Number(userId)}, {$pull: {favorites: {id: Number(itemId)}}}, {new: true, multi: true});
    res.send({status: "success"});
  }