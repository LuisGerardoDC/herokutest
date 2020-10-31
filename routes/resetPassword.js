const express = require('express');
const jwt = require('jsonwebtoken');

const UsersServices = require('../services/users');
const sendEmail = require('../utils/emails/sendEmail');
const templateResetPassword = require('../utils/emails/template/resetPassword');

const { config } = require('../config');

const resetPasswordApi = (app) => {
  const router = express.Router();
  app.use('', router)

  const usersService = new UsersServices();

  router.post('/reset/password', async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await usersService.getUser(email);
      if(user.length <= 0){
        res.status(200).json({
          data: [],
          message: 'user does not exist'
        })
      }else{
        const payload = {
          email
        }
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '10m',
        })
        const template = templateResetPassword(token);
        const subject = 'Recuperar contraseña ✔'
        await sendEmail(email, subject, template);
        res.status(200).json({
          data: [],
          message: 'message send'
        })
      }
    } catch (error) {
      next(error);
    }
  })

  router.patch('/reset/password/:token', async(req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const decode = jwt.decode(token, config.authJwtSecret);
      const user = await usersService.getUser(decode.email);
      if(user.length <= 0){
        res.status(200).json({
          data: [],
          message: 'user does not exist'
        })
      }else{
        const id = user[0]._id;
        const updateUserId = await usersService.updatePassword(id, password);
        res.status(200).json({
          data: updateUserId,
          message: "updated password"
        })
      }
    } catch (error) {
      next(error);
    }
  })
}

module.exports = resetPasswordApi;