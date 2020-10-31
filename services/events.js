const MongoLib = require('../lib/mongo');

class EventsServices{
  
  constructor(){
    this.mongoDB = new MongoLib();
    this.collection = 'events';
  }

  async createEvent(event){
    try {
      const eventId = await this.mongoDB.create(this.collection, event);
      return eventId;
    } catch (error) {
      console.error(error);
    }
  }

  async getEvents(filter){
    try {
      if(filter.price){
        filter = {
          ...filter,
          price: parseInt(filter.price),
          
        }
      }

      if(filter.location){
        const locationProccesed = filter.location.toLowerCase();
        filter= {
          ...filter,
          location: { $regex: locationProccesed, $options: 'i' }
        }
      }
      let query = filter;
      if (filter.location && filter.categorie){
        query = {
          $and: [
            { categorie: filter.categorie },
            { location: filter.location }
          ]
        };
      };
      const events = await this.mongoDB.getAll(this.collection, query);
      return events;
    } catch (error) {
      console.error(error);
    }
  }

  async getEventsById(id){
    try{
      const event = await this.mongoDB.get(this.collection, id);
      return event;
    }catch(error){
      console.error(error);
    }
  }
}

module.exports = EventsServices;