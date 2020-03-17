const Joi = require('@hapi/joi');

const AddProductValidationSchema = Joi.object().keys({
  name: Joi.string(),
  image: Joi.string(),
  price: Joi.number(),
  availableQuantity: Joi.number(),
  category: Joi.string().required(),
  supplier: Joi.string().required()
});

module.exports = {
  AddProductValidationSchema
}