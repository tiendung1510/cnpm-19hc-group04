const Joi = require('@hapi/joi');

const acceptImportingRequestValidationSchema = Joi.object().keys({
  executor: Joi.string().required(),
  requiredProducts: Joi.array().required(),
  note: Joi.string()
});

module.exports = {
  acceptImportingRequestValidationSchema
}