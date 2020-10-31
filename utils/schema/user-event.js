const joi = require('@hapi/joi');

const createUserEventSchema = {
  userId: joi.string().regex(/^[0-9a-fA-F]/).required(),
  eventId: joi.string().regex(/^[0-9a-fA-F]/).required(),
};

module.exports = {
  createUserEventSchema
}