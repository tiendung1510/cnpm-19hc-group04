const mongoose = require('mongoose');
const { Schema } = mongoose;

const productActionLogSchema = new Schema(
  {
    executor: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'ProductModel'
    },
    actionType: {
      type: String,
      required: true
    },
    fields: [{ type: Object }]
  },
  { timestamps: true }
);

const ProductActionLogModel = mongoose.model('ProductActionLogModel', productActionLogSchema, 'ProductActionLogs');
module.exports = ProductActionLogModel;