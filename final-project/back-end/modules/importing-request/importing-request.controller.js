const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const mongoose = require('mongoose');
const { CONTROLLER_NAME, IMPORTING_REQUEST_MESSAGE, STATUS } = require('./importing-request.constant');
const { createImportingRequestValidationSchema } = require('./validations/create-importing-request.schema');
const ProductModel = require('../product/product.model');
const _ = require('lodash');
const ImportingRequestModel = require('./importing-request.model');
const RequiredProductModel = require('../required-product/required-product.model');
const { acceptImportingRequestsValidationSchema } = require('./validations/accept-importing-requests.schema');
const UserModel = require('../user/user.model');
const CollectionSortingService = require('../../services/collection-sorting');
const ImporterAssignmentModel = require('../importer-assignment/importer-assignment.model');
const ImportedProductModel = require('../imported-product/imported-product.model');

const createImportingRequest = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::createImportingRequest::was called`);
  try {
    const { error } = Joi.validate(req.body, createImportingRequestValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { products } = req.body;
    if (products.length === 0) {
      logger.info(`${CONTROLLER_NAME}::createImportingRequest::list required products cannot be empty`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.EMPTY_LIST_REQUIRED_PRODUCTS]
      });
    }

    const availableProducts = await ProductModel.find({});
    const notAvailableProducts = products.filter(
      pid => _.findIndex(availableProducts, ap => ap._id.toString() === pid) < 0
    );
    if (notAvailableProducts.length > 0) {
      logger.info(`${CONTROLLER_NAME}::createImportingRequest::required product not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        data: { notAvailableProducts },
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.REQUIRED_PRODUCT_NOT_FOUND]
      });
    }

    const newImportingRequest = new ImportingRequestModel({
      sender: req.fromUser._id
    });
    await newImportingRequest.save();

    const requiredProducts = await Promise.all(
      products.map(async (pid) => {
        const product = new RequiredProductModel({
          product: pid,
          importingRequest: newImportingRequest._id
        });
        await product.save();
        return product;
      })
    );

    newImportingRequest.requiredProducts = requiredProducts.map(rp => rp._id);
    await newImportingRequest.save();

    logger.info(`${CONTROLLER_NAME}::createImportingRequest::a new importing request was created`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { importingRequest: newImportingRequest },
      messages: [IMPORTING_REQUEST_MESSAGE.SUCCESS.CREATE_IMPORTING_REQUEST_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::createImportingRequest::error`);
    next(error);
  }
}

const getImportingRequests = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getImportingRequests::was called`);
  try {
    let importingRequests = await ImportingRequestModel.find({})
      .populate('sender')
      .populate('executor')
      .populate('accepter')
      .populate({
        path: 'requiredProducts',
        select: '-importingRequest',
        populate: {
          path: 'product',
          populate: { path: 'supplier' }
        }
      });

    CollectionSortingService.sortByCreatedAt(importingRequests, 'desc');

    logger.info(`${CONTROLLER_NAME}::getImportingRequests::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { importingRequests },
      messages: [IMPORTING_REQUEST_MESSAGE.SUCCESS.GET_IMPORTING_REQUESTS_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getImportingRequests::error`);
    next(error);
  }
}

const acceptImportingRequests = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::was called`);
  try {
    const { error } = Joi.validate(req.body, acceptImportingRequestsValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    let { executor, requests, priceTotal, importedProducts } = req.body;
    executor = await UserModel.findOne({ _id: mongoose.Types.ObjectId(executor) });
    if (!executor) {
      logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::executor not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.EXECUTOR_NOT_FOUND]
      });
    }

    const executorNotFinishedAssignment = await ImporterAssignmentModel.findOne({
      importer: mongoose.Types.ObjectId(executor._id),
      finishedAt: null
    });
    if (executorNotFinishedAssignment) {
      logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::executor's assignment has not been finished`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.EXECUTOR_ASSIGNMENT_HAS_NOT_BEEN_FINISHED]
      });
    }

    const availableRequests = await ImportingRequestModel.find({});
    const notAvailableRequests = requests.filter(r => availableRequests.findIndex(ar => ar._id.toString() === r._id) < 0);
    if (notAvailableRequests.length > 0) {
      logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::importing request not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        data: { notAvailableRequests },
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.IMPORTING_REQUEST_NOT_FOUND]
      });
    }

    let acceptedRequests = requests.filter(r => availableRequests.findIndex(ar => ar._id.toString() === r._id && ar.acceptedAt) >= 0);
    if (acceptedRequests.length > 0) {
      logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::cannot reaccept importing request`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        data: { acceptedRequests },
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.REACCEPTED_IMPORTING_REQUEST]
      });
    }

    acceptedRequests = await Promise.all(
      requests.map(async (r) => {
        const request = await ImportingRequestModel.findOne({ _id: mongoose.Types.ObjectId(r._id) });
        request.executor = executor;
        request.accepter = req.fromUser._id;
        request.status = STATUS.ACCEPTED.type;
        request.acceptedAt = new Date();
        await request.save();
        return request;
      })
    );

    const newImportedProducts = await Promise.all(
      importedProducts.map(async (p) => {
        const importedProduct = new ImportedProductModel({
          product: p.productID,
          requiredQuantity: p.requiredQuantity
        });
        await importedProduct.save();
        return importedProduct;
      })
    );

    let newImporterAssignment = new ImporterAssignmentModel({
      importer: executor,
      manager: req.fromUser._id,
      importedProducts: newImportedProducts.map(p => p._id),
      importingRequests: acceptedRequests.map(ar => ar._id),
      priceTotal
    });
    await newImporterAssignment.save();

    newImporterAssignment = await ImporterAssignmentModel.findOne({ _id: newImporterAssignment._id })
      .populate('importer')
      .populate('manager')
      .populate({
        path: 'importedProducts',
        populate: { path: 'product' }
      });

    logger.info(`${CONTROLLER_NAME}::acceptImportingRequests::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { importerAssignment: newImporterAssignment },
      messages: [IMPORTING_REQUEST_MESSAGE.SUCCESS.ACCEPT_IMPORTING_REQUEST_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::acceptImportingRequests::error`);
    next(error);
  }
}

const cancelImportingRequest = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::cancelImportingRequest::was called`);
  try {
    const { importingRequestID } = req.params;
    const deletedImporingRequest = await ImportingRequestModel.findOneAndDelete({ _id: mongoose.Types.ObjectId(importingRequestID) });
    if (!deletedImporingRequest) {
      logger.info(`${CONTROLLER_NAME}::cancelImportingRequest::importing request not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        data: {},
        errors: [IMPORTING_REQUEST_MESSAGE.ERROR.IMPORTING_REQUEST_NOT_FOUND]
      });
    }

    let importingRequests = await ImportingRequestModel.find({})
      .populate('sender')
      .populate('executor')
      .populate('accepter')
      .populate({
        path: 'requiredProducts',
        select: '-importingRequest',
        populate: {
          path: 'product',
          populate: { path: 'supplier' }
        }
      });

    CollectionSortingService.sortByCreatedAt(importingRequests, 'desc');

    logger.info(`${CONTROLLER_NAME}::cancelImportingRequest::an importing request was cancelled`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { importingRequests },
      messages: [IMPORTING_REQUEST_MESSAGE.SUCCESS.CANCEL_IMPORTING_REQUEST_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::cancelImportingRequest::error`);
    next(error)
  }
}

module.exports = {
  createImportingRequest,
  getImportingRequests,
  acceptImportingRequests,
  cancelImportingRequest
}