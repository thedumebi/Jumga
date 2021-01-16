const shopModel = require("../models/shops.model");
const _ = require("lodash");
const dispatchModel = require("../models/dispatch.model");

async function getAvailableDispatch() {
    const allDispatch = await dispatchModel.find().sort({modified_at: -1}).exec();
    const [latestDispatch] = await dispatchModel.find().sort({created_at: -1}).exec();
    let availableDispatch = {}
    for (const dispatch in allDispatch) {
      if (latestDispatch.shops.length >= allDispatch[dispatch].shops.length) {
        availableDispatch = allDispatch[dispatch]
      } else {
        availableDispatch = latestDispatch
      }
    }
    return availableDispatch
  }
  
  exports.assignDispatch = async () => {
    const shops = await shopModel.find().sort({created_at: -1}).exec();
    for (const shop in shops) {
      console.log(shops[shop]);
      var availableDispatch = await getAvailableDispatch()
      if (shops[shop].dispatch_rider == null) {
        await shopModel.updateOne({id: shops[shop].id}, {$set: {dispatch_rider: {..._.pick(availableDispatch, ["id", "name", "phone_number", "username"])}}})
      }
      await dispatchModel.updateOne({id: availableDispatch.id}, {$push : {shops: {..._.pick(shops[shop], ["id", "name", "email", "country"])}}})
      await dispatchModel.updateOne({id: availableDispatch.id}, {$set: {modified_at: Date.now()}})
    }
  }