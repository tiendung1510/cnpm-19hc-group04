const mongoose = require('mongoose');
const { Schema } = mongoose;

const importedProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'ProductModel'
    },
    requiredQuantity: {
      type: Number,
      default: 1
    },
    importedQuantity: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const ImportedProductModel = mongoose.model('ImportedProductModel', importedProductSchema, 'ImportedProducts');
module.exports = ImportedProductModel;

