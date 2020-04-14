const Joi = require('@hapi/joi');

const acceptImportingRequestsValidationSchema = Joi.object().keys({
  executor: Joi.string().required(),
  requests: Joi.array().required(),
  importedProducts: Joi.array().required(),
  priceTotal: Joi.number().required(),
  note: Joi.string(),
});

module.exports = {
  acceptImportingRequestsValidationSchema
}