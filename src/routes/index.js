/**
 * API Routes
 */

import { Router } from 'express';
import HTTPStatus from 'http-status';

import PlaceRoutes from './place.routes';

import APIError from '../services/error';

// Middlewares
import logErrorService from '../services/log';

const routes = new Router();

routes.use('/places', PlaceRoutes);

routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);

routes.use(logErrorService);

export default routes;
