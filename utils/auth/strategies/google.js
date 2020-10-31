const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const UsersServices = require('../../../services/users')
const { config } = require('../../../config');

passport.use(
  new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: "/auth/google/callback"
  },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const usersServices = new UsersServices();
        const email = profile.email || `${profile.id}@gmail.com`;
        const data = await usersServices.getUser(email);

        if (data.length <= 0) {
          const user = {
            name: profile.displayName,
            email: email,
            password: profile.id,
            photoUrl: profile.photos[0].value
          };
          const data = await usersServices.createUser({ user });

          return cb(null, data);
        }

        return cb(null, data);
      } catch (error) {
        console.log(error);
      }

    }
  )
)