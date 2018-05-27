/**
 * Favorite Routes
 */

import { Router } from 'express';

import * as FavoriteController from '../controllers/favorite.controller';

const routes = new Router();

/**
 * CRUD
 */

routes.post(
  '/:model/:id',
  FavoriteController.find,
  FavoriteController.create
);

export default routes;
