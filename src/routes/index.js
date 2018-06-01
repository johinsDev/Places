/**
 * API Routes
 */

import { Router } from 'express';
import HTTPStatus from 'http-status';

import PlaceRoutes from './place.routes';
import UserRoutes from './user.routes';
import FavoriteRoutes from './favorite.routes';
import CommentRoutes from './comment.routes';

import APIError from '../services/error';

// Middlewares
import logErrorService from '../services/log';
import { authJwt } from '../services/auth';

const routes = new Router();

routes.use('/places', PlaceRoutes);
routes.use('/users', UserRoutes);
routes.use('/favorites', authJwt, FavoriteRoutes);
routes.use('/comments', authJwt, CommentRoutes);

routes.all('*', (req, res, next) =>
  next(new APIError('Not Found!', HTTPStatus.NOT_FOUND, true)),
);

routes.use(logErrorService);

export default routes;
