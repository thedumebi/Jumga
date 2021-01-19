const _ = require("lodash");
const itemModel = require("../models/items.model");
const vendorModel = require("../models/vendors.models");
const clientModel = require("../models/clients.model");
const dispatchModel = require("../models/dispatch.model");

exports.addFavorite = async function (req, res) {
  const itemId = req.params.itemId;
  itemModel.findOne({ id: itemId }, async function (err, foundItem) {
    if (!err) {
      const model = req.user.role === "vendor" ? vendorModel : req.user.role === "client" ? clientModel : dispatchModel;
      await model.updateOne({id: req.user.id}, {$push:{favorites: {..._.pick(foundItem, ["id", "name", "price", "image", "currency"])}}});
      res.send({status: "success"});
    }
  });
};
