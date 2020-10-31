const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UsersTempServices {
  constructor() {
    this.collection = 'users-temp';
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
    let { name, email, password, isAdmin, photoUrl } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    isAdmin ? isAdmin = isAdmin : isAdmin = false;

    try {
      const createUserId = await this.mongoDB.create(this.collection, {
        name,
        email,
        password: hashedPassword,
        isAdmin,
        photoUrl
      });
      return createUserId;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(email) {
    try {
      const user = await this.getUser(email);
      const id = user[0]._id;
      const updateUserId = await this.mongoDB.delete(this.collection, id);
      return updateUserId;
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UsersTempServices;