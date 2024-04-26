import express from 'express';

const router = express.Router();

const initializeRoutes = (app) => {
  app.use('/', router);
};

export default initializeRoutes;
