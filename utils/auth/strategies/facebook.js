const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const UsersServices = require('../../../services/users');
const { config } = require('../../../config');

passport.use(new FacebookStrategy({
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["id", "email", "displayName", "photos"]
},
  async function (accessToken, refresToken, profile, cb) {
    try {
      const usersServices = new UsersServices();
      const email = profile.email || `${profile.id}@facebook.com`;
      const getUser = await usersServices.getUser(email);

      if (getUser.length <= 0) {
        const user = {
          name: profile.displayName,
          email: email,
          password: profile.id,
          photoUrl: profile.photos[0].value
        }
        const data = await usersServices.createUser({ user });

        const userInfo = await usersServices.getUser(email);
        return cb(null, userInfo);
      }

      return cb(null, getUser);
    }
    catch (error) {
      console.log(error);
      next(error);
    }
  }
))