const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')

const UsersService = require('../../../services/users')

passport.use(
  new BasicStrategy(async function (email, password, cb) {
    const usersService = new UsersService()

    try {
      const userArray = await usersService.getUser(email);
      const user = userArray[0]
      if (!user) {
        return cb(boom.unauthorized(), false)
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return cb(boom.unauthorized(), false)
      }
      delete user.password

      return cb(null, user);
    } catch (error) {
      return cb(error)
    }
  })
)