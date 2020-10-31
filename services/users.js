const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UsersServices {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser(email) {
    try {
      const query = { email: email };
      const user = await this.mongoDB.getAll(this.collection, query);
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async createUser({ user }) {
    try {
      const createUserId = await this.mongoDB.create(this.collection, user);
      return createUserId;
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(id, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = {
        password: hashedPassword
      }
      const updateUserId = await this.mongoDB.update(this.collection, id, data);
      return updateUserId;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UsersServices;