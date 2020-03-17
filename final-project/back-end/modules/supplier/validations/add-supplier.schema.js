const Joi = require('@hapi/joi');

const AddSupplierValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  phone: Joi.string(),
  address: Joi.string()
});

module.exports = {
  AddSupplierValidationSchema
};