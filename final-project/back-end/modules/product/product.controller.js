const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const { MESSAGE, CONTROLLER_NAME } = require('./product.constant');
const { AddProductValidationSchema } = require('./validations/add-product.schema');
const CategoryModel = require('../category/category.model');
const SupplierModel = require('../supplier/supplier.model');
const ProductModel = require('./product.model');
const { CATEGORY_MESSAGE } = require('../category/category.constant');
const { SUPPLIER_MESSAGE } = require('../supplier/supplier.constant');
const mongoose = require('mongoose');

const addProduct = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::addProduct::was called`);
  try {
    const { error } = Joi.validate(req.body, AddProductValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const productInfo = req.body;
    const category = await CategoryModel.findOne({ _id: mongoose.Types.ObjectId(productInfo.categoryID) });
    if (!category) {
      logger.info(`${CONTROLLER_NAME}::addProduct::category not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        errors: [CATEGORY_MESSAGE.ERROR.CATEGORY_NOT_FOUND]
      });
    }
    const supplier = await SupplierModel.findOne({ _id: mongoose.Types.ObjectId(productInfo.supplierID) });
    if (!supplier) {
      logger.info(`${CONTROLLER_NAME}::addProduct::supplier not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        errors: [SUPPLIER_MESSAGE.ERROR.SUPPLIER_NOT_FOUND]
      });
    }

    const newProduct = new ProductModel(productInfo);
    await newProduct.save();

    category.products.push(newProduct._id);
    await category.save();

    supplier.products.push(newProduct._id);
    await supplier.save();

    logger.info(`${CONTROLLER_NAME}::addProduct::a new product was added`);
    return res.status(HttpStatus.OK).json({
      data: { product: newProduct },
      messages: [MESSAGE.SUCCESS.ADD_PRODUCT_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addProduct::error`);
    return next(error);
  }
}

module.exports = {
  addProduct
};