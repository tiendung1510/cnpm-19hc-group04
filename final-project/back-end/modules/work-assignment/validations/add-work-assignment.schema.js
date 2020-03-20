const Joi = require('@hapi/joi');

const AddWorkAssignmentValidationSchema = Joi.object().keys({
  workShift: Joi.string().required(),
  assigner: Joi.string().required(),
  description: Joi.string()
});

module.exports = {
  AddWorkAssignmentValidationSchema
}