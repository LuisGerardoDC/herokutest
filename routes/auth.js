const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const ApiKeysService = require('../services/apiKeys');
const UsersServices = require('../services/users');
const UsersTempServices = require('../services/usersTemp');
const validationHandler = require('../utils/middleware/validationHandler');
const sendEmail = require('../utils/emails/sendEmail');
const templateAuthTwoFactor = require('../utils/emails/template/authTwoFactors');

const { createUserSchema } = require('../utils/schema/users')
const { config } = require('../config');

require('../utils/auth/strategies/basic');

const authApi = (app) => {
  const router = express.Router();
  app.use('', router);

  const apiKeysService = new ApiKeysService();
  const usersTempService = new UsersTempServices();
  const usersService = new UsersServices();

  router.post('/login', async (req, res, next) => {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) {
          next(boom.unauthorized(), false);
        }

        req.login(user, { session: false }, async function (error) {
          if (error) {
            next(error);
          }

          const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized());
          }

          const { _id: id, name, email } = user

          const payload = {
            sub: id,
            name,
            email,
            scope: apiKey.scopes
          }

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          });

          res.status(200).json({
            token,
            user: { id, name, email }
          });
          res.send();
        })
      } catch (error) {
        next(error);
      }
    })(req, res, next)
  })

  router.post('/register', validationHandler(createUserSchema), async (req, res, next) => {
    const user = req.body;

    try {
      const userExists = await usersService.getUser(user.email);

      if (userExists.length <= 0) {
        const createdUserIdTemp = await usersTempService.createUser({ user })

        const payload = {
          email: user.email
        }
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '10m',
        })
        const template = templateAuthTwoFactor(token);
        const subject = 'Confirma tu usuario ✔';
        sendEmail(user.email, subject, template);

        res.status(201).json({
          data: createdUserIdTemp,
          message: 'verify email'
        });
      } else {
        res.status(200).json({
          data: [],
          message: 'user exists'
        });
      }

    } catch (error) {
      next(error);
    }
  })

  router.get('/register/:token', async (req, res, next) => {
    const { token } = req.params;
    const decode = jwt.decode(token, config.authJwtSecret);
    const email = decode.email

    try {
      const userTemp = await usersTempService.getUser(email);

      if (userTemp.length > 0) {
        const user = userTemp[0]
        const createdUserId = await usersService.createUser({ user });
        const deleteUserIdTemp = await usersTempService.deleteUser(email);

        res.redirect('http://localhost:8080/login');
      } else {
        res.status(200).json({
          data: [],
          message: "user cannot be created"
        });
      }
    } catch (error) {
      next(error);
    }
  })
}

module.exports = authApi;