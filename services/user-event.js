const MongoLib = require('../lib/mongo');

class UserEventServices {
  constructor(){
    this.mongoDB = new MongoLib();
    this.collection = 'user-event';
  }

  async getUserEventByUserId(userId){
    try {
      const query = { userId: userId }
      const events = await this.mongoDB.getAll(this.collection, query);
      return events;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserEventId(userId, eventId){
    try {
      const query = {
        $and: [
          { userId: userId },
          { eventId: eventId }
        ]
      };
      const userEvent = await this.mongoDB.getAll(this.collection, query);
      return userEvent[0]._id;
    } catch (error) {
      console.log(error);
    }
  }

  async createUserEvent(data){
    try{
      const eventId = await this.mongoDB.create(this.collection, data);
      return eventId;
    }catch(error){
      console.error(error);
    }
  }

  async deleteUserEvent(userId, eventId){
    try{
      const userEventId = await this.getUserEventId(userId, eventId);
      const userEventIdDeleted = await this.mongoDB.delete(this.collection, userEventId);
      return userEventIdDeleted;
    }catch(error){
      console.error(error);
    }
  }
};

module.exports =  UserEventServices;