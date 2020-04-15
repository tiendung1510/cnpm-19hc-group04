const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const mongoose = require('mongoose');
const { IMPORTER_ASSIGNMENT_MESSAGE, CONTROLLER_NAME } = require('./importer-assignment.constant');
const ImporterAssignmentModel = require('./importer-assignment.model');
const CollectionSortingService = require('../../services/collection-sorting');

const getImporterAssignments = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::getImporterAssignments::was called`);
  try {
    let importerAssignments = await ImporterAssignmentModel.find({})
      .populate('importer')
      .populate('manager')
      .populate({
        path: 'importedProducts',
        populate: {
          path: 'product',
          populate: {
            path: 'supplier',
            select: '-products'
          }
        }
      });
    CollectionSortingService.sortByCreatedAt(importerAssignments, 'desc');

    logger.info(`${CONTROLLER_NAME}::getImporterAssignments::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { importerAssignments },
      messages: [IMPORTER_ASSIGNMENT_MESSAGE.SUCCESS.GET_IMPORTER_ASSIGNMENTS_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::getImporterAssignments::error`);
    next(error);
  }
}

module.exports = {
  getImporterAssignments
}