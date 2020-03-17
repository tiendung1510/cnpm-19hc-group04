const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    price: {
      type: Number,
      default: 0
    },
    availableQuantity: {
      type: Number,
      default: 0
    },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: 'Categories'
    }
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('ProductModel', productSchema, 'Products');
module.exports = ProductModel;
