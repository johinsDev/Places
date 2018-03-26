/**
 * API Routes
 */

import { Router } from 'express';
import HTTPStatus from 'http-status';

import APIError from '../services/error';

// Middlewares
import logErrorService from '../services/log';

const routes = new Router();

routes.use('/test', (req, res) => res.json('algo'));

routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);

routes.use(logErrorService);

export default routes;
