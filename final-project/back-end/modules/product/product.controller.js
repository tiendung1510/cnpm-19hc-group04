const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const mongoose = require('mongoose');
const { PRODUCT_MESSAGE, CONTROLLER_NAME } = require('./product.constant');
const { AddProductValidationSchema } = require('./validations/add-product.schema');
const { UpdateProductValidationSchema } = require('./validations/update-product.schema');
const CategoryModel = require('../category/category.model');
const SupplierModel = require('../supplier/supplier.model');
const ProductModel = require('./product.model');
const { CATEGORY_MESSAGE } = require('../category/category.constant');
const { SUPPLIER_MESSAGE } = require('../supplier/supplier.constant');
const ImporterAssignmentModel = require('../importer-assignment/importer-assignment.model');
const ImportedProductModel = require('../imported-product/imported-product.model');
const ProductActionLogModel = require('../product-action-log/product-action-log.model');
const ImportingRequestModel = require('../importing-request/importing-request.model');
const CheckoutSessionModel = require('../checkout-session/checkout-session.model');
const UserModel = require('../user/user.model');
const SoldItemModel = require('../sold-item/sold-item.model');
const { BASIC_SALARY } = require('../user/user.constant');
const { PRODUCT_ACTION_TYPE } = require('../product-action-log/product-action-log.constant');
const { STATUS } = require('../importing-request/importing-request.constant');
const moment = require('moment');

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
        status: HttpStatus.NOT_FOUND,
        errors: [CATEGORY_MESSAGE.ERROR.CATEGORY_NOT_FOUND]
      });
    }

    const supplier = await SupplierModel.findOne({ _id: mongoose.Types.ObjectId(productInfo.supplierID) });
    if (!supplier) {
      logger.info(`${CONTROLLER_NAME}::addProduct::supplier not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [SUPPLIER_MESSAGE.ERROR.SUPPLIER_NOT_FOUND]
      });
    }

    const duplicatedProduct = await ProductModel.findOne({ name: productInfo.name });
    if (duplicatedProduct) {
      logger.info(`${CONTROLLER_NAME}::addProduct::duplicated name`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [PRODUCT_MESSAGE.ERROR.DUPLICATED_PRODUCT]
      });
    }

    if (productInfo.availableQuantity && productInfo.availableQuantity < 0) {
      logger.info(`${CONTROLLER_NAME}::addProduct::invalid available quantity`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [PRODUCT_MESSAGE.ERROR.INVALID_PRODUCT_AVAILABLE_QUANTITY]
      });
    }

    if (productInfo.price && productInfo.price < 0) {
      logger.info(`${CONTROLLER_NAME}::addProduct::invalid price`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [PRODUCT_MESSAGE.ERROR.INVALID_PRODUCT_PRICE]
      });
    }

    productInfo.category = productInfo.categoryID;
    productInfo.supplier = productInfo.supplierID;
    delete productInfo.categoryID;
    delete productInfo.supplierID;

    let newProduct = new ProductModel(productInfo);
    await newProduct.save();

    category.products.push(newProduct._id);
    await category.save();

    supplier.products.push(newProduct._id);
    await supplier.save();

    newProduct = await ProductModel.findOne({ _id: newProduct._id })
      .populate('category', '-products')
      .populate('supplier', '-products');

    const productActionLog = new ProductActionLogModel({
      executor: req.fromUser._id,
      product: newProduct._id,
      actionType: PRODUCT_ACTION_TYPE.ADD.type
    });
    await productActionLog.save();

    logger.info(`${CONTROLLER_NAME}::addProduct::a new product was added`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { product: newProduct },
      messages: [PRODUCT_MESSAGE.SUCCESS.ADD_PRODUCT_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addProduct::error`);
    return next(error);
  }
}

const updateProduct = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::updateProduct::was called`);
  try {
    const { error } = Joi.validate(req.body, UpdateProductValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const productInfo = req.body;
    if (productInfo.availableQuantity && productInfo.availableQuantity < 0) {
      logger.info(`${CONTROLLER_NAME}::updateProduct::invalid available quantity`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [PRODUCT_MESSAGE.ERROR.INVALID_PRODUCT_AVAILABLE_QUANTITY]
      });
    }

    if (productInfo.price && productInfo.price < 0) {
      logger.info(`${CONTROLLER_NAME}::updateProduct::invalid price`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [PRODUCT_MESSAGE.ERROR.INVALID_PRODUCT_PRICE]
      });
    }

    const { productID } = req.params;
    let product = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(productID) });
    if (!product) {
      logger.info(`${CONTROLLER_NAME}::updateProduct::product not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [PRODUCT_MESSAGE.ERROR.PRODUCT_NOT_FOUND]
      });
    }

    if (productInfo.supplier) {
      const supplier = await SupplierModel.findOne({ _id: mongoose.Types.ObjectId(productInfo.supplier) });
      if (!supplier) {
        logger.info(`${CONTROLLER_NAME}::updateProduct::supplier not found`);
        return res.status(HttpStatus.NOT_FOUND).json({
          status: HttpStatus.NOT_FOUND,
          errors: [SUPPLIER_MESSAGE.ERROR.SUPPLIER_NOT_FOUND]
        });
      }
    }

    //Check available quantity if product is required to be imported
    let isImporterAssignmentUpdated = false;
    if (productInfo.availableQuantity) {
      if (productInfo.availableQuantity < 0) {
        logger.info(`${CONTROLLER_NAME}::updateProduct::invalid available quantity`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          errors: [PRODUCT_MESSAGE.ERROR.INVALID_PRODUCT_AVAILABLE_QUANTITY]
        });
      }

      //In case of product is imported more
      if (productInfo.availableQuantity > product.availableQuantity) {
        const importerAssignments = await ImporterAssignmentModel
          .find({
            importer: req.fromUser._id,
            finishedAt: null
          }).populate('importedProducts');

        if (importerAssignments.length === 0) {
          logger.info(`${CONTROLLER_NAME}::updateProduct::product is not required to be imported 1`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            errors: [PRODUCT_MESSAGE.ERROR.UPDATE_AVAILABLE_QUANTITY_DENIED]
          });
        }

        let importerAssignment = importerAssignments[0];
        let importedProduct = importerAssignment.importedProducts.find(item => item.product.toString() === product._id.toString());
        if (!importedProduct) {
          logger.info(`${CONTROLLER_NAME}::updateProduct::product is not required to be imported 2`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            errors: [PRODUCT_MESSAGE.ERROR.UPDATE_AVAILABLE_QUANTITY_DENIED]
          });
        }

        const importedQuantity = productInfo.availableQuantity - product.availableQuantity;
        if (importedQuantity > importedProduct.requiredQuantity) {
          logger.info(`${CONTROLLER_NAME}::updateProduct::imported quantity exceeds required quantity`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            errors: [PRODUCT_MESSAGE.ERROR.REQUIRED_QUANTITY_EXCEEDED]
          });
        }

        importedProduct = await ImportedProductModel.findOne({ _id: importedProduct._id });
        if (importedProduct.importedQuantity === importedProduct.requiredQuantity && importedProduct.requiredQuantity >= 1) {
          logger.info(`${CONTROLLER_NAME}::updateProduct::product is not required to be imported 2`);
          return res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            errors: [PRODUCT_MESSAGE.ERROR.UPDATE_AVAILABLE_QUANTITY_DENIED]
          });
        }

        importedProduct.importedQuantity = importedQuantity;
        await importedProduct.save();

        //Check if importer assignment is finished
        importerAssignment = await ImporterAssignmentModel
          .findOne({ _id: importerAssignment._id })
          .populate('importedProducts');

        let flag = true;
        for (const item of importerAssignment.importedProducts) {
          if (item.importedQuantity < item.requiredQuantity) {
            flag = false;
            break;
          }
        }

        if (flag) {
          importerAssignment.finishedAt = new Date();
          await importerAssignment.save();
          await Promise.all(
            importerAssignment.importingRequests.map(async (r) => {
              const request = await ImportingRequestModel.findOne({ _id: r._id });
              request.status = STATUS.FINISHED.type;
              request.finishedAt = new Date();
              await request.save();
              return request;
            })
          );
        }

        // Notice product's available was updated for reloading importer assignemnt from client
        isImporterAssignmentUpdated = true;
      }
    }

    let updatedFields = [];
    for (const key in productInfo) {
      product[key] = productInfo[key];
      updatedFields.push({
        name: key,
        oldValue: product[key],
        newValue: productInfo[key]
      });
    }
    await product.save();

    product = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(productID) })
      .populate('supplier', '-products')
      .populate('category', '-products');

    const productActionLog = new ProductActionLogModel({
      executor: req.fromUser._id,
      product: product._id,
      actionType: PRODUCT_ACTION_TYPE.UPDATE.type,
      fields: updatedFields
    });
    await productActionLog.save();

    logger.info(`${CONTROLLER_NAME}::updateProduct::a product was updated`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { product, isImporterAssignmentUpdated },
      messages: [PRODUCT_MESSAGE.SUCCESS.UPDATE_PRODUCT_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::updateProduct::error`);
    return next(error);
  }
}

const getProducts = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getProducts::was called`);
  try {
    let { page, limit, statisticStartDate, statisticEndDate } = req.query;
    if (!(page && limit && statisticStartDate && statisticEndDate)) {
      const products = await ProductModel.find({})
        .populate('category', '-products')
        .populate('supplier', '-products');
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: { products },
        messages: [PRODUCT_MESSAGE.SUCCESS.GET_PRODUCTS_SUCCESS]
      });
    }

    let result = {};
    page = Number(page);
    limit = Number(limit);
    statisticStartDate = Number(statisticStartDate);
    statisticEndDate = Number(statisticEndDate);
    const month = new Date(statisticStartDate).getMonth() + 1;
    const year = new Date(statisticStartDate).getFullYear();
    const daysInMonth = moment(`${month}/${year}`, 'MM/YYYY').daysInMonth();
    const createdAtCond = {
      createdAt: {
        $gte: new Date(statisticStartDate),
        $lte: new Date(statisticEndDate)
      }
    }

    // get paginated list of products and count the total number of products
    queryResults = await ProductModel.aggregate([
      {
        $facet: {
          products: [
            { $lookup: { from: 'Suppliers', localField: 'supplier', foreignField: '_id', as: 'supplier' } },
            { $unwind: '$supplier' },
            { $lookup: { from: 'Categories', localField: 'category', foreignField: '_id', as: 'category' } },
            { $unwind: '$category' },
            { $project: { 'supplier.products': 0, 'category.products': 0 } },
            { $skip: limit * (page - 1) },
            { $limit: limit }
          ],
          entries: [
            { $group: { _id: null, productTotal: { $sum: 1 } } },
            { $project: { _id: 0, productTotal: 1 } }
          ]
        }
      }
    ]);
    result = {
      products: queryResults[0].products,
      productTotal: queryResults[0].entries[0].productTotal
    }

    // Calculate product's sold quantity total, find a list of best-selling products
    const soldProducts = await CheckoutSessionModel.aggregate([
      { $lookup: { from: 'SoldItems', localField: 'soldItems', foreignField: '_id', as: 'soldItem' } },
      { $unwind: '$soldItem' },
      { $match: createdAtCond },
      { $group: { _id: '$soldItem.product', quantity: { $sum: '$soldItem.quantity' } } },
      { $sort: { quantity: -1 } },
      { $lookup: { from: 'Products', localField: '_id', foreignField: '_id', as: 'details' } },
      { $unwind: '$details' }
    ]);
    result.soldQuantityTotal = soldProducts.reduce((acc, cur) => acc + cur.quantity, 0);
    result.bestSellingProducts = [...soldProducts].filter(p => p.quantity > 0).slice(0, 11);
    result.soldProducts = [...soldProducts];

    // statistic daily sold quantity in month
    const sellingDates = await CheckoutSessionModel.aggregate([
      { $lookup: { from: 'SoldItems', localField: 'soldItems', foreignField: '_id', as: 'soldItem' } },
      { $unwind: '$soldItem' },
      { $match: createdAtCond },
      { $group: { _id: '$submittedAt', quantity: { $sum: '$soldItem.quantity' } } },
      { $project: { _id: 0, submittedAt: '$_id', quantity: 1 } }
    ]);
    let soldQuantityStatisticData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${day}/${month}/${year}`, 'DD/MM/YYYY');
      soldQuantityStatisticData.push({
        date,
        quantity: sellingDates.reduce((acc, cur) => moment(cur.submittedAt).format('DD/MM/YYYY') === date.format('DD/MM/YYYY') ? (acc + cur.quantity) : acc, 0)
      });
    }
    result.soldQuantityStatisticData = [...soldQuantityStatisticData];

    // Calculate revenue total and statistic daily revenue total in month
    result.revenueTotal = soldProducts.reduce((acc, cur) => acc + cur.quantity * cur.details.price, 0);
    const checkoutSessions = await CheckoutSessionModel.aggregate([
      {
        $match: {
          submittedAt: {
            $gte: new Date(statisticStartDate),
            $lte: new Date(statisticEndDate)
          }
        }
      },
      {
        $group: {
          _id: '$submittedAt',
          priceTotal: { $sum: '$priceTotal' }
        }
      },
      {
        $project: {
          _id: 0,
          submittedAt: '$_id',
          priceTotal: 1
        }
      }
    ]);

    let revenueStatisticData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${day}/${month}/${year}`, 'DD/MM/YYYY');
      revenueStatisticData.push({
        date,
        revenue: checkoutSessions.reduce((acc, cur) => moment(cur.submittedAt).format('DD/MM/YYYY') === date.format('DD/MM/YYYY') ? (acc + cur.priceTotal) : acc, 0)
      });
    }
    result.revenueStatisticData = [...revenueStatisticData];

    // Calculate product's imported quantity total, required quantity total, importing cost total & required importing cost total
    const importedProducts = await ImportedProductModel.aggregate([
      { $lookup: { from: 'Products', localField: 'product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $match: createdAtCond },
      {
        $group: {
          _id: '$product._id',
          importedQuantity: { $sum: '$importedQuantity' },
          requiredQuantity: { $sum: '$requiredQuantity' }
        }
      },
      { $sort: { importedQuantity: -1 } },
      { $lookup: { from: 'Products', localField: '_id', foreignField: '_id', as: 'details' } },
      { $unwind: '$details' }
    ]);
    result.importedQuantityTotal = importedProducts.reduce((acc, cur) => acc + cur.importedQuantity, 0);
    result.requiredQuantityTotal = importedProducts.reduce((acc, cur) => acc + cur.requiredQuantity, 0);
    result.importingCostTotal = importedProducts.reduce((acc, cur) => acc + cur.importedQuantity * cur.details.price, 0);
    result.requiredImportingCostTotal = importedProducts.reduce((acc, cur) => acc + cur.requiredQuantity * cur.details.price, 0);
    result.importedProducts = importedProducts;

    // Find new product total
    const productActionLogs = await ProductActionLogModel.aggregate([
      {
        $match: {
          ...createdAtCond,
          actionType: PRODUCT_ACTION_TYPE.ADD.type
        }
      }
    ]);
    result.newProductTotal = productActionLogs.length;

    // Calculate payment total
    const salaryTotalResults = await UserModel.aggregate([
      { $group: { _id: null, salaryTotal: { $sum: { $multiply: ['$salaryRate', BASIC_SALARY] } } } },
      { $unwind: '$salaryTotal' }
    ]);
    result.paymentTotal = salaryTotalResults[0].salaryTotal + result.importingCostTotal;
    result.salaryTotal = salaryTotalResults[0].salaryTotal;

    result.products = result.products
      .map(item => {
        let _item = JSON.parse(JSON.stringify(item));
        const soldProduct = soldProducts.find(p => p.details._id.toString() === _item._id.toString());
        const importedProduct = importedProducts.find(p => p.details._id.toString() === _item._id.toString());
        _item.soldQuantity = soldProduct ? soldProduct.quantity : 0;
        _item.importedQuantity = importedProduct ? importedProduct.importedQuantity : 0;
        _item.requiredQuantity = importedProduct ? importedProduct.requiredQuantity : 0;
        return _item;
      })
      .sort((a, b) => b.soldQuantity - a.soldQuantity);

    logger.info(`${CONTROLLER_NAME}::getProducts::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { ...result },
      messages: [PRODUCT_MESSAGE.SUCCESS.GET_PRODUCTS_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getProducts::error`);
    return next(error);
  }
}

const removeProduct = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::removeProduct::was called`);
  try {
    const { productID } = req.params;
    let product = await ProductModel.findOne({ _id: mongoose.Types.ObjectId(productID) });
    if (!product) {
      logger.info(`${CONTROLLER_NAME}::removeProduct::product not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [PRODUCT_MESSAGE.ERROR.PRODUCT_NOT_FOUND]
      });
    }

    let supplier = await SupplierModel.findOne({ _id: product.supplier });
    supplier.products = supplier.products.filter(p => p._id !== product._id);
    await supplier.save();

    let category = await CategoryModel.findOne({ _id: product.category });
    category.products = category.products.filter(p => p._id !== product._id);
    await category.save();

    await ProductModel.deleteOne({ _id: product._id });

    const productActionLog = new ProductActionLogModel({
      executor: req.fromUser._id,
      product: product._id,
      actionType: PRODUCT_ACTION_TYPE.REMOVE.type
    });
    await productActionLog.save();

    logger.info(`${CONTROLLER_NAME}::removeProduct::a product was removed`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {},
      messages: [PRODUCT_MESSAGE.SUCCESS.REMOVE_PRODUCTS_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::removeProduct::error`);
    return next(error);
  }
}

module.exports = {
  addProduct,
  updateProduct,
  getProducts,
  removeProduct
};