const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const mongoose = require('mongoose');
const { WORK_ASSIGNMENT_MESSAGE } = require('./work-assignment.constant');
const { AddWorkAssignmentValidationSchema } = require('./validations/add-work-assignment.schema');
const UserModel = require('../user/user.model');
const WorkShiftModel = require('../work-shift/work-shift.model');
const WorkAssignmentModel = require('./work-assignment.model');
const { USER_MESSAGE } = require('../user/user.constant');
const { WORK_SHIFT_MESSAGE } = require('../work-shift/work-shift.constant');

const addWorkAssignment = async (req, res, next) => {
  logger.info(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::was called`);
  try {
    const { error } = Joi.validate(req.body, AddWorkAssignmentValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { fromUser } = req;
    const workAssignmentInfo = req.body;
    const workShift = await WorkShiftModel.findOne({ _id: workAssignmentInfo.workShift });
    if (!workShift) {
      logger.info(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::work shift not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [WORK_SHIFT_MESSAGE.ERROR.WORK_SHIFT_NOT_FOUND]
      });
    }

    const assigner = await UserModel.findOne({ _id: workAssignmentInfo.assigner });
    if (!assigner) {
      logger.info(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::assigner not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [USER_MESSAGE.ERROR.USER_NOT_FOUND]
      });
    }

    const duplicatedWorkAssignment = await WorkAssignmentModel.findOne({
      workShift: workShift._id,
      assigner: workAssignmentInfo.assigner
    });
    if (duplicatedWorkAssignment) {
      logger.info(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::duplicated work assignment`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [WORK_ASSIGNMENT_MESSAGE.ERROR.DUPLICATED_WORK_ASSIGNMENT]
      });
    }

    const newWorkAssignment = new WorkAssignmentModel({
      assigner: assigner._id,
      manager: fromUser._id,
      workShift: workShift._id,
      description: workAssignmentInfo.description
    });
    await newWorkAssignment.save();

    workShift.workAssignments.push(newWorkAssignment._id);
    await workShift.save();

    logger.info(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::a work assignment was added`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { workAssignment: newWorkAssignment },
      messages: [WORK_ASSIGNMENT_MESSAGE.SUCCESS.ADD_WORK_ASSIGNMENT_SUCCESS]
    });
  } catch (error) {
    logger.error(`${WORK_ASSIGNMENT_MESSAGE}::addWorkAssignment::error`);
    return next(error);
  }
}

const getWorkAssignmentsByAssignerID = async (req, res, next) => {
  logger.info(`${WORK_ASSIGNMENT_MESSAGE}::getWorkAssignmentsByAssignerID::was called`);
  try {
    const { assignerID } = req.params;
    const assigner = await UserModel.findOne({ _id: mongoose.Types.ObjectId(assignerID) });
    if (!assigner) {
      logger.info(`${WORK_ASSIGNMENT_MESSAGE}::getWorkAssignmentsByAssignerID::assigner not found`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [USER_MESSAGE.ERROR.USER_NOT_FOUND]
      });
    }

    let workAssignments = await WorkAssignmentModel.find({ assigner: assigner._id }).populate('workShift');
    workAssignments = await Promise.all(workAssignments.map(async (wa) => {
      const _wa = JSON.parse(JSON.stringify(wa));
      let workShift = await WorkShiftModel.findOne({ _id: _wa.workShift._id }).populate('workSchedule', '-workShifts');
      workShift = JSON.parse(JSON.stringify(workShift));
      delete workShift.workAssignments;
      _wa.workShift = workShift;
      return _wa;
    }));

    logger.info(`${WORK_ASSIGNMENT_MESSAGE}::getWorkAssignmentsByAssignerID::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { workAssignments },
      messages: [WORK_ASSIGNMENT_MESSAGE.SUCCESS.ADD_WORK_ASSIGNMENT_SUCCESS]
    });
  } catch (error) {
    logger.error(`${WORK_ASSIGNMENT_MESSAGE}::getWorkAssignmentsByAssignerID::error`);
    return next(error);
  }
}

module.exports = {
  addWorkAssignment,
  getWorkAssignmentsByAssignerID
}