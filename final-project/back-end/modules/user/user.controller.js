const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const UserModel = require('./user.model');
const { LoginValidationSchema } = require('./validations/login.schema');
const { AddUserValidationSchema } = require('./validations/add-user.schema');
const { ChangePasswordValidationSchema } = require('./validations/change-password.schema');
const { MESSAGE, CONTROLLER_NAME, PASSWORD_SALT_ROUNDS } = require('./user.constant');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::login::was called`);
  try {
    const { error } = Joi.validate(req.body, LoginValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
      logger.info(`${CONTROLLER_NAME}::login::wrong username`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [MESSAGE.ERROR.USER_NOT_FOUND]
      });
    }

    const isRightPassword = await bcrypt.compare(password, user.password);
    if (!isRightPassword) {
      logger.info(`${CONTROLLER_NAME}::login::wrong password`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [MESSAGE.ERROR.USER_NOT_FOUND]
      });
    }

    logger.info(`${CONTROLLER_NAME}::login::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {
        user: {
          _id: user._id,
          role: user.role,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
        },
        meta: { token: jwt.sign({ _id: user._id }, config.get('jwt').secret) },
      },
      messages: [MESSAGE.SUCCESS.LOGIN_SUCCESS]
    });
  } catch (error) {
    logger.error('UserController::login::error', error);
    return next(error);
  }
}

const addUser = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::addUser::was called`);
  try {
    const { error } = Joi.validate(req.body, AddUserValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const newUserInfo = JSON.parse(JSON.stringify(req.body));
    const duplicatedUser = await UserModel.findOne({ username: newUserInfo.username });

    if (duplicatedUser) {
      if (duplicatedUser.username === newUserInfo.username) {
        logger.info(`${CONTROLLER_NAME}::addUser::username is duplicated`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          errors: [MESSAGE.ERROR.DUPLICATED_USERNAME]
        });
      }

      logger.info(`${CONTROLLER_NAME}::addUser::email is duplicated`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [MESSAGE.ERROR.DUPLICATED_EMAIL]
      });
    }

    const newUser = new UserModel(newUserInfo);
    await newUser.save();

    logger.info(`${CONTROLLER_NAME}::addUser::a new user was added`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { user: newUser },
      messages: [MESSAGE.SUCCESS.ADD_USER_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addUser::error`, error);
    return next(error);
  }
}

const getUsers = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::addUser::was called`);
  try {
    let users = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          role: 1,
          fullname: 1,
          email: 1,
          phone: 1,
          dateOfBirth: 1,
          avatar: 1
        }
      }
    ]);

    logger.info(`${CONTROLLER_NAME}::getUsers::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: { users },
      messages: [MESSAGE.SUCCESS.GET_USERS_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addUser::error`, error);
    return next(error);
  }
}

const changePassword = async (req, res, next) => {
  logger.info(`${CONTROLLER_NAME}::changePassword::was called`);
  try {
    const { error } = Joi.validate(req.body, ChangePasswordValidationSchema);
    if (error) {
      return responseUtil.joiValidationResponse(error, res);
    }

    const { fromUser } = req;
    const user = await UserModel.findOne({ _id: fromUser._id });
    const { currentPassword, newPassword, confirmedNewPassword } = req.body;

    if (newPassword !== confirmedNewPassword) {
      logger.info(`${CONTROLLER_NAME}::changePassword::confirmed password does not match`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [MESSAGE.ERROR.CONFIRMED_NEW_PASSWORD_NOT_MATCHED]
      });
    }

    const isRightPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isRightPassword) {
      logger.info(`${CONTROLLER_NAME}::changePassword::wrong current password`);
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [MESSAGE.ERROR.WRONG_CURRENT_PASSWORD]
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);
    user.password = hashedNewPassword;
    user.save();

    logger.info(`${CONTROLLER_NAME}::changePassword::success`);
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      data: {},
      messages: [MESSAGE.SUCCESS.CHANGE_PASSWORD_SUCCESS]
    })
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::changePassword::error`, error);
    return next(error);
  }
}

module.exports = {
  login,
  addUser,
  getUsers,
  changePassword
};
