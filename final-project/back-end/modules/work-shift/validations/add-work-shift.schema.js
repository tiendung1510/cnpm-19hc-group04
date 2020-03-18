const Joi = require('@hapi/joi');

const AddWorkShiftValidationSchema = Joi.object().keys({
  workSchedule: Joi.string().required(),
  startTime: Joi.number().required(),
  endTime: Joi.number().required()
});

module.exports = {
  AddWorkShiftValidationSchema
}