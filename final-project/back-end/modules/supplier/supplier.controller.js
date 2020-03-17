const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const { CONTROLLER_NAME, SUPPLIER_MESSAGE } = require('./supplier.constant');
const { USER_ROLE, USER_MESSAGE } = require('../user/user.constant');
const { checkUserPermisson } = require('../user/user.service');
const { AddSupplierValidationSchema } = require('./validations/add-supplier.schema');
const SupplierModel = require('./supplier.model');

const addSupplier = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::addSupplier::was called`);
  try {
    const { error } = Joi.validate(req.body, AddSupplierValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { fromUser } = req;
    const isImporter = await checkUserPermisson(fromUser._id, USER_ROLE.IMPORTER.type);
    if (!isImporter) {
      logger.info(`${CONTROLLER_NAME}::addSupplier::permission denied`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.UNAUTHORIZED,
        errors: [USER_MESSAGE.ERROR.PERMISSION_DENIED]
      });
    }

    const supplierInfo = req.body;
    const duplicatedSupplier = await SupplierModel.findOne({ name: supplierInfo.name });
    if (duplicatedSupplier) {
      logger.info(`${CONTROLLER_NAME}::addSupplier::duplicated name`)
      return res.status(HttpStatus.BAD_REQUEST).json({
        errors: [SUPPLIER_MESSAGE.ERROR.DUPLICATED_SUPPLIER]
      })
    }

    const newSupplier = new SupplierModel(supplierInfo);
    await newSupplier.save();

    logger.info(`${CONTROLLER_NAME}::addSupplier::a new supplier was added`);
    return res.status(HttpStatus.OK).json({
      data: { supplier: newSupplier },
      messages: [SUPPLIER_MESSAGE.SUCCESS.ADD_SUPPLIER_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addSupplier::error`);
    return next(error);
  }
}

const getSuppliers = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getSuppliers::was called`);
  try {
    const { fromUser } = req;
    const isCashier = await checkUserPermisson(fromUser._id, USER_ROLE.CASHIER.type);
    if (isCashier) {
      logger.info(`${CONTROLLER_NAME}::getSuppliers::permission denied`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.UNAUTHORIZED,
        errors: [USER_MESSAGE.ERROR.PERMISSION_DENIED]
      });
    }

    const suppliers = await SupplierModel.find({})
      .populate({
        path: 'products',
        select: '-supplier'
      });

    logger.info(`${CONTROLLER_NAME}::getSuppliers::success`);
    return res.status(HttpStatus.OK).json({
      data: { suppliers },
      messages: [SUPPLIER_MESSAGE.SUCCESS.GET_SUPPLIERS_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getSuppliers::error`);
    return next(error);
  }
}

module.exports = {
  addSupplier,
  getSuppliers
}