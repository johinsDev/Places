/**
 * Favorite Routes
 */

import { Router } from 'express';

import * as FavoriteController from '../controllers/favorite.controller';
import * as  Middlewares from '../middlewares/Find';

const routes = new Router();

/**
 * CRUD
*/

routes.post(
  '/:model/:id',
  Middlewares.find(),
  FavoriteController.create
);

export default routes;
