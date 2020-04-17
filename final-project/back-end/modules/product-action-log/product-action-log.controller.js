const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const HttpStatus = require("http-status-codes");
const { CONTROLLER_NAME, PRODUCT_ACTION_LOG_MESSAGE } = require('./product-action-log.constant');
const ProductActionLogModel = require('./product-action-log.model');

const getProductActionLogs = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getProductActionLogs::was called`);
  try {
    const productActionLogs = await ProductActionLogModel.find({ executor: req.fromUser._id }).populate('product');
    logger.info(`${CONTROLLER_NAME}::getProductActionLogs::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { productActionLogs },
      messages: [PRODUCT_ACTION_LOG_MESSAGE.SUCCESS.GET_PRODUCT_ACTION_LOGS_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getProductActionLogs::error`);
    next(error);
  }
}

module.exports = {
  getProductActionLogs
}