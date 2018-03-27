/**
 * Place Routes
 */

import { Router } from 'express';

import * as PlaceController from '../controllers/place.controller';

const routes = new Router();

/**
 * CRUD
 */
routes.get('/', PlaceController.index);
routes.get('/:id', PlaceController.show);
routes.patch(
  '/:id',
  PlaceController.update
);
routes.delete('/:id', PlaceController.destroy);
routes.post(
  '/',
  PlaceController.create,
);

export default routes;
