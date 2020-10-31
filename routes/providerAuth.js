const express = require('express');
const passport = require('passport');

const { config } = require('../config/index');

require('../utils/auth/strategies/facebook')
require('../utils/auth/strategies/google')

const providerAuth = (app) => {
  const router = express();
  app.use('/', router);

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  router.get('/auth/facebook', passport.authenticate("facebook"));

  router.get('/auth/facebook/callback',
    passport.authenticate("facebook", { failureRedirect: 'http://localhost:8080/login' }),
    async (req, res, next) => {
      try{
        const { _id: id, name, email } = req.user[0];

        res.cookie('name', name.toString());
        res.cookie('email', email.toString());
        res.cookie('id', id.toString());
        res.redirect('http://localhost:8080/');
      }catch(error){
        next(error);
      }
    }
  )

  router.get('/auth/google', passport.authenticate("google", { scope: ['profile'] }));

  router.get('/auth/google/callback',
    passport.authenticate("google", { failureRedirect: 'http://localhost:8080/login' }),
    async (req, res, next) => {
      try{
        const { _id: id, name, email } = req.user[0];

        res.cookie('name', name.toString());
        res.cookie('email', email.toString());
        res.cookie('id', id.toString());
        res.redirect('http://localhost:8080/');
      }catch(error){
        next(error);
      }
    }
  )
}

module.exports = providerAuth;