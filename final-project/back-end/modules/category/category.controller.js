const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const { CATEGORY_MESSAGE, CONTROLLER_NAME } = require('./category.constant');
const { USER_ROLE, USER_MESSAGE } = require('../user/user.constant');
const { AddCategoryValidationSchema } = require('./validations/add-category.schema');
const { checkUserPermisson } = require('../user/user.service');
const CategoryModel = require('./category.model');

const addCategory = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::addCategory::was called`);
  try {
    const { error } = Joi.validate(req.body, AddCategoryValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { fromUser } = req;
    const isImporter = await checkUserPermisson(fromUser._id, USER_ROLE.IMPORTER.type);
    if (!isImporter) {
      logger.info(`${CONTROLLER_NAME}::addCategory::permission denied`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        errors: [USER_MESSAGE.ERROR.PERMISSION_DENIED]
      });
    }

    const categoryInfo = req.body;
    const duplicatedCategory = await CategoryModel.findOne({ name: categoryInfo.name });
    if (duplicatedCategory) {
      logger.info(`${CONTROLLER_NAME}::addCategory::duplicated name`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [CATEGORY_MESSAGE.ERROR.DUPLICATED_CATEGORY]
      })
    }

    const newCategory = new CategoryModel(categoryInfo);
    await newCategory.save();

    logger.info(`${CONTROLLER_NAME}::addCategory::a new category was added`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { category: newCategory },
      messages: [CATEGORY_MESSAGE.SUCCESS.ADD_CATEGORY_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addCategory::error`);
    return next(error);
  }
}

const getCategories = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getCategories::was called`);
  try {
    const { fromUser } = req;
    const isCashier = await checkUserPermisson(fromUser._id, USER_ROLE.CASHIER.type);
    if (isCashier) {
      logger.info(`${CONTROLLER_NAME}::getCategories::permission denied`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        errors: [USER_MESSAGE.ERROR.PERMISSION_DENIED]
      });
    }

    const categories = await CategoryModel.find({}).populate('products', '-category');

    logger.info(`${CONTROLLER_NAME}::getCategories::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { categories },
      messages: [CATEGORY_MESSAGE.SUCCESS.GET_CATEGORIES_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getCategories::error`);
    return next(error);
  }
}

module.exports = {
  addCategory,
  getCategories
}