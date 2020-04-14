const RequiredProductModel = require('./required-product.model');
const mongoose = require('mongoose');

const checkIfRequiredProductExisted = async (requiredProductID) => {
  const requiredProduct = await RequiredProductModel.findOne({ _id: mongoose.Types.ObjectId(requiredProductID) });
  return requiredProduct ? true : false;
}

module.exports = {
  checkIfRequiredProductExisted
}