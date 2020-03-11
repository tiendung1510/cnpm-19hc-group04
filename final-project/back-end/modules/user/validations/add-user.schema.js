const Joi = require('@hapi/joi');

const AddUserValidationSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string(),
  dateOfBirth: Joi.string(),
  avatar: Joi.string()
}
);

module.exports = {
  AddUserValidationSchema
};