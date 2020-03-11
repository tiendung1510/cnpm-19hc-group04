const log4js = require('log4js');
const logger = log4js.getLogger('Controllers');
const Joi = require('@hapi/joi');
const responseUtil = require('../../utils/response.util');
const HttpStatus = require("http-status-codes");
const UserModel = require('./user.model');
const { LoginValidationSchema } = require('./validations/login.schema');
const { AddUserValidationSchema } = require('./validations/add-user.schema');
const { MESSAGE, CONTROLLER_NAME } = require('./user.constant');
const jwt = require('jsonwebtoken');
const privateKey = require('config').get('privateKey');

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

    if (user.password !== password) {
      logger.info(`${CONTROLLER_NAME}::login::wrong password`);

      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        errors: [MESSAGE.ERROR.USER_NOT_FOUND]
      });
    }

    logger.info(`${CONTROLLER_NAME}::login::login success`);

    return res.status(HttpStatus.OK).json({
      data: {
        user: {
          _id: user._id,
          role: user.role,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar
        },
        meta: { token: jwt.sign({ userId: user._id }, privateKey) },
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

    const userInfo = JSON.parse(JSON.stringify(req.body));

    const existedUser = await UserModel.findOne({ username: userInfo.username });
    if (existedUser) {
      if (existedUser.email === userInfo.email) {
        logger.info(`${CONTROLLER_NAME}::addUser::email is duplicated`);
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          errors: [MESSAGE.ERROR.DUPLICATED_EMAIL]
        });
      }

      logger.info(`${CONTROLLER_NAME}::addUser::username is duplicated`);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        errors: [MESSAGE.ERROR.DUPLICATED_USERNAME]
      });
    }

    const newUser = new UserModel(userInfo);
    await newUser.save();

    logger.info(`${CONTROLLER_NAME}::addUser::a new user was added`);

    return res.status(HttpStatus.OK).json({
      data: { user: newUser },
      messages: [MESSAGE.SUCCESS.ADD_USER_SUCCESS]
    });
  } catch (error) {
    logger.error(`${CONTROLLER_NAME}::addUser::error`, error);
    return next(error);
  }
}

module.exports = {
  login,
  addUser
};
