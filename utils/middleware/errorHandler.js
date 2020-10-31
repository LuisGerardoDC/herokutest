const { config } = require('../../config/index');
const boom = require('@hapi/boom');

function withErroStack(err, stack) {
  if (config.dev) {
    return {
      ...err,
      stack
    };
  }
  return err;
}

function logErrors(err, req, res, next) {
  console.log(err);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;
  res.status(statusCode);
  res.json(withErroStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler
};