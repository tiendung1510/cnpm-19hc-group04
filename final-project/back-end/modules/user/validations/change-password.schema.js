const Joi = require('@hapi/joi');

const ChangePasswordValidationSchema = {
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmedNewPassword: Joi.string().required()
};

module.exports = {
  ChangePasswordValidationSchema
};