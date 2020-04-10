const mongoose = require('mongoose');
const { Schema } = mongoose;

const requiredProductSchema = new Schema(
  {
    importingRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ImportingRequestModel'
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'ProductModel'
    },
    requiredQuantity: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

const RequiredProductModel = mongoose.model('RequiredProductModel', requiredProductSchema, 'RequiredProducts');
module.exports = RequiredProductModel;