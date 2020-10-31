const express = require('express');

const EventsServices = require('../services/events');
const validationHandler = require('../utils/middleware/validationHandler');
const { createEventSchema } = require('../utils/schema/events');
const {PythonShell} = require('python-shell')

const eventsApi = (app) => {
  const router = express.Router();
  app.use('/api/events', router);

  const eventsService = new EventsServices();

  router.post('/', validationHandler(createEventSchema), async (req, res, next) => {
    try {
      const data = req.body;
      const event = {
        ...data,
        url: data.url ? data.url : "",
        price: data.price ? data.price : 0,
      }
      console.log(event);
      const eventId = await eventsService.createEvent(event);
      res.status(201).json({
        data: eventId,
        message: "event created"
      })
    } catch (error) {
      next(error);
      return false
    }
  })
  router.get('/recomended',async(req, res,next)=>{
    try {
        const data_query = req.query
        const id_user = data_query['idUser'];
        const options = {
          mode: 'json',
          args: [`${id_user}`],
          scriptPath: '../datascience/src',
        };
        PythonShell.run('main.py', options, async (err, results)=> {
          if (err) print(err)
          const rec_categories = results[0]
          let recommended_events=[];
          for(i =0 ; i < rec_categories.length; i++){
            let events = await eventsService.getEvents({categories: rec_categories[i]})
            recommended_events = recommended_events.concat(events)
          }
          res.status(200).json({
            data: recommended_events,
            message: "recomended categories"
          })
        });
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const data = req.query;
      const events = await eventsService.getEvents(data);
      res.status(200).json({
        data: events,
        message: "events listed"
      })
    } catch (error) {
      next(error);
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const event = await eventsService.getEventsById(id);
      res.status(200).json({
        data: event,
        message: "event listed"
      })
    } catch (error) {
      next(error);
    }
  })

  router.put('/', async (req, res, next) => {
    try{
      const data = req.body;
    }
    catch(error){
      next(error);
    }
  })
}

module.exports = eventsApi;