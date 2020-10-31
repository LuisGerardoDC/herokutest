const joi = require('@hapi/joi');

const eventIdSchema = joi.number();

const createEventSchema = {
  name: joi.string().max(100).required(),
  online: joi.boolean().required(),
  url: joi.string().uri().when('online', {
    is: true,
    then: joi.string().uri().required(),
    otherwise: joi.optional()
  }),
  location: joi.string().required(),
  date: joi.date().min('now'),
  price: joi.number(),
  organizers: joi.array().required(),
  speakers: joi.array().required(),
  assistants:joi.array().default(),
  categories:joi.array().default(),
}

module.exports = {
  eventIdSchema,
  createEventSchema
}