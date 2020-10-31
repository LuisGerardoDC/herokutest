const express = require('express');
const validationHandler = require('../utils/middleware/validationHandler');

const { createUserEventSchema } = require('../utils/schema/user-event');
const UserEventServices = require('../services/user-event');

const userEventApi = (app) => {
  const router = express.Router();
  app.use('/api/user-event', router);

  const userEventService = new UserEventServices();

  router.get('/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params
      const userEvents = await userEventService.getUserEventByUserId(userId);
      const idsEvents = userEvents.map((userEvent) => userEvent.eventId);
      res.status(200).json({
        data: idsEvents,
        message: "events ids listed"
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', validationHandler(createUserEventSchema),
    async(req, res, next) => {
      try {
        const data = req.body;
        console.log(data);
        const userEventId = await userEventService.createUserEvent(data);
        res.status(201).json({
          data: userEventId,
          message: "user-event created"
        });  
      } catch (error) {
        next(error);
      }
    }
  );

  router.delete('/', validationHandler(createUserEventSchema),
    async(req, res, next) => {
      try {
        const { userId, eventId } = req.body;
        const userEventIdDeleted = await userEventService.deleteUserEvent(userId, eventId);
        res.status(200).json({
          data: userEventIdDeleted,
          message: "user-event deleted"
        });  
      } catch (error) {
        next(error);
      }
    }
  );
};

module.exports = userEventApi;