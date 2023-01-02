const Joi = require('joi')

const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const noteSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string().required(),
  desc: Joi.string().required(),
});

const validateNote = validator(noteSchema);

module.exports = validateNote;
